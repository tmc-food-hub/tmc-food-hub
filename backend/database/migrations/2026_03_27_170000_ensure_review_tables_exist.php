<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('restaurant_owner_id')->constrained('restaurant_owners')->cascadeOnDelete();
                $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('order_id')->unique()->constrained('orders')->cascadeOnDelete();
                $table->unsignedTinyInteger('rating');
                $table->text('review');
                $table->json('photos')->nullable();
                $table->boolean('is_verified')->default(true);
                $table->unsignedInteger('helpful_count')->default(0);
                $table->text('owner_reply')->nullable();
                $table->timestamp('owner_replied_at')->nullable();
                $table->timestamps();
                $table->index(['restaurant_owner_id', 'created_at']);
                $table->index(['restaurant_owner_id', 'rating']);
            });
        } else {
            Schema::table('reviews', function (Blueprint $table) {
                if (!Schema::hasColumn('reviews', 'photos')) {
                    $table->json('photos')->nullable()->after('review');
                }

                if (!Schema::hasColumn('reviews', 'is_verified')) {
                    $table->boolean('is_verified')->default(true)->after('photos');
                }

                if (!Schema::hasColumn('reviews', 'helpful_count')) {
                    $table->unsignedInteger('helpful_count')->default(0)->after('is_verified');
                }

                if (!Schema::hasColumn('reviews', 'owner_reply')) {
                    $table->text('owner_reply')->nullable()->after('helpful_count');
                }

                if (!Schema::hasColumn('reviews', 'owner_replied_at')) {
                    $table->timestamp('owner_replied_at')->nullable()->after('owner_reply');
                }
            });
        }

        if (!Schema::hasTable('review_helpful_votes')) {
            Schema::create('review_helpful_votes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('review_id')->constrained('reviews')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['review_id', 'user_id']);
            });
        }
    }

    public function down(): void
    {
        // Intentionally empty: this migration backfills review schema on
        // environments that missed earlier review-related migrations.
    }
};
