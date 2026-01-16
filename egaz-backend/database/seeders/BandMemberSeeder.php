<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BandMember;

class BandMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            [
                'name' => 'David Malaan',
                'position' => 'CEO',
                'social_facebook' => 'https://facebook.com/david.malaan',
                'social_twitter' => 'https://twitter.com/davidmalaan',
                'social_linkedin' => 'https://linkedin.com/in/david-malaan',
                'social_instagram' => 'https://instagram.com/davidmalaan',
                'status' => 'active',
                'order' => 1,
            ],
            [
                'name' => 'Andres Jhohne',
                'position' => 'DIRECTOR',
                'social_facebook' => 'https://facebook.com/andres.jhohne',
                'social_twitter' => 'https://twitter.com/andresjhohne',
                'social_linkedin' => 'https://linkedin.com/in/andres-jhohne',
                'social_instagram' => 'https://instagram.com/andresjhohne',
                'status' => 'active',
                'order' => 2,
            ],
            [
                'name' => 'Michel Balak',
                'position' => 'FOUNDER',
                'social_facebook' => 'https://facebook.com/michel.balak',
                'social_twitter' => 'https://twitter.com/michelbalak',
                'social_linkedin' => 'https://linkedin.com/in/michel-balak',
                'social_instagram' => 'https://instagram.com/michelbalak',
                'status' => 'active',
                'order' => 3,
            ],
            [
                'name' => 'Jemes Rodrigez',
                'position' => 'MANAGER',
                'social_facebook' => 'https://facebook.com/jemes.rodrigez',
                'social_twitter' => 'https://twitter.com/jemesrodrigez',
                'social_linkedin' => 'https://linkedin.com/in/jemes-rodrigez',
                'social_instagram' => 'https://instagram.com/jemesrodrigez',
                'status' => 'active',
                'order' => 4,
            ],
            [
                'name' => 'Hossain',
                'position' => 'ADMIN',
                'social_facebook' => 'https://facebook.com/hossain',
                'social_twitter' => 'https://twitter.com/hossain',
                'social_linkedin' => 'https://linkedin.com/in/hossain',
                'social_instagram' => 'https://instagram.com/hossain',
                'status' => 'active',
                'order' => 5,
            ],
            [
                'name' => 'Jobayer Khan',
                'position' => 'CEO Founder',
                'social_facebook' => 'https://facebook.com/jobayer.khan',
                'social_twitter' => 'https://twitter.com/jobayerkhan',
                'social_linkedin' => 'https://linkedin.com/in/jobayer-khan',
                'social_instagram' => 'https://instagram.com/jobayerkhan',
                'status' => 'active',
                'order' => 6,
            ],
        ];

        foreach ($members as $member) {
            BandMember::create($member);
        }
    }
}
