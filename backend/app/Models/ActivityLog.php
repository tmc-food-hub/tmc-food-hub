<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'admin_id',
        'action',
        'description',
        'page',
        'ip_address',
        'device',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public static function logAction($adminId, $action, $description, $page, $ipAddress = null, $device = null): self
    {
        return self::create([
            'admin_id' => $adminId,
            'action' => $action,
            'description' => $description,
            'page' => $page,
            'ip_address' => $ipAddress,
            'device' => $device,
        ]);
    }
}
