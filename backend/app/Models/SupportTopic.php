<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTopic extends Model
{
    protected $fillable = ['label'];

    public function requests()
    {
        return $this->hasMany(SupportRequest::class, 'topic_id');
    }
}
