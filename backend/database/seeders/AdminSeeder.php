<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed admin users for the application.
     */
    public function run(): void
    {
        // Primary Super Admin
        User::firstOrCreate(
            ['email' => 'admin@tmcfoodhub.com'],
            [
                'name' => 'Platform Admin',
                'first_name' => 'Platform',
                'last_name' => 'Admin',
                'role' => 'admin',
                'status' => 'Active',
                'password' => bcrypt('admin12345'),
                'last_active' => now(),
            ]
        );

        // Super Admin - Jordan Smith
        User::firstOrCreate(
            ['email' => 'jordan.smith@tmcfoodhub.com'],
            [
                'name' => 'Jordan Smith',
                'first_name' => 'Jordan',
                'last_name' => 'Smith',
                'role' => 'super_admin',
                'status' => 'Active',
                'password' => bcrypt('password123'),
                'last_active' => now(),
            ]
        );

        // Admin - Alex Martinez
        User::firstOrCreate(
            ['email' => 'alex.martinez@tmcfoodhub.com'],
            [
                'name' => 'Alex Martinez',
                'first_name' => 'Alex',
                'last_name' => 'Martinez',
                'role' => 'admin',
                'status' => 'Inactive',
                'password' => bcrypt('password123'),
                'last_active' => now()->subHours(2),
            ]
        );

        // Moderator - Elena Kostic
        User::firstOrCreate(
            ['email' => 'elena.kostic@tmcfoodhub.com'],
            [
                'name' => 'Elena Kostic',
                'first_name' => 'Elena',
                'last_name' => 'Kostic',
                'role' => 'moderator',
                'status' => 'Suspended',
                'password' => bcrypt('password123'),
                'last_active' => now()->subDays(3),
            ]
        );

        // Analyst - John Doe
        User::firstOrCreate(
            ['email' => 'john.doe@tmcfoodhub.com'],
            [
                'name' => 'John Doe',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'role' => 'analyst',
                'status' => 'Active',
                'password' => bcrypt('password123'),
                'last_active' => now()->subMinutes(14),
            ]
        );

        // Additional Moderator - Sarah Chen
        User::firstOrCreate(
            ['email' => 'sarah.chen@tmcfoodhub.com'],
            [
                'name' => 'Sarah Chen',
                'first_name' => 'Sarah',
                'last_name' => 'Chen',
                'role' => 'moderator',
                'status' => 'Active',
                'password' => bcrypt('password123'),
                'last_active' => now()->subHours(1),
            ]
        );

        // Additional Admin - Marcus Thorne
        User::firstOrCreate(
            ['email' => 'marcus.thorne@tmcfoodhub.com'],
            [
                'name' => 'Marcus Thorne',
                'first_name' => 'Marcus',
                'last_name' => 'Thorne',
                'role' => 'admin',
                'status' => 'Active',
                'password' => bcrypt('password123'),
                'last_active' => now()->subMinutes(45),
            ]
        );
    }
}
