<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Download;
use Carbon\Carbon;

class DownloadSeeder extends Seeder
{
    public function run()
    {
        $downloads = [
            [
                'title' => 'Ramani za mradi wa BOOST',
                'description' => 'Maps and documentation for the BOOST project',
                'file_url' => '/downloads/boost-project-maps.pdf',
                'file_name' => 'boost-project-maps.pdf',
                'file_size' => '2.5 MB',
                'file_type' => 'PDF',
                'download_count' => 45,
                'is_active' => true,
                'order' => 1,
                'published_date' => Carbon::now()->subDays(19),
            ],
            [
                'title' => 'National PHC Rolling Digital Roadmap (Tanzania)',
                'description' => 'Digital roadmap for Primary Health Care in Tanzania',
                'file_url' => '/downloads/phc-digital-roadmap.pdf',
                'file_name' => 'phc-digital-roadmap.pdf',
                'file_size' => '1.8 MB',
                'file_type' => 'PDF',
                'download_count' => 32,
                'is_active' => true,
                'order' => 2,
                'published_date' => Carbon::now()->subDays(30),
            ],
            [
                'title' => 'Msimbazi Watershed Management - REOI Advert (extension) 1',
                'description' => 'Request for Expression of Interest for Msimbazi Watershed Management',
                'file_url' => '/downloads/msimbazi-watershed-reoi.pdf',
                'file_name' => 'msimbazi-watershed-reoi.pdf',
                'file_size' => '3.2 MB',
                'file_type' => 'PDF',
                'download_count' => 28,
                'is_active' => true,
                'order' => 3,
                'published_date' => Carbon::now()->subDays(30),
            ],
            [
                'title' => 'DMDP 2 Dar SWM Service Framework & Delivery System - REOI Advert (extension)',
                'description' => 'Dar es Salaam Solid Waste Management Service Framework',
                'file_url' => '/downloads/dmdp2-dar-swm-framework.pdf',
                'file_name' => 'dmdp2-dar-swm-framework.pdf',
                'file_size' => '4.1 MB',
                'file_type' => 'PDF',
                'download_count' => 19,
                'is_active' => true,
                'order' => 4,
                'published_date' => Carbon::now()->subDays(30),
            ],
        ];

        foreach ($downloads as $download) {
            Download::create($download);
        }
    }
}
