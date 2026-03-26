<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('two_factor_auth')->default(true);
            $table->boolean('email_alerts')->default(true);
            $table->boolean('sms_emergency')->default(true);
            $table->string('session_timeout')->default('30 minutes');
            $table->integer('max_login_attempts')->default(5);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_settings');
    }
};
