<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Adds a direct FK from orders to restaurant_owners (instead of relying on store_name string).
     * Keeps store_name for display purposes only.
     * Idempotent: safe to re-run if column/indexes already exist.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add the FK column if it doesn't already exist
            if (!Schema::hasColumn('orders', 'restaurant_owner_id')) {
                $table->unsignedBigInteger('restaurant_owner_id')->nullable()->after('customer_id');
            }
        });

        // Add indexes separately so we can check existence first
        Schema::table('orders', function (Blueprint $table) {
            $existingIndexes = collect(DB::select("SHOW INDEX FROM orders"))->pluck('Key_name')->toArray();

            if (!in_array('orders_restaurant_owner_id_index', $existingIndexes)) {
                $table->index('restaurant_owner_id');
            }
            if (!in_array('orders_customer_id_index', $existingIndexes)) {
                $table->index('customer_id');
            }
        });

        // Add FK constraint if it doesn't already exist
        Schema::table('orders', function (Blueprint $table) {
            $existingFks = collect(DB::select("
                SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
                WHERE TABLE_NAME = 'orders'
                AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                AND TABLE_SCHEMA = DATABASE()
            "))->pluck('CONSTRAINT_NAME')->toArray();

            if (!in_array('orders_restaurant_owner_id_foreign', $existingFks)) {
                $table->foreign('restaurant_owner_id')
                    ->references('id')
                    ->on('restaurant_owners')
                    ->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $existingFks = collect(DB::select("
                SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
                WHERE TABLE_NAME = 'orders'
                AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                AND TABLE_SCHEMA = DATABASE()
            "))->pluck('CONSTRAINT_NAME')->toArray();

            if (in_array('orders_restaurant_owner_id_foreign', $existingFks)) {
                $table->dropForeign(['restaurant_owner_id']);
            }

            $existingIndexes = collect(DB::select("SHOW INDEX FROM orders"))->pluck('Key_name')->toArray();
            if (in_array('orders_restaurant_owner_id_index', $existingIndexes)) {
                $table->dropIndex(['restaurant_owner_id']);
            }
            if (in_array('orders_customer_id_index', $existingIndexes)) {
                $table->dropIndex(['customer_id']);
            }

            if (Schema::hasColumn('orders', 'restaurant_owner_id')) {
                $table->dropColumn('restaurant_owner_id');
            }
        });
    }
};

