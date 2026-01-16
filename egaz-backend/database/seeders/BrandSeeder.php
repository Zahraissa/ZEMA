<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Brand One',
                'description' => 'Leading technology company specializing in innovative solutions',
                'website_url' => 'https://brandone.com',
                'status' => 'active',
                'order' => 1,
            ],
            [
                'name' => 'Brand Two',
                'description' => 'Global consulting firm with expertise in business transformation',
                'website_url' => 'https://brandtwo.com',
                'status' => 'active',
                'order' => 2,
            ],
            [
                'name' => 'Brand Three',
                'description' => 'Creative agency focused on digital marketing and design',
                'website_url' => 'https://brandthree.com',
                'status' => 'active',
                'order' => 3,
            ],
            [
                'name' => 'Brand Four',
                'description' => 'Financial services provider with comprehensive solutions',
                'website_url' => 'https://brandfour.com',
                'status' => 'active',
                'order' => 4,
            ],
            [
                'name' => 'Brand Five',
                'description' => 'Healthcare technology company improving patient care',
                'website_url' => 'https://brandfive.com',
                'status' => 'active',
                'order' => 5,
            ],
            [
                'name' => 'Brand Six',
                'description' => 'Educational platform revolutionizing online learning',
                'website_url' => 'https://brandsix.com',
                'status' => 'active',
                'order' => 6,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
