<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Student;
use Illuminate\Http\Request;

class bookingsController extends Controller
{
    public function newBooking(Request $request){   
        $request->validate([
            'teacher_id'=>'required|exists:teachers,id',
            'scheduled_day'=>'required|string',
            'scheduled_time'=>'required|date_format:H:i',
            'price'=>'required|decimal:2|min:0'
        ]);

        $user=$request->user();
        if(!$user){
            return response()->json([
                'message'=>'Unauthorized Access',
            ],401); 
        }
        
        $student=Student::where('user_id',$user->id)->first();
        if(!$student){
            return response()->json([
                'message'=>'Unauthorized Access',
            ],401); 
        }

        $booking=Booking::create([
            'teacher_id'=>$request->teacher_id,
            'student_id'=>$student->id,
            'scheduled_day'=>$request->scheduled_day,
            'scheduled_time'=>$request->scheduled_time,
            'price'=>$request->price,
        ]);

        return response()->json([
            'message'=>'Booking created successfully',
            'booking'=>$booking,
        ],200); 
    }
}
