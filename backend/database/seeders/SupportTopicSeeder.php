<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SupportTopic;

class SupportTopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SupportTopic::insert([
            ['label' => 'General Inquiry'],
            ['label' => 'Billing & Invoice'],
            ['label' => 'Technical Support'],
        ]);
    }
}