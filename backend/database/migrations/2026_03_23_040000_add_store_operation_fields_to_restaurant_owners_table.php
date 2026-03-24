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
            $table->string('operating_status')->default('open')->after('cover_image');
            $table->boolean('auto_accept_orders')->default(true)->after('operating_status');
            $table->boolean('manual_confirmation')->default(false)->after('auto_accept_orders');
            $table->unsignedTinyInteger('default_prep_time')->default(15)->after('manual_confirmation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurant_owners', function (Blueprint $table) {
            $table->dropColumn([
                'operating_status',
                'auto_accept_orders',
                'manual_confirmation',
                'default_prep_time',
            ]);
        });
    }
};
