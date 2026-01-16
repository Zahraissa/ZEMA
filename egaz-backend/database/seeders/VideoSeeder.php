<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Video;
use Carbon\Carbon;

class VideoSeeder extends Seeder
{
    public function run()
    {
        $videos = [
            [
                'title' => 'UWEPO WA SHULE MAENEO YA KARIBU',
                'description' => 'Video about school presence in nearby areas',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'youtube_id' => 'dQw4w9WgXcQ',
                'is_main' => true,
                'is_active' => true,
                'order' => 1,
                'duration' => '5:30',
                'published_date' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'UTEKELEZAJI WA MPANGO WA UBORESHAJI WA ELIMU YA AWALI NA MSINGI BOOST',
                'description' => 'Mpango wa uboreshaji wa elimu ya awali na msingi (BOOST) umeweza kutatua changamoto mbalimbali zinazokabili elimu ya awali na msingi nchini Tanzania.',
                'youtube_url' => 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                'youtube_id' => '9bZkp7q19f0',
                'is_main' => false,
                'is_active' => true,
                'order' => 2,
                'duration' => '8:45',
                'published_date' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Miaka miwili ya Rais Samia Suluhu Hassan',
                'description' => 'Mafanikio ya Miaka Miwili ya Rais wa Jamhuri ya Muungano wa Tanzania Mh. Dkt.Samia Suluhu Hassan katika uboreshaji wa elimu.',
                'youtube_url' => 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                'youtube_id' => 'jNQXAC9IVRw',
                'is_main' => false,
                'is_active' => true,
                'order' => 3,
                'duration' => '12:20',
                'published_date' => Carbon::now()->subDays(7),
            ],
        ];

        foreach ($videos as $video) {
            Video::create($video);
        }
    }
}
