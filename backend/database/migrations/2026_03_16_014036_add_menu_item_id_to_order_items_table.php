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
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'menu_item_id')) {
                $table->unsignedBigInteger('menu_item_id')->nullable()->after('order_id');
                $table->foreign('menu_item_id')->references('id')->on('menu_items')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'menu_item_id')) {
                $table->dropForeign(['menu_item_id']);
                $table->dropColumn('menu_item_id');
            }
        });
    }
};
