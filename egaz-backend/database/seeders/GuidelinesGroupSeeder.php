<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GuidelinesGroup;

class GuidelinesGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groups = [
            [
                'name' => 'Application architecture',
                'description' => 'Standards and guidelines for application architecture',
                'status' => 'active',
                'order' => 1,
            ],
            [
                'name' => 'Architecture processes and governance',
                'description' => 'Standards for architecture processes and governance frameworks',
                'status' => 'active',
                'order' => 2,
            ],
            [
                'name' => 'Architecture vision',
                'description' => 'Vision and strategic direction for enterprise architecture',
                'status' => 'active',
                'order' => 3,
            ],
            [
                'name' => 'Business architecture',
                'description' => 'Standards for business architecture and processes',
                'status' => 'active',
                'order' => 4,
            ],
            [
                'name' => 'eGOVERNMENT interoperability frame work',
                'description' => 'Interoperability framework for e-Government services',
                'status' => 'active',
                'order' => 5,
            ],
            [
                'name' => 'Information architecture',
                'description' => 'Standards for information architecture and data management',
                'status' => 'active',
                'order' => 6,
            ],
            [
                'name' => 'Infrastructure architecture',
                'description' => 'Standards for infrastructure and technical architecture',
                'status' => 'active',
                'order' => 7,
            ],
            [
                'name' => 'Integration architecture',
                'description' => 'Standards for system integration and architecture',
                'status' => 'active',
                'order' => 8,
            ],
            [
                'name' => 'Security architecture',
                'description' => 'Security architecture standards and best practices',
                'status' => 'active',
                'order' => 9,
            ],
        ];

        foreach ($groups as $group) {
            GuidelinesGroup::updateOrCreate(
                ['name' => $group['name']], // Find by name
                $group // Update or create with these values
            );
        }
    }
}