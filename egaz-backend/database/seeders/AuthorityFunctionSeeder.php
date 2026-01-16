<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AuthorityFunction;

class AuthorityFunctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $functions = [
            [
                'title' => 'Kuratibu utekelezaji wa Serikali Mtandao Zanzibar',
                'description' => 'Kuratibu utekelezaji wa Serikali Mtandao Zanzibar, ikiwa ni pamoja na uundaji wa sera, viwango, na miongozo ya TEHAMA serikalini.',
                'icon' => 'settings',
                'order' => 1,
                'status' => 'active'
            ],
            [
                'title' => 'Kusimamia na kuendeleza miundombinu ya TEHAMA',
                'description' => 'Kusimamia na kuendeleza miundombinu ya TEHAMA ya Serikali, kama vile Data Center, Mtandao wa Serikali, huduma za usalama mtandao, nk.',
                'icon' => 'network',
                'order' => 2,
                'status' => 'active'
            ],
            [
                'title' => 'Kutoa huduma za pamoja kwa taasisi za serikali',
                'description' => 'Kutoa huduma za pamoja (shared services) kwa taasisi za serikali kama mfumo wa barua pepe rasmi, mifumo ya malipo, hifadhi ya taarifa, nk.',
                'icon' => 'users',
                'order' => 3,
                'status' => 'active'
            ],
            [
                'title' => 'Kuhakikisha usalama wa taarifa za serikali',
                'description' => 'Kuhakikisha usalama wa taarifa za serikali kwa njia ya kidijitali, kwa kushirikiana na vyombo vingine vya usalama wa kimtandao.',
                'icon' => 'shield',
                'order' => 4,
                'status' => 'active'
            ],
            [
                'title' => 'Kutoa mafunzo na ushauri wa kitaalamu',
                'description' => 'Kutoa mafunzo, ushauri wa kitaalamu na kujenga uwezo kwa taasisi za serikali kuhusu matumizi sahihi ya TEHAMA.',
                'icon' => 'graduation-cap',
                'order' => 5,
                'status' => 'active'
            ],
            [
                'title' => 'Kufanya tafiti na tathmini',
                'description' => 'Kufanya tafiti, tathmini na kutoa mapendekezo ya kisera na kiufundi kuhusu matumizi ya teknolojia katika sekta ya umma.',
                'icon' => 'search',
                'order' => 6,
                'status' => 'active'
            ],
            [
                'title' => 'Kuhamasisha matumizi ya TEHAMA kwa wananchi',
                'description' => 'Kuhamasisha matumizi ya TEHAMA kwa wananchi, ili kurahisisha upatikanaji wa huduma za serikali kwa njia ya mtandao.',
                'icon' => 'megaphone',
                'order' => 7,
                'status' => 'active'
            ],
            [
                'title' => 'Kusimamia maendeleo ya mifumo ya kitaifa',
                'description' => 'Kusimamia maendeleo ya mifumo ya kitaifa ya TEHAMA, kama mifumo ya usajili, malipo, afya, elimu, biashara, utalii, nk.',
                'icon' => 'building',
                'order' => 8,
                'status' => 'active'
            ],
            [
                'title' => 'Kuratibu ushirikiano wa kimataifa',
                'description' => 'Kuratibu ushirikiano wa kimataifa na mashirika ya maendeleo katika nyanja za TEHAMA na Serikali Mtandao.',
                'icon' => 'globe',
                'order' => 9,
                'status' => 'active'
            ]
        ];

        foreach ($functions as $function) {
            AuthorityFunction::create($function);
        }
    }
}
