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
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->id();
            
            // Platform Status & Identity
            $table->string('platform_status')->default('live'); // live, maintenance
            $table->string('platform_name')->default('TMC Foodhub');
            $table->string('tagline')->default('Your Cravings, Delivered. Anytime.');
            $table->string('support_email')->default('support@tmcfoodhub.com');
            $table->string('phone_number')->default('+63 2 8123 4567');
            
            // Branding
            $table->string('logo_url')->nullable();
            $table->string('favicon_url')->nullable();
            
            // Localization
            $table->string('currency')->default('PHP');
            $table->string('language')->default('English');
            $table->string('timezone')->default('Asia/Manila');
            
            // Commission Settings
            $table->decimal('default_commission_rate', 5, 2)->default(15.00);
            $table->string('commission_type')->default('percentage'); // percentage, fixed, tiered
            $table->json('tiered_commission')->nullable();
            
            // Delivery Settings
            $table->string('delivery_mode')->default('restaurant'); // restaurant, platform, mixed
            $table->decimal('platform_delivery_fee', 8, 2)->default(50.00);
            $table->decimal('minimum_order_value', 8, 2)->default(100.00);
            
            // Payment Settings
            $table->boolean('payment_cashless_enabled')->default(true);
            $table->boolean('payment_cash_enabled')->default(true);
            $table->boolean('payment_gcash_enabled')->default(true);
            $table->boolean('payment_paypal_enabled')->default(false);
            
            // Notification Settings
            $table->boolean('notify_new_orders')->default(true);
            $table->boolean('notify_disputes')->default(true);
            $table->boolean('notify_reviews')->default(true);
            $table->boolean('notify_promotions')->default(true);
            
            // Terms & Policies
            $table->text('terms_of_service')->nullable();
            $table->text('privacy_policy')->nullable();
            $table->text('refund_policy')->nullable();
            
            // SEO & Metadata
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_settings');
    }
};
