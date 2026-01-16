<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Guideline;
use Carbon\Carbon;

class GuidelinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Main Document
        Guideline::create([
            'title' => 'Mwongozo wa Serikali Mtandao - 2017',
            'description' => 'Mwongozo huu ni maelekezo ya kiufundi kwa Taasisi za Umma na watumishi wa Serikali kufuata maagizo kuhusu matumizi ya TEHAMA na vifa vinavyohusiana.',
            'category' => 'main',
            'document_type' => 'Mwongozo',
            'version' => '1.0',
            'date_published' => '2017-12-01',
            'last_updated' => '2017-12-01',
            'status' => 'active',
            'file_url' => '/assets/documents/mwongozo-serikali-mtandao-2017.pdf',
            'tags' => ['serikali', 'mtandao', 'tehama'],
            'author' => 'e-Government Authority',
            'department' => 'ICT Department',
            'is_main_document' => true,
            'featured' => true,
            'view_count' => 1250,
            'download_count' => 890,
            'order' => 1,
        ]);

        // Related Documents
        Guideline::create([
            'title' => 'Mwongozo wa Usimamizi wa Miradi ya Tehama',
            'description' => 'Maelekezo ya kiufundi kwa usimamizi wa miradi ya teknolojia ya habari na mawasiliano.',
            'category' => 'related',
            'document_type' => 'Mwongozo',
            'version' => '2.1',
            'date_published' => '2025-07-22',
            'last_updated' => '2025-07-22',
            'status' => 'active',
            'file_url' => '/assets/documents/mwongozo-usimamizi-miradi-tehama.pdf',
            'tags' => ['miradi', 'usimamizi', 'tehama'],
            'author' => 'e-Government Authority',
            'department' => 'Project Management',
            'is_main_document' => false,
            'featured' => false,
            'view_count' => 456,
            'download_count' => 234,
            'order' => 2,
        ]);

        Guideline::create([
            'title' => 'Mwongozo wa Matumizi Bora, Sahihi na Salama wa Vifaa, Data na Mifumo ya Tehama Serikalini 2022',
            'description' => 'Maelekezo kuhusu matumizi bora na salama wa vifaa vya teknolojia na mifumo ya data katika sekta ya umma.',
            'category' => 'related',
            'document_type' => 'Mwongozo',
            'version' => '1.5',
            'date_published' => '2025-07-21',
            'last_updated' => '2025-07-21',
            'status' => 'active',
            'file_url' => '/assets/documents/mwongozo-matumizi-bora-vifaa-tehama-2022.pdf',
            'tags' => ['matumizi', 'salama', 'vifaa', 'data'],
            'author' => 'e-Government Authority',
            'department' => 'Security Department',
            'is_main_document' => false,
            'featured' => false,
            'view_count' => 789,
            'download_count' => 567,
            'order' => 3,
        ]);

        Guideline::create([
            'title' => 'Mwongozo wa Kusimamia na Kuendesha Tovuti za Serikali',
            'description' => 'Maelekezo ya kiufundi kwa usimamizi na uendeshaji wa tovuti za serikali.',
            'category' => 'related',
            'document_type' => 'Mwongozo',
            'version' => '1.2',
            'date_published' => '2014-12-01',
            'last_updated' => '2014-12-01',
            'status' => 'active',
            'file_url' => '/assets/documents/mwongozo-kusimamia-tovuti-serikali.pdf',
            'tags' => ['tovuti', 'serikali', 'usimamizi'],
            'author' => 'e-Government Authority',
            'department' => 'Web Development',
            'is_main_document' => false,
            'featured' => false,
            'view_count' => 345,
            'download_count' => 123,
            'order' => 4,
        ]);

        Guideline::create([
            'title' => 'Viwango vya Usalama wa Data na Mawasiliano',
            'description' => 'Viwango na miongozo kuhusu usalama wa data na mawasiliano katika sekta ya umma.',
            'category' => 'related',
            'document_type' => 'Viwango',
            'version' => '3.0',
            'date_published' => '2025-06-15',
            'last_updated' => '2025-06-15',
            'status' => 'active',
            'file_url' => '/assets/documents/viwango-usalama-data-mawasiliano.pdf',
            'tags' => ['usalama', 'data', 'mawasiliano', 'viwango'],
            'author' => 'e-Government Authority',
            'department' => 'Security Department',
            'is_main_document' => false,
            'featured' => true,
            'view_count' => 678,
            'download_count' => 445,
            'order' => 5,
        ]);

        Guideline::create([
            'title' => 'Miongozo ya Uwekezaji wa Teknolojia ya Habari',
            'description' => 'Miongozo kuhusu uwekezaji wa teknolojia ya habari katika taasisi za umma.',
            'category' => 'related',
            'document_type' => 'Miongozo',
            'version' => '2.0',
            'date_published' => '2025-05-10',
            'last_updated' => '2025-05-10',
            'status' => 'active',
            'file_url' => '/assets/documents/miongozo-uwekezaji-teknolojia-habari.pdf',
            'tags' => ['uwekezaji', 'teknolojia', 'habari', 'miongozo'],
            'author' => 'e-Government Authority',
            'department' => 'Investment Department',
            'is_main_document' => false,
            'featured' => false,
            'view_count' => 234,
            'download_count' => 156,
            'order' => 6,
        ]);

        Guideline::create([
            'title' => 'Viwango vya Uendeshaji wa Mifumo ya Kompyuta',
            'description' => 'Viwango na miongozo kuhusu uendeshaji wa mifumo ya kompyuta katika sekta ya umma.',
            'category' => 'related',
            'document_type' => 'Viwango',
            'version' => '1.8',
            'date_published' => '2025-04-20',
            'last_updated' => '2025-04-20',
            'status' => 'active',
            'file_url' => '/assets/documents/viwango-uendeshaji-mifumo-kompyuta.pdf',
            'tags' => ['uendeshaji', 'mifumo', 'kompyuta', 'viwango'],
            'author' => 'e-Government Authority',
            'department' => 'Systems Department',
            'is_main_document' => false,
            'featured' => false,
            'view_count' => 567,
            'download_count' => 389,
            'order' => 7,
        ]);
    }
}
