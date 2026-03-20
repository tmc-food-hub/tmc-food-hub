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
            $table->json('cuisine_type')->nullable()->after('business_permit');
            $table->string('price_range')->nullable()->after('cuisine_type');
            $table->string('business_registration_number')->nullable()->after('price_range');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurant_owners', function (Blueprint $table) {
            $table->dropColumn(['cuisine_type', 'price_range', 'business_registration_number']);
        });
    }
};
