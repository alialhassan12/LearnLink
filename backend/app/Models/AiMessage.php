<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable('chat_id', 'role', 'content', 'type', 'tokens_used')]
class AiMessage extends Model
{

    //relatuionships

    public function aiChat(){
        return $this->belongsTo(AiChat::class);
    }
}
