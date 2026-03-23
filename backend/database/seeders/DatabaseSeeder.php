<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'demo@tmcfoodhub.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('password'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@tmcfoodhub.com'],
            [
                'name' => 'Platform Admin',
                'first_name' => 'Platform',
                'last_name' => 'Admin',
                'role' => 'admin',
                'password' => bcrypt('admin12345'),
            ]
        );

        $this->call([
            OwnerSeeder::class,
            MenuSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
