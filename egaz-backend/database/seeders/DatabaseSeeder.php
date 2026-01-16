<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Seed permissions first, then roles (roles depend on permissions)
            PermissionSeeder::class,
            RoleSeeder::class,
            // Then seed users (users can be assigned roles)
            UserSeeder::class,
            SliderSeeder::class,
            MenuSeeder::class,
            GuideSeeder::class,
            WelcomeMessageSeeder::class,
            BrandSeeder::class,
            FAQSeeder::class,
            AboutSeeder::class,
            GallerySeeder::class,
            WebsiteServiceSeeder::class,
            BandMemberSeeder::class,
            GuidelinesSeeder::class,
            GuidelinesGroupSeeder::class,
        ]);
    }
}
