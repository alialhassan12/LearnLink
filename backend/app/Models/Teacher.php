<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

#[Fillable(['user_id','bio','subjects','languages'])]
class Teacher extends Model
{
    // Relations
    public function user(){
        return $this->belongsTo(User::class);
    }
    
    // Casts
    protected function casts(): array{
        return [
            'subjects' => 'array',
            'languages' => 'array',
        ];
    }
}
