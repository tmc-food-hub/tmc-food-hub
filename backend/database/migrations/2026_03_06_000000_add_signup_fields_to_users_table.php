<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('name');
            $table->string('first_name')->nullable()->after('role');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('phone')->nullable()->after('password');
            $table->string('address')->nullable()->after('phone');
            $table->text('delivery_instructions')->nullable()->after('address');
            $table->string('restaurant_name')->nullable()->after('delivery_instructions');
            $table->string('business_address')->nullable()->after('restaurant_name');
            $table->string('business_contact_number')->nullable()->after('business_address');
            $table->string('business_permit')->nullable()->after('business_contact_number');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'first_name',
                'last_name',
                'phone',
                'address',
                'delivery_instructions',
                'restaurant_name',
                'business_address',
                'business_contact_number',
                'business_permit',
            ]);
        });
    }
};
