<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LiveKitService;
use App\Services\SupabaseStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class liveSessionsController extends Controller
{
    public function getToken(Request $request, LiveKitService $liveKit){
        $request->validate([
            "room_name"=>"required|string",            
        ]);

        $user=$request->user();

        $token=$liveKit->generateToken(
            $request->room_name,
            $user->name
        );

        return response()->json([
            "url"=>config('livekit.url'),
            "token"=>$token
        ],200);
    }



    public function getTeacherLiveSessions(Request $request, SupabaseStorageService $storage){
        $user=$request->user();
        if(!$user){
            return response()->json([
                "message"=>"Unauthorized"
            ],401);
        }
        $teacher=$user->teacher;
        if(!$teacher){
            return response()->json([
                "message"=>"Unautharized Access"
            ],401);
        }

        $bookings=$teacher->approvedBookings()->with('liveSession','student.user')->get();
        $live_sessions=[];
        foreach($bookings as $booking){
            if($booking->student->user->avatar){
                $avatar=$storage->getPublicUrl($booking->student->user->avatar);
                $booking->student->user->avatar=$avatar;
            }
            $session=$booking->liveSession;
            $session->student=$booking->student;
            $live_sessions[]=$session;
        }

        return response()->json([
            "message"=>"Live sessions fetched successfully",
            "live_sessions"=>$live_sessions
        ],200);

    }
}
