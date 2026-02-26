<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportRequest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'topic_id',
        'message',
        'attachment'
    ];

    public function topic()
    {
        return $this->belongsTo(SupportTopic::class, 'topic_id');
    }
}
