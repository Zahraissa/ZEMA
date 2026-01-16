<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutContent;

class AboutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutContent = [
            [
                'section' => 'hero',
                'title' => 'Sisi ni nani',
                'content' => 'The e-Government Authority (eGAZ) was established in 2019 under the e-Government Act No. 10 of 2019, mandated to coordinate, oversee, and promote e-Government initiatives, ensuring high-quality public service delivery through innovative technology.',
                'status' => 'active',
                'order' => 1,
                'additional_data' => [
                    'subtitle' => 'Leading innovation in technology since 2019',
                    'description' => 'We are a forward-thinking organization dedicated to creating innovative solutions that make a difference in people\'s lives.'
                ]
            ],
            [
                'section' => 'mission',
                'title' => 'Mission',
                'content' => 'Kujenga mazingira ya kisheria yanayounga mkono maendeleo ya teknolojia na uboreshaji wa huduma kwa wananchi kupitia teknolojia ya kisasa na ubunifu.',
                'status' => 'active',
                'order' => 1,
                'additional_data' => [
                    'icon' => 'target',
                    'color' => 'from-green-500 to-emerald-500'
                ]
            ],
            [
                'section' => 'vision',
                'title' => 'Vision',
                'content' => 'Kuwa kiongozi wa kimataifa katika ubunifu wa teknolojia kwa ajili ya uboreshaji wa huduma za umma na kuunda siku za kesho bora kwa wote.',
                'status' => 'active',
                'order' => 1,
                'additional_data' => [
                    'icon' => 'eye',
                    'color' => 'from-blue-500 to-blue-600'
                ]
            ],

            [
                'section' => 'values',
                'title' => 'UADILIFU',
                'content' => 'Tunatumika kwa uaminifu na uwazi katika huduma zote',
                'status' => 'active',
                'order' => 1,
                'additional_data' => [
                    'icon' => 'shield',
                    'color' => 'from-blue-500 to-blue-600'
                ]
            ],
            [
                'section' => 'values',
                'title' => 'UBUNIFU',
                'content' => 'Tunatumia ubunifu na teknolojia ya kisasa kutatua changamoto',
                'status' => 'active',
                'order' => 2,
                'additional_data' => [
                    'icon' => 'lightbulb',
                    'color' => 'from-yellow-500 to-orange-500'
                ]
            ],
            [
                'section' => 'values',
                'title' => 'KUTHAMINI WATEJA',
                'content' => 'Tunatoa huduma bora kwa wananchi na washirika wetu',
                'status' => 'active',
                'order' => 3,
                'additional_data' => [
                    'icon' => 'users',
                    'color' => 'from-green-500 to-emerald-500'
                ]
            ],
            [
                'section' => 'values',
                'title' => 'KUFANYAKAZI KWA PAMOJA',
                'content' => 'Tunafanya kazi pamoja kama timu moja kufikia malengo',
                'status' => 'active',
                'order' => 4,
                'additional_data' => [
                    'icon' => 'handshake',
                    'color' => 'from-purple-500 to-pink-500'
                ]
            ],
            [
                'section' => 'values',
                'title' => 'USHIRIKIANO',
                'content' => 'Tunashirikiana na wananchi na washirika wetu kwa uaminifu',
                'status' => 'active',
                'order' => 5,
                'additional_data' => [
                    'icon' => 'heart',
                    'color' => 'from-red-500 to-pink-500'
                ]
            ],
            [
                'section' => 'values',
                'title' => 'WELEDI',
                'content' => 'Tunatumia ujuzi na uzoefu wetu kutoa huduma bora',
                'status' => 'active',
                'order' => 6,
                'additional_data' => [
                    'icon' => 'award',
                    'color' => 'from-indigo-500 to-purple-500'
                ]
            ],
            [
                'section' => 'team',
                'title' => 'Our Team',
                'content' => 'Meet the passionate individuals who make our organization great.',
                'status' => 'active',
                'order' => 1,
                'additional_data' => [
                    'member_count' => 25,
                    'description' => 'Our dedicated team of professionals is committed to delivering excellence in every project.'
                ]
            ],
            [
                'section' => 'history',
                'title' => 'Our Story',
                'content' => 'Founded in 2019, we started as a government initiative with big dreams. Today, we\'re proud to serve citizens nationwide through innovative e-government solutions.',
                'status' => 'active',
                'order' => 1,
                'additional_data' => [
                    'founded_year' => 2019,
                    'milestones' => [
                        '2019: Established under e-Government Act No. 10',
                        '2020: Launched first digital services',
                        '2021: Expanded service portfolio',
                        '2022: Achieved national recognition',
                        '2023: Continued innovation and growth'
                    ]
                ]
            ]
        ];

        foreach ($aboutContent as $content) {
            AboutContent::create($content);
        }
    }
}
