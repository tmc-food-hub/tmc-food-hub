<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('restaurant_owners', function (Blueprint $table) {
            $table->string('logo')->nullable()->after('business_permit');
            $table->string('cover_image')->nullable()->after('logo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurant_owners', function (Blueprint $table) {
            $table->dropColumn(['logo', 'cover_image']);
        });
    }
};
