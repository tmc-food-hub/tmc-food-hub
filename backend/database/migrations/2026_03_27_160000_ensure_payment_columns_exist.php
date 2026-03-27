<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status')->default('paid');
            }

            if (!Schema::hasColumn('orders', 'payment_receipt')) {
                $table->longText('payment_receipt')->nullable();
            }

            if (!Schema::hasColumn('orders', 'payment_sender_name')) {
                $table->string('payment_sender_name')->nullable();
            }

            if (!Schema::hasColumn('orders', 'payment_transaction_id')) {
                $table->string('payment_transaction_id')->nullable();
            }
        });

        Schema::table('restaurant_owners', function (Blueprint $table) {
            if (!Schema::hasColumn('restaurant_owners', 'accepted_payment_methods')) {
                $table->json('accepted_payment_methods')->nullable();
            }

            if (!Schema::hasColumn('restaurant_owners', 'gcash_number')) {
                $table->string('gcash_number')->nullable();
            }

            if (!Schema::hasColumn('restaurant_owners', 'maya_number')) {
                $table->string('maya_number')->nullable();
            }

            if (!Schema::hasColumn('restaurant_owners', 'bank_name')) {
                $table->string('bank_name')->nullable();
            }

            if (!Schema::hasColumn('restaurant_owners', 'bank_account_name')) {
                $table->string('bank_account_name')->nullable();
            }

            if (!Schema::hasColumn('restaurant_owners', 'bank_account_number')) {
                $table->string('bank_account_number')->nullable();
            }
        });
    }

    public function down(): void
    {
        // Intentionally left empty because this migration is only meant to
        // backfill missing payment columns on environments that missed them.
    }
};
