<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedInteger('display_order')->default(0)->after('name');
        });

        $categories = DB::table('categories')
            ->orderBy('restaurant_owner_id')
            ->orderBy('id')
            ->get(['id', 'restaurant_owner_id']);

        $currentOwnerId = null;
        $orderIndex = 0;

        foreach ($categories as $category) {
            if ($currentOwnerId !== $category->restaurant_owner_id) {
                $currentOwnerId = $category->restaurant_owner_id;
                $orderIndex = 0;
            }

            DB::table('categories')
                ->where('id', $category->id)
                ->update(['display_order' => $orderIndex]);

            $orderIndex++;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('display_order');
        });
    }
};
