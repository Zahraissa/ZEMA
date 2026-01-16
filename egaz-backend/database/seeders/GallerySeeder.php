<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $galleries = [
            [
                'title' => 'Luxury Couple Suite',
                'description' => '3 double Bed',
                'category' => 'luxury',
                'order' => 1,
                'status' => 'active',
                'is_active' => true,
                'featured' => true,
                'alt_text' => 'Luxury couple suite with 3 double beds',
                'caption' => 'Experience ultimate luxury in our premium couple suite'
            ],
            [
                'title' => 'Couple Suite',
                'description' => '2 double Bed',
                'category' => 'couple',
                'order' => 2,
                'status' => 'active',
                'is_active' => true,
                'featured' => false,
                'alt_text' => 'Couple suite with 2 double beds',
                'caption' => 'Perfect for couples seeking comfort and privacy'
            ],
            [
                'title' => 'Business Suite',
                'description' => '3 double Bed',
                'category' => 'business',
                'order' => 3,
                'status' => 'active',
                'is_active' => true,
                'featured' => true,
                'alt_text' => 'Business suite with 3 double beds',
                'caption' => 'Ideal for business travelers and corporate events'
            ],
            [
                'title' => 'Classic Room',
                'description' => '2 double Bed',
                'category' => 'classic',
                'order' => 4,
                'status' => 'active',
                'is_active' => true,
                'featured' => false,
                'alt_text' => 'Classic room with 2 double beds',
                'caption' => 'Timeless elegance with modern amenities'
            ],
            [
                'title' => 'Deluxe Room',
                'description' => '2 double Bed',
                'category' => 'deluxe',
                'order' => 5,
                'status' => 'active',
                'is_active' => true,
                'featured' => false,
                'alt_text' => 'Deluxe room with 2 double beds',
                'caption' => 'Enhanced comfort with premium features'
            ],
            [
                'title' => 'Executive Suite',
                'description' => '4 double Bed',
                'category' => 'luxury',
                'order' => 6,
                'status' => 'active',
                'is_active' => true,
                'featured' => true,
                'alt_text' => 'Executive suite with 4 double beds',
                'caption' => 'Ultimate luxury for executive travelers'
            ],
            [
                'title' => 'Family Room',
                'description' => '3 double Bed',
                'category' => 'family',
                'order' => 7,
                'status' => 'active',
                'is_active' => true,
                'featured' => false,
                'alt_text' => 'Family room with 3 double beds',
                'caption' => 'Spacious accommodation for families'
            ],
            [
                'title' => 'Presidential Suite',
                'description' => '5 double Bed',
                'category' => 'luxury',
                'order' => 8,
                'status' => 'active',
                'is_active' => true,
                'featured' => true,
                'alt_text' => 'Presidential suite with 5 double beds',
                'caption' => 'The epitome of luxury and sophistication'
            ]
        ];

        foreach ($galleries as $gallery) {
            Gallery::create($gallery);
        }
    }
}
