<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['booking_id','scheduled_date','scheduled_day','scheduled_time','duration','status','recording_url'])]

class LiveSession extends Model
{
    //relations
    public function booking(){
        return $this->belongsTo(Booking::class);
    }

    public function student(){
        return $this->hasOneThrough(Student::class,Booking::class);
    }

    public function teacher(){
        return $this->hasOneThrough(Teacher::class,Booking::class);
    }
}
