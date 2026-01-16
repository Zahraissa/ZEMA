<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuType;
use App\Models\MenuGroup;
use App\Models\MenuItem;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create main navigation menu type
        $mainMenu = MenuType::create([
            'name' => 'Main Navigation',
            'description' => 'Primary navigation menu for the website',
            'status' => 'active'
        ]);

        // Create menu groups and items
        $this->createAboutGroup($mainMenu);
        $this->createServicesGroup($mainMenu);
        $this->createGuidelinesGroup($mainMenu);
        $this->createNewsGroup($mainMenu);
        $this->createContactGroup($mainMenu);
        $this->createLoginGroup($mainMenu);
    }

    private function createAboutGroup($mainMenu)
    {
        $aboutGroup = MenuGroup::create([
            'menu_type_id' => $mainMenu->id,
            'name' => 'Kuhusu Sisi',
            'description' => 'About us section',
            'status' => 'active',
            'order' => 2
        ]);

        MenuItem::create([
            'menu_group_id' => $aboutGroup->id,
            'name' => 'Sisi ni nani',
            'description' => 'Mamlaka ya Serikali Mtandao (e-GA) ni taasisi ya umma iliyoanzishwa kwa Sheria ya Serikali Mtandao Na. 10 ya mwaka 2019.',
            'link' => '/about/who-we-are',
            'status' => 'active',
            'order' => 1
        ]);

        MenuItem::create([
            'menu_group_id' => $aboutGroup->id,
            'name' => 'Tunafanya Nini',
            'description' => 'Tunaimarisha na Kuendeleza Utoaji wa Huduma za Serikali Mtandao kwa Taasisi za Umma',
            'link' => '/about/what-we-do',
            'status' => 'active',
            'order' => 2
        ]);

        MenuItem::create([
            'menu_group_id' => $aboutGroup->id,
            'name' => 'Kutoka kwa Mkurugenzi Mkuu',
            'description' => 'Kwa niaba ya Menejimenti na Watumishi wa Mamlaka ya Serikali Mtandao (e-GA), ninayo furaha kuwakaribisha kwenye tovuti yetu mpya',
            'link' => '/about/director-general',
            'status' => 'active',
            'order' => 3
        ]);

        MenuItem::create([
            'menu_group_id' => $aboutGroup->id,
            'name' => 'Bodi ya Wakurugenzi',
            'description' => 'Kwa furaha, ninakukaribisha kwenye tovuti ya Mamlaka ya Serikali Mtandao (e-GA). Kama Mwenyekiti wa Bodi hii, natambua juhudi, ari na nguvu kazi inayochochewa katika kufikia malengo.',
            'link' => '/about/board',
            'status' => 'active',
            'order' => 4
        ]);
    }

    private function createServicesGroup($mainMenu)
    {
        $servicesGroup = MenuGroup::create([
            'menu_type_id' => $mainMenu->id,
            'name' => 'Mifumo na Huduma',
            'description' => 'Systems and services section',
            'status' => 'active',
            'order' => 3
        ]);

        MenuItem::create([
            'menu_group_id' => $servicesGroup->id,
            'name' => 'Mifumo',
            'description' => 'Mamlaka kwa kushirikiana na Taasisi mbalimbali za Umma, imesanifu, kujenga na kusimamia mifumo na miundombinu mbalimbali ya TEHAMA',
            'link' => '/services/systems',
            'status' => 'active',
            'order' => 1
        ]);

        MenuItem::create([
            'menu_group_id' => $servicesGroup->id,
            'name' => 'Tovuti',
            'description' => 'Mamlaka imesanifu na kutengeneza Tovuti mbalimbali za taasisi za umma kwa lengo la kuwezesha utoaji na upatikanaji wa taarifa',
            'link' => '/services/websites',
            'status' => 'active',
            'order' => 2
        ]);

        MenuItem::create([
            'menu_group_id' => $servicesGroup->id,
            'name' => 'Huduma Zetu',
            'description' => 'Huduma zetu zimesanifiwa na kutengenezwa na watalamu wa ndani kwa lengo la kuandaa mazingira wezeshi',
            'link' => '/services/our-services',
            'status' => 'active',
            'order' => 3
        ]);
    }

    private function createGuidelinesGroup($mainMenu)
    {
        $guidelinesGroup = MenuGroup::create([
            'menu_type_id' => $mainMenu->id,
            'name' => 'Miongozo na Viwango',
            'description' => 'Guidelines and standards section',
            'status' => 'active',
            'order' => 4
        ]);

        MenuItem::create([
            'menu_group_id' => $guidelinesGroup->id,
            'name' => 'Miongozo ya Kisera',
            'description' => 'Miongozo iliyoandaliwa na Ofisi ya Rais Menejimenti ya Utumishi wa Umma na Utawala Bora',
            'link' => '/guidelines/sector-guidelines',
            'status' => 'active',
            'order' => 1
        ]);

        MenuItem::create([
            'menu_group_id' => $guidelinesGroup->id,
            'name' => 'Viwango na Miongozo',
            'description' => 'Miongozo iliyoandaliwa na Mamlaka ya Serikali Mtandao kwa lengo kutoa maelekezo ya kiufundi',
            'link' => '/guidelines/standards',
            'status' => 'active',
            'order' => 2
        ]);

        MenuItem::create([
            'menu_group_id' => $guidelinesGroup->id,
            'name' => 'Sampuli na Violezo vya Nyaraka',
            'description' => 'Violezo vya utengenezaji wa nyaraka za Uendeshaji na Usimamizi wa shughuli mbalimbali za TEHAMA',
            'link' => '/guidelines/templates',
            'status' => 'active',
            'order' => 3
        ]);

        MenuItem::create([
            'menu_group_id' => $guidelinesGroup->id,
            'name' => 'Orodha ya Viwango na Miongozo',
            'description' => 'Sehemu hii ina orodha ya Viwango na Miongozo ya Serikali Mtandao',
            'link' => '/guidelines/list',
            'status' => 'active',
            'order' => 4
        ]);
    }

    private function createNewsGroup($mainMenu)
    {
        $newsGroup = MenuGroup::create([
            'menu_type_id' => $mainMenu->id,
            'name' => 'Kituo cha Habari',
            'description' => 'News center section',
            'status' => 'active',
            'order' => 5
        ]);

        MenuItem::create([
            'menu_group_id' => $newsGroup->id,
            'name' => 'Maktaba ya Picha',
            'description' => 'Sehemu hii inaonesha picha za matukio mbalimbali yanayohusiana na e-GA',
            'link' => '/news/gallery',
            'status' => 'active',
            'order' => 1
        ]);

        MenuItem::create([
            'menu_group_id' => $newsGroup->id,
            'name' => 'Maktaba ya Video',
            'description' => 'Sehemu hii inaonesha video za matukio mbalimbali yanayohusiana na e-GA',
            'link' => '/news/videos',
            'status' => 'active',
            'order' => 2
        ]);

        MenuItem::create([
            'menu_group_id' => $newsGroup->id,
            'name' => 'Habari',
            'description' => 'Sehemu hii ni maalumu kwa ajili ya habari na matukio yote yaliyojiri na yanayohusiana na e-GA',
            'link' => '/news/articles',
            'status' => 'active',
            'order' => 3
        ]);

        MenuItem::create([
            'menu_group_id' => $newsGroup->id,
            'name' => 'Kutoka Magazetini',
            'description' => 'Sehemu hii ni maalumu kwa ajili ya taarifa zilizojiri kwenye magazeti mbalimbali zinazohusu e-GA',
            'link' => '/news/press',
            'status' => 'active',
            'order' => 4
        ]);
    }

    private function createContactGroup($mainMenu)
    {
        $contactGroup = MenuGroup::create([
            'menu_type_id' => $mainMenu->id,
            'name' => 'Wasiliana Nasi',
            'description' => 'Contact us section',
            'status' => 'active',
            'order' => 6
        ]);

        MenuItem::create([
            'menu_group_id' => $contactGroup->id,
            'name' => 'Wasiliana Nasi',
            'description' => 'Contact us page',
            'link' => '/contact',
            'status' => 'active',
            'order' => 1
        ]);
    }

    private function createLoginGroup($mainMenu)
    {
        $loginGroup = MenuGroup::create([
            'menu_type_id' => $mainMenu->id,
            'name' => 'Login',
            'description' => 'Login section',
            'status' => 'active',
            'order' => 7
        ]);

        MenuItem::create([
            'menu_group_id' => $loginGroup->id,
            'name' => 'Login',
            'description' => 'Login page',
            'link' => '/login',
            'status' => 'active',
            'order' => 1
        ]);
    }
}


