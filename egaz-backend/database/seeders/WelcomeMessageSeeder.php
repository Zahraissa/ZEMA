<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\WelcomeMessage;

class WelcomeMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messages = [
            [
                'name' => 'H.E. Dr. Hussein Ali Mwinyi',
                'position' => 'President of Zanzibar and Chairman of the Revolutionary Council',
                'message' => 'Ninayo furaha ya kukukaribisha katika tovuti ya Mamlaka ya Serikali Mtandao, tunatumai utapata habari zenye kuaminika na zilizo kamili zitakazokupa muongozo kuhusu dira, muelekeo, malengo mikakati, shughuli kuu pamoja na maadili ya Mamlaka.Lengo kuu la tovuti hii ni kufikia miongoni mwa matarajio ya Mamlaka ya kuendeleza na kurahisisha matumizi ya TEHAMA ndani ya Serikali ya Mapinduzi Zanzibar na kuboresha mfumo wa utoaji wa huduma katika wizara, idara na taasisi mbali mbali za serikali kwa ajili ya wananchi. Matumizi ya TEHAMA hutoa matokeo mazuri kutokana na kuboresha utoaji huduma kwa watumishi wa umma na wananchi kwa jumla kwa kutumia miundombinu ya TEHAMA inayosimamiwa kwa weledi ili kuindeleza na kuikuza Zanzibar kiuchumi',
                'image_path' => null,
                'order' => 1,
                'status' => 'active',
                'is_active' => true,
            ],
            [
                'name' => 'Dr. Said Seif Said',
                'position' => 'Chief Executive Officer of Zanzibar Government Authority (eGAZ)',
                'message' => 'Ninayo furaha ya kukukaribisha katika tovuti ya Mamlaka ya Serikali Mtandao, tunatumai utapata habari zenye kuaminika na zilizo kamili zitakazokupa muongozo kuhusu dira, muelekeo, malengo mikakati, shughuli kuu pamoja na maadili ya Mamlaka.Lengo kuu la tovuti hii ni kufikia miongoni mwa matarajio ya Mamlaka ya kuendeleza na kurahisisha matumizi ya TEHAMA ndani ya Serikali ya Mapinduzi Zanzibar na kuboresha mfumo wa utoaji wa huduma katika wizara, idara na taasisi mbali mbali za serikali kwa ajili ya wananchi. Matumizi ya TEHAMA hutoa matokeo mazuri kutokana na kuboresha utoaji huduma kwa watumishi wa umma na wananchi kwa jumla kwa kutumia miundombinu ya TEHAMA inayosimamiwa kwa weledi ili kuindeleza na kuikuza Zanzibar kiuchumi',
                'image_path' => null,
                'order' => 2,
                'status' => 'active',
                'is_active' => true,
            ],
        ];

        foreach ($messages as $message) {
            WelcomeMessage::create($message);
        }
    }
}
