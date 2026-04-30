<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class authController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:student,teacher',
        ]);

        $user=User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>$request->password,
            'role'=>$request->role,
        ]);
        if($request->role=='student'){
            Student::create([
                'user_id'=>$user->id,
            ]);
        }else if($request->role=='teacher'){
            Teacher::create([
                'user_id'=>$user->id,
            ]);
        }

        $token=$user->createToken('api_token')->plainTextToken;

        return response()->json([
            'message'=>'User registered successfully',
            'user'=>$user,
            'token'=>$token,
        ],201);
    }

    public function login(Request $request){
        $request->validate([
            'email'=>'required|string|email',
            'password'=>'required|string|min:8',
        ]);

        $user=User::where('email', $request->email)->first();
        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json([
                'message'=>'Invalid credentials',
            ],401);
        }
        
        $token=$user->createToken('api_token')->plainTextToken;
        return response()->json([
            'message'=>'User logged in successfully',
            'user'=>$user,
            'token'=>$token,
        ],200); 
    }

    public function logout(Request $request){
        $user=$request->user();
        if(!$user){
            return response()->json([
                'message'=>'User not found',
            ],404); 
        }
        $user->currentAccessToken()->delete();
        return response()->json([
            'message'=>'User logged out successfully',
        ],200); 
    }

    public function checkAuth(Request $request){
        $user=$request->user();
        if(!$user){
            return response()->json([
                'message'=>'User not found',
            ],404); 
        }
        return response()->json([
            'user'=>$user,
        ],200); 
    }
}
