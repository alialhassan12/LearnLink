<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(["teacher_id","category_id","title","description","thumbnail","language","status","price"])]

class Course extends Model
{
    // Relations
    public function teacher(){
        return $this->belongsTo(Teacher::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
