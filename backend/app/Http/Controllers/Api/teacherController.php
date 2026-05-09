<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Services\SupabaseStorageService;
use Illuminate\Http\Request;

class teacherController extends Controller
{
    public function teacherProfile(Request $request,SupabaseStorageService $storage){
        $user=$request->user();
        if(!$user){
            return response()->json([
                'message'=>'User not found',
            ],404); 
        }
        $teacher=$user->teacher;
        if(!$teacher){
            return response()->json([
                'message'=>'Teacher not found',
            ],404); 
        }

        if($user->avatar){
            $user->avatar=$storage->getPublicUrl($user->avatar);
        }

        return response()->json([
            'message'=>'Teacher profile found successfully',
            'teacher'=>[
                'name'=>$user->name,
                'email'=>$user->email,
                'avatar'=>$user->avatar,
                'bio'=>$teacher->bio,
                'location'=>$teacher->location,
                'headline'=>$teacher->headline,
                'hourly_rate'=>$teacher->hourly_rate,
                'subjects'=>$teacher->subjects,
                'languages'=>$teacher->languages,
                'availabilities'=>$teacher->availabilities,
                'created_at'=>$user->created_at,
                'updated_at'=>$user->updated_at,
                'courses_count'=>$teacher->courses->count(),
            ],
        ],200); 
    }

    public function teacherUpdate(Request $request,SupabaseStorageService $storage){
        // merge json fields
        $request->merge([
            'subjects' => $request->subjects
                ? json_decode($request->input('subjects'), true)
                : [],

            'languages' => $request->languages
                ? json_decode($request->input('languages'), true)
                : [],

            'availability' => $request->availability
                ? json_decode($request->input('availability'), true)
                : [],
        ]);

        $request->validate([
            "name"=>"required|string|max:255",
            "headline"=>"string|nullable|max:255",
            "location"=>'string|nullable|max:255',
            "bio"=>"string|nullable",
            "subjects"=>"array|nullable",
            "languages"=>"array|nullable",
            "hourly_rate"=>"required|numeric|min:0",
            "avatar"=>"nullable|file|mimes:jpeg,png,jpg,gif|max:2048",
            "availability"=>"nullable|array",
            "availability.*.day_of_week"=>"string|max:255",
            "availability.*.start_time"=>"date_format:H:i",
            "availability.*.end_time"=>"date_format:H:i|after:availability.*.start_time",
        ]);

        $user=$request->user();
        $teacher=$user->teacher;
        if(!$teacher){
            return response()->json([
                'message'=>'Unauthorized Access',
            ],401); 
        }

        if($teacher->user_id != $user->id){
            return response()->json([
                'message'=>'Unauthorized Access',
            ],401); 
        }

        if($request->hasFile('avatar')){
            $avatar=$request->file('avatar');
            $avatarPath=$storage->uploadAvatar($avatar,$user->id,$user->avatar);
            $user->update([
                'name'=>$request->name,
                'avatar'=>$avatarPath,
            ]);
        }else{
            $user->update([
                'name'=>$request->name,
            ]);
        }

        $teacher->update([
            'headline'=>$request->headline,
            'location'=>$request->location,
            'bio'=>$request->bio,
            'subjects'=>$request->subjects,
            'languages'=>$request->languages,
            'hourly_rate'=>$request->hourly_rate,
        ]);
        
        if($request->has('availability')){
            $teacher->availabilities()->delete();
            foreach($request->availability as $slot){
                $teacher->availabilities()->create([
                    'day_of_week'=>$slot['day_of_week'],
                    'start_time'=>$slot['start_time'],
                    'end_time'=>$slot['end_time'],
                ]);
            }
        }

        $user->save();
        $teacher->save();

        if($user->avatar){
            $user->avatar=$storage->getPublicUrl($user->avatar);
        }

        return response()->json([
            'message'=>'Profile updated successfully',
            'teacher'=>[
                'name'=>$user->name,
                'email'=>$user->email,
                'avatar'=>$user->avatar,
                'bio'=>$teacher->bio,
                'headline'=>$teacher->headline,
                'hourly_rate'=>$teacher->hourly_rate,
                'subjects'=>$teacher->subjects,
                'languages'=>$teacher->languages,
                'availabilities'=>$teacher->load('availabilities'),
                'created_at'=>$user->created_at,
                'updated_at'=>$user->updated_at,
                'courses_count'=>$teacher->courses->count(),
            ],
        ],200); 
    }

    public function getTeachers(Request $request,SupabaseStorageService $storage){
        $teachers=Teacher::query()
                ->with('user')
                ->orderBy('created_at','desc')
                ->get()
                ->map(function($teacher) use ($storage){
                    if($teacher->user->avatar){
                        $teacher->user->avatar=$storage->getPublicUrl($teacher->user->avatar);
                    }
                    return [
                        'id'=>$teacher->id,
                        'name'=>$teacher->user->name,
                        'email'=>$teacher->user->email,
                        'avatar'=>$teacher->user->avatar,
                        'bio'=>$teacher->bio,
                        'headline'=>$teacher->headline,
                        'hourly_rate'=>$teacher->hourly_rate,
                        'subjects'=>$teacher->subjects,
                        'languages'=>$teacher->languages,
                        'created_at'=>$teacher->user->created_at,
                        'updated_at'=>$teacher->user->updated_at,
                        'courses_count'=>$teacher->courses->count(),
                    ];
                });

        return response()->json([
            'message'=>'Teachers fetched successfully',
            'teachers'=>$teachers
        ],200); 
    }

    public function getSubjects(){
        $subjects=Teacher::all()
                ->pluck('subjects')
                ->flatten()
                ->unique()
                ->values()
                ->toArray();
        
        return response()->json([
            'message'=>'Subjects fetched successfully',
            'subjects'=>$subjects,
        ],200); 
    }

    public function getLanguages(){
        $languages=Teacher::all()
                ->pluck('languages')
                ->flatten()
                ->unique()
                ->values()
                ->toArray();
        
        return response()->json([
            'message'=>'Languages fetched successfully',
            'languages'=>$languages,
        ],200); 
    }
    
    public function getTeacherById(Request $request,SupabaseStorageService $storage,$id){
        $teacher=Teacher::with('user','courses','availabilities')->whereId($id)->first();

        if(!$teacher){
            return response()->json([
                'message'=>'Teacher not found',
            ],404); 
        }

        if($teacher->user->avatar){
            $teacher->user->avatar=$storage->getPublicUrl($teacher->user->avatar);
        }

        if($teacher->courses->count()>0){
            foreach($teacher->courses as $course){
                $course->thumbnail=$storage->getPublicUrl($course->thumbnail);
            }
        }

        return response()->json([
            'message'=>'Teacher profile found successfully',
            'teacher'=>[
                'id'=>$teacher->id,
                'user_id'=>$teacher->user_id,
                'name'=>$teacher->user->name,
                'email'=>$teacher->user->email,
                'avatar'=>$teacher->user->avatar,
                'bio'=>$teacher->bio,
                'headline'=>$teacher->headline,
                'hourly_rate'=>$teacher->hourly_rate,
                'subjects'=>$teacher->subjects,
                'languages'=>$teacher->languages,
                'created_at'=>$teacher->user->created_at,
                'updated_at'=>$teacher->user->updated_at,
                'courses_count'=>$teacher->courses->count(),
                'courses'=>$teacher->courses,
                'availabilities'=>$teacher->availabilities,
            ],
        ],200); 
    }
}

