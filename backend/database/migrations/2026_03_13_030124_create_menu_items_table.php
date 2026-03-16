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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_owner_id');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2);
            $table->string('image')->nullable();
            $table->boolean('available')->default(true);
            $table->integer('stock_level')->default(0);
            $table->integer('min_threshold')->default(10);
            $table->string('unit')->default('units');
            $table->boolean('auto_toggle')->default(true);
            $table->timestamps();

            $table->foreign('restaurant_owner_id')->references('id')->on('restaurant_owners')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
