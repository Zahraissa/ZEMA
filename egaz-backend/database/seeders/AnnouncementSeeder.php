<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Announcement;
use Carbon\Carbon;

class AnnouncementSeeder extends Seeder
{
    public function run()
    {
        $announcements = [
            [
                'title' => 'ADDITIONAL BEST INDICATORS 2025',
                'description' => 'Important indicators for the year 2025',
                'published_date' => Carbon::now()->subDays(7),
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'TANGAZO LA KUITWA KAZINI NAFASI ZA KUJITOLEA SHULE ZA MSINGI KADA YA ELIMU MRADI WA GPE',
                'description' => 'Job announcement for volunteer positions in primary schools',
                'published_date' => Carbon::now()->subDays(9),
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'ORODHA YA WALIMU WALIOCHAGULIWA NAFASI ZA KUJITOLEA SHULE ZA MSINGI MRADI WA GPE TSP',
                'description' => 'List of selected teachers for volunteer positions',
                'published_date' => Carbon::now()->subDays(9),
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'BASIC EDUCATION STATISTICS 2025',
                'description' => 'Comprehensive statistics for basic education in 2025',
                'published_date' => Carbon::now()->subDays(21),
                'is_active' => true,
                'order' => 4,
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }
    }
}
