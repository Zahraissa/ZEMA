<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Slider;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sliders = [
            [
                'title' => 'MKUTANO WA MWAKA',
                'description' => 'Mahojiano na Rais, Dkt. Samia Suluhu Hassan leo julai 14, 2024 amekuwa Mkutano wa Mwaka wa Maongozi Watoa wa Mikoa na Halmashauri zote Uchaguzi.',
                'year' => '2024',
                'badge' => 'Mkutano Mkuu',
                'button_text' => 'Soma Zaidi',
                'button_link' => '/news',
                'has_video' => true,
                'order' => 1,
                'status' => 'active',
                'is_active' => true,
            ],
            [
                'title' => 'UONGOZI NA MAENDELEO',
                'description' => 'Mkutano wa kipekee wa viongozi wa serikali za mitaa kujadili mipango ya maendeleo ya mikoa na wilaya kwa mwaka 2024-2025.',
                'year' => '2024',
                'badge' => 'Maendeleo',
                'button_text' => 'Jifunze Zaidi',
                'button_link' => '/about',
                'has_video' => false,
                'order' => 2,
                'status' => 'active',
                'is_active' => true,
            ],
            [
                'title' => 'HUDUMA KWA WANANCHI',
                'description' => 'Majadiliano kuhusu uboreshaji wa huduma za kijamii, elimu, afya na miundombinu katika mikoa na wilaya mbalimbali.',
                'year' => '2024',
                'badge' => 'Huduma',
                'button_text' => 'Tazama Huduma',
                'button_link' => '/services',
                'has_video' => true,
                'order' => 3,
                'status' => 'active',
                'is_active' => true,
            ],
        ];

        foreach ($sliders as $slider) {
            Slider::create($slider);
        }
    }
}
