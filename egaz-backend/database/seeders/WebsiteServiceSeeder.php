<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\WebsiteService;

class WebsiteServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'front_icon' => 'Lock',
                'front_title' => 'Marketing Strategy',
                'front_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_title' => 'Free Online Course',
                'back_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_image' => 'website-services/service_1.jpg',
                'link' => '/services/marketing',
                'order' => 1,
                'status' => 'active',
                'is_active' => true,
                'featured' => true
            ],
            [
                'front_icon' => 'Brain',
                'front_title' => 'Interior Design',
                'front_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_title' => 'Interior Design',
                'back_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_image' => 'website-services/service_2.jpg',
                'link' => '/services/interior-design',
                'order' => 2,
                'status' => 'active',
                'is_active' => true,
                'featured' => false
            ],
            [
                'front_icon' => 'Code',
                'front_title' => 'Digital Services',
                'front_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_title' => 'Online Marketing',
                'back_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_image' => 'website-services/service_3.jpg',
                'link' => '/services/digital',
                'order' => 3,
                'status' => 'active',
                'is_active' => true,
                'featured' => true
            ],
            [
                'front_icon' => 'PenTool',
                'front_title' => 'Product Selling',
                'front_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_title' => 'Online Product',
                'back_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_image' => 'website-services/service_4.jpg',
                'link' => '/services/product-selling',
                'order' => 4,
                'status' => 'active',
                'is_active' => true,
                'featured' => false
            ],
            [
                'front_icon' => 'BarChart3',
                'front_title' => 'Product Design',
                'front_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_title' => '24/7 Support',
                'back_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_image' => 'website-services/service_5.jpg',
                'link' => '/services/product-design',
                'order' => 5,
                'status' => 'active',
                'is_active' => true,
                'featured' => false
            ],
            [
                'front_icon' => 'TrendingUp',
                'front_title' => 'Social Marketing',
                'front_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_title' => 'Social Marketing',
                'back_description' => 'Porem asum molor sit amet, consectetur adipiscing do miusmod tempor.',
                'back_image' => 'website-services/service_6.jpg',
                'link' => '/services/social-marketing',
                'order' => 6,
                'status' => 'active',
                'is_active' => true,
                'featured' => true
            ]
        ];

        foreach ($services as $service) {
            WebsiteService::create($service);
        }
    }
}
