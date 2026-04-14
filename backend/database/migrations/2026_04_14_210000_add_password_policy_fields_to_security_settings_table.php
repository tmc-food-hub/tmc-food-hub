<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('security_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('security_settings', 'require_uppercase')) {
                $table->boolean('require_uppercase')->default(true)->after('max_login_attempts');
            }
            if (!Schema::hasColumn('security_settings', 'require_numbers')) {
                $table->boolean('require_numbers')->default(true)->after('require_uppercase');
            }
            if (!Schema::hasColumn('security_settings', 'require_special_character')) {
                $table->boolean('require_special_character')->default(true)->after('require_numbers');
            }
            if (!Schema::hasColumn('security_settings', 'password_expiry_days')) {
                $table->unsignedSmallInteger('password_expiry_days')->default(90)->after('require_special_character');
            }
        });
    }

    public function down(): void
    {
        Schema::table('security_settings', function (Blueprint $table) {
            if (Schema::hasColumn('security_settings', 'password_expiry_days')) {
                $table->dropColumn('password_expiry_days');
            }
            if (Schema::hasColumn('security_settings', 'require_special_character')) {
                $table->dropColumn('require_special_character');
            }
            if (Schema::hasColumn('security_settings', 'require_numbers')) {
                $table->dropColumn('require_numbers');
            }
            if (Schema::hasColumn('security_settings', 'require_uppercase')) {
                $table->dropColumn('require_uppercase');
            }
        });
    }
};
