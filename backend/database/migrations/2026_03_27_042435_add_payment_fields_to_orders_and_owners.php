<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Orders: payment status + receipt as base64 blob
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_status')->default('paid')->after('payment_method');
            $table->longText('payment_receipt')->nullable()->after('payment_status');
        });

        // Restaurant owners: accepted payment methods + account details
        Schema::table('restaurant_owners', function (Blueprint $table) {
            $table->json('accepted_payment_methods')->nullable()->after('default_prep_time');
            $table->string('gcash_number')->nullable()->after('accepted_payment_methods');
            $table->string('maya_number')->nullable()->after('gcash_number');
            $table->string('bank_name')->nullable()->after('maya_number');
            $table->string('bank_account_name')->nullable()->after('bank_name');
            $table->string('bank_account_number')->nullable()->after('bank_account_name');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'payment_receipt']);
        });

        Schema::table('restaurant_owners', function (Blueprint $table) {
            $table->dropColumn([
                'accepted_payment_methods',
                'gcash_number',
                'maya_number',
                'bank_name',
                'bank_account_name',
                'bank_account_number',
            ]);
        });
    }
};
