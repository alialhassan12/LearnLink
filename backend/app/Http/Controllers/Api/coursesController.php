<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;

class coursesController extends Controller
{
    public function createCourse(Request $request){
        $request->validate([
            "teacher_id"=>"required|exists:teachers,id",
            "category_id"=>"required|exists:categories,id",
            "title"=>"required|string",
            "description"=>"required|string",
            "thumbnail"=>"required|string",
            "language"=>"required|string",
            "price"=>"required|numeric",
        ]);

        $user=$request->user();
        if(!$user){
            return response()->json([
                "success"=>false,
                "message"=>"You are not authorized to complete this action",
            ],401);
        }

        $teacher = $user->teacher;
        if(!$teacher){
            return response()->json([
                "success"=>false,
                "message"=>"You are not authorized to complete this action",
            ],403);
        }
        
        $category = Category::findOrFail($request->category_id);

        $course=Course::create([
            "teacher_id"=>$teacher->id,
            "category_id"=>$category->id,
            "title"=>$request->title,
            "description"=>$request->description,
            "thumbnail"=>$request->thumbnail,
            "language"=>$request->language,
            "price"=>$request->price,
        ]);

        return response()->json([
            "success"=>true,
            "message"=>"Course created successfully",
            "course"=>$course,
        ],201);
    }
}
