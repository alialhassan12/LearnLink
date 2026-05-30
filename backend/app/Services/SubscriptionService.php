<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\User;

class SubscriptionService{
    public function canCreateCourse(User $user):bool{
        $subscription=Subscription::with('plan')->where('user_id',$user->id)->first();
        
        if(!$subscription || $subscription->status !== "active"){
            return false;
        }

        $currentCourses=$user->teacher->publishedCourses()->count();
        $maxCourses=$subscription->plan->features['max_courses'];
        
        if($maxCourses !== -1 && $currentCourses>=$maxCourses){
            return false;
        }

        return true;
    }
}