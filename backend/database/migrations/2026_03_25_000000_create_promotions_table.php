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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('discount_type', ['percentage', 'fixed', 'bogo', 'free_delivery'])->default('percentage');
            $table->decimal('discount_value', 10, 2);
            $table->decimal('minimum_order_value', 10, 2)->nullable();
            $table->enum('applicability_type', ['all_items', 'specific_items'])->default('all_items');
            $table->json('applicable_categories')->nullable();
            $table->json('applicable_restaurants')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->enum('status', ['active', 'scheduled', 'inactive', 'expired'])->default('scheduled');
            $table->unsignedInteger('max_redemptions')->nullable();
            $table->unsignedInteger('redemptions_count')->default(0);
            $table->unsignedInteger('unique_customers_count')->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0);
            $table->decimal('total_revenue_lift', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
