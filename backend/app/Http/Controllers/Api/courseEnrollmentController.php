<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class courseEnrollmentController extends Controller
{
    public function createEnrollment(Request $request){
        $request->validate([
            "course_id"=>"required|exists:courses,id",
            "student_id"=>"required|exists:students,id",
        ]);

        $user=$request->user();
        if(!$user){
            return response()->json([
                "message"=>"Unauthenticated",
                
            ],401);
        }
        $student=$user->student;
        if(!$student){
            return response()->json([
                "message"=>"Unautharized Access"
            ],403);
        }

        $enrollment=DB::transaction(function() use ($request,$student){
            $existingEnrollment=CourseEnrollment::where('student_id',$student->id)
                                                ->where('course_id',$request->course_id)->first();
            
            if($existingEnrollment){
                return response()->json([
                    "success"=>false,
                    "message"=>"You are already enrolled in this course"
                ],409);
            }

            $enrollment=CourseEnrollment::create([
                "student_id"=>$student->id,
                "course_id"=>$request->course_id,
            ]);

            return $enrollment;
        });

        return response()->json([
            "success"=>true,
            "message"=>"You are successfully enrolled in this course",
            "enrollment"=>$enrollment
        ],201);
    }
}
