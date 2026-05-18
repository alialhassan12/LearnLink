<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseSection;
use App\Services\SupabaseStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class coursesController extends Controller
{
    public function createCourse(Request $request,SupabaseStorageService $storage){
        $request->validate([
            "category_id"=>"required|exists:categories,id",
            "title"=>"required|string",
            "description"=>"required|string",
            "thumbnail"=>"required|file|mimes:jpeg,png,jpg,webp|max:5120",
            "language"=>"required|string",
            "price"=>"required|numeric",

            "sections"=>"required|array",
            "sections.*.title"=>"required|string",
            "sections.*.order"=>"required|integer",

            "sections.*.materials"=>"required|array",
            "sections.*.materials.*.title"=>"required|string",
            "sections.*.materials.*.type"=>"required",
            "sections.*.materials.*.file"=>"required|file",
            "sections.*.materials.*.size"=>"required|integer",
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

        $course=DB::transaction(function() use ($request,$teacher,$storage){
            $thumbnailPath=$storage->uploadthumbnail(
                $request->thumbnail,
                $request->title,
            );
            if(!$thumbnailPath){
                throw new \Exception("Failed to upload thumbnail");
            }
            $course=Course::create([
                "teacher_id"=>$teacher->id,
                "category_id"=>$request->category_id,
                "title"=>$request->title,
                "description"=>$request->description,
                "thumbnail"=>$thumbnailPath,
                "language"=>$request->language,
                "price"=>$request->price,
            ]);

            foreach ($request->sections as $sectionData) {
                $section=CourseSection::create([
                    "course_id"=>$course->id,
                    "title"=>$sectionData['title'],
                    "order"=>$sectionData['order'],
                ]);

                foreach ($sectionData['materials'] as $materialData) {
                    $materialPath=$storage->uploadSectionMaterials(
                        $materialData['file'],
                        $course->title,
                        $section->title,
                        $materialData['title']
                    );

                    CourseMaterial::create([
                        "section_id"=>$section->id,
                        "title"=>$materialData['title'],
                        "path"=>$materialPath,
                        "type"=>$materialData['type'],
                        "size"=>$materialData['size'],
                    ]);
                }
            }
            
            // make course published after successfully created
            $course->status="published";
            $course->save();

            return $course;
        });

        return response()->json([
            "success"=>true,
            "message"=>"Course created successfully",
            "course"=>$course
        ],201);
    }

    public function getTeacherCourses(Request $request, SupabaseStorageService $storage){
        $user=$request->user();
        $teacher=$user->teacher;
        if(!$user || !$teacher){
            return response()->json([
                "success"=>false,
                "message"=>"Unautharized Access"
            ],403);
        }

        $courses=$teacher->courses()->with('category')->get();
        
        if($courses->isEmpty()){
            return response()->json([
                "success"=>false,
                "message"=>"No courses found"
            ],404);
        }

        // Add public url to thumbnail
        $courses->each(function($course) use ($storage){
            $course->thumbnail=$storage->getPublicUrl($course->thumbnail);
        });

        return response()->json([
            "success"=>true,
            "message"=>"Courses fetched successfully",
            "courses"=>$courses
        ],200);
    }

    public function getCourses(Request $request, SupabaseStorageService $storage){
        $courses=Course::query()
                ->with('teacher.user','category')
                ->where('status','published')
                ->orderBy('created_at','desc')
                ->get();
        
        if($courses->isEmpty()){
            return response()->json([
                "success"=>false,
                "message"=>"No courses found"
            ],404);
        }

        $courses->each(function($course) use ($storage){
            if($course->thumbnail){
                $course->thumbnail=$storage->getPublicUrl($course->thumbnail);
            }
            if($course->teacher->user->avatar){
                $course->teacher->user->avatar=$storage->getPublicUrl($course->teacher->user->avatar);
            }
        });

        return response()->json([
            "message"=>"Courses fetched successfully",
            "courses"=>$courses
        ],200);
    }

    public function getCourseById($id,Request $request,SupabaseStorageService $storage){
        $course=Course::whereId($id)->with('teacher.user','category','sections')->first();
        if(!$course){
            return response()->json([
                'message'=>'No course found'
            ],404);
        }

        if($course->thumbnail){
            $course->thumbnail=$storage->getPublicUrl($course->thumbnail);
        }
        if($course->teacher->user->avatar){
            $course->teacher->user->avatar=$storage->getPublicUrl($course->teacher->user->avatar);
        }

        return response()->json([
            "message"=>"Course fetched successfully",
            "course"=>$course
        ],200);
    }
}
