<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiChat;
use App\Models\AiMessage;
use App\Models\Subscription;
use App\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class aiMessagesController extends Controller
{
    public function sendMessage(Request $request, AiService $aiService){
        $request->validate([
            "prompt"=>"required|string",
            "ai_chat_id"=>"nullable|exists:ai_chats,id",
            "chat_title"=>"nullable|string",
        ]);
        try{
            $user=auth('sanctum')->user();
            if(!$user){
                return response()->json([
                    "message"=>"Unauthorized Access"
                ],401);
            }

            // check subscription plan
            $subscription=Subscription::with('plan')->where('user_id',$user->id)->first();
            if(!$subscription || $subscription->status !=='active'){
                return response()->json([
                    "message"=>"You are not subscribed to any plan"
                ],400);
            }

            $chat=null;
            
            if(!$request->filled('ai_chat_id')){
                $chat=AiChat::create([
                    "user_id"=>$user->id,
                    "title"=>$request->chat_title ?? "New Chat",
                ]);
            }else{
                $chat=AiChat::where('id',$request->ai_chat_id)->where('user_id',$user->id)->firstOrFail();
            }

            // check plan limit
            if($subscription->tokens_used >= $subscription->plan->features['ai_tokens_per_month']){
                return response()->json([
                    "message"=>"You have exceeded your monthly AI token limit"
                ],400);
            }

            // call gemini api
            $aiResponse=$aiService->generate($request->prompt);

            return response()->json($aiResponse);

            $aiText=$aiResponse['candidates'][0]['content']['parts'][0]['text'];
            $aiTokenUsage=$aiResponse['usageMetadata']['totalTokenCount'];

            // update token usage
            $subscription->tokens_used+=$aiTokenUsage;
            $subscription->save();

            // save user and ai messages
            $aiMessage=DB::transaction(function()use($chat,$request,$aiText,$aiTokenUsage){
                AiMessage::create([
                    "ai_chat_id"=>$chat->id,
                    "role"=>"user",
                    "content"=>$request->prompt,
                    "type"=>"text",
                    "tokens_used"=>0
                ]);
        
                $aiMessage=AiMessage::create([
                    "ai_chat_id"=>$chat->id,
                    "role"=>"assistant",
                    "content"=>$aiText,
                    "type"=>"text",
                    "tokens_used"=>$aiTokenUsage
                ]);
                return $aiMessage;
            });

            return response()->json([
                "message"=>"Message sent successfully",
                "chat"=>$chat,
                "ai_message"=>$aiMessage
            ],200);
        }catch(\Throwable $e){
            return response()->json([
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    public function getMessages(Request $request){
        $request->validate([
            "ai_chat_id"=>'required|exists:ai_chats,id'
        ]);

        $user=auth('sanctum')->user();
        if(!$user){
            return response()->json([
                "message"=>"Unauthenticated"
            ],401);
        }
        $chat=AiChat::where('id',$request->ai_chat_id)->where('user_id',$user->id)->firstOrFail();
        
        $messages=$chat->load('aiMessages')->aiMessages;

        if($messages->isEmpty()){
            return response()->json([
                "message"=>"No messages found"
            ],404);
        }

        return response()->json([
            "message"=>"Messages retrieved successfully",
            "messages"=>$messages
        ],200);
    }
}
