<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class coursesController extends Controller
{
    public function createCourse(Request $request){
        $request->validate([
            "teacher_id"=>"required|exists:teachers,id",
            "category_id"=>"required|exists:categories,id",
            "title"=>"required|string",
            "description"=>"required|string",
            "thumbnail"=>"required|file|mimes:png,jpg,jpeg,webp",
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
        
    }
}
