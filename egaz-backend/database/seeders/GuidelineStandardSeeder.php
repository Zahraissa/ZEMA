<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GuidelineStandard;
use App\Models\GuidelinesGroup;

class GuidelineStandardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first group for our standards
        $digitalGroup = GuidelinesGroup::where('name', 'Digital Government')->first();
        $dataGroup = GuidelinesGroup::where('name', 'Data Management')->first();
        $securityGroup = GuidelinesGroup::where('name', 'Cybersecurity')->first();

        $standards = [
            [
                'title' => 'Digital Service Standards',
                'description' => 'Comprehensive standards for digital government services',
                'content' => 'This standard defines the requirements for digital government services including accessibility, usability, security, and performance standards.',
                'group_id' => $digitalGroup ? $digitalGroup->id : 1,
                'standard_type' => 'Technical Standard',
                'maturity_level' => 'Established',
                'version' => '2.1',
                'status' => 'active',
                'author' => 'Digital Government Team',
                'department' => 'ICT Department',
                'date_published' => '2024-01-15',
                'tags' => ['digital', 'government', 'services', 'accessibility'],
                'featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Data Classification Framework',
                'description' => 'Framework for classifying and handling government data',
                'content' => 'This framework provides guidelines for data classification, handling, and protection based on sensitivity levels.',
                'group_id' => $dataGroup ? $dataGroup->id : 2,
                'standard_type' => 'Framework',
                'maturity_level' => 'Pilot',
                'version' => '1.0',
                'status' => 'draft',
                'author' => 'Data Management Team',
                'department' => 'Statistics Department',
                'date_published' => '2024-02-01',
                'tags' => ['data', 'classification', 'security', 'privacy'],
                'featured' => false,
                'order' => 2,
            ],
            [
                'title' => 'Cybersecurity Incident Response',
                'description' => 'Standards for responding to cybersecurity incidents',
                'content' => 'This standard outlines the procedures and protocols for responding to cybersecurity incidents in government systems.',
                'group_id' => $securityGroup ? $securityGroup->id : 3,
                'standard_type' => 'Operational Standard',
                'maturity_level' => 'Established',
                'version' => '1.5',
                'status' => 'active',
                'author' => 'Cybersecurity Team',
                'department' => 'ICT Department',
                'date_published' => '2024-01-20',
                'tags' => ['cybersecurity', 'incident', 'response', 'security'],
                'featured' => true,
                'order' => 3,
            ],
            [
                'title' => 'API Security Standards',
                'description' => 'Security standards for government APIs',
                'content' => 'Comprehensive security standards for developing and maintaining secure APIs in government systems.',
                'group_id' => $securityGroup ? $securityGroup->id : 3,
                'standard_type' => 'Technical Standard',
                'maturity_level' => 'Pilot',
                'version' => '1.0',
                'status' => 'active',
                'author' => 'API Security Team',
                'department' => 'ICT Department',
                'date_published' => '2024-02-15',
                'tags' => ['api', 'security', 'development', 'standards'],
                'featured' => false,
                'order' => 4,
            ],
            [
                'title' => 'Data Privacy Protection Guidelines',
                'description' => 'Guidelines for protecting personal data in government systems',
                'content' => 'Detailed guidelines for implementing data privacy protection measures in accordance with local and international regulations.',
                'group_id' => $dataGroup ? $dataGroup->id : 2,
                'standard_type' => 'Guideline',
                'maturity_level' => 'Established',
                'version' => '2.0',
                'status' => 'active',
                'author' => 'Privacy Protection Team',
                'department' => 'Legal Department',
                'date_published' => '2024-01-10',
                'tags' => ['privacy', 'data', 'protection', 'compliance'],
                'featured' => true,
                'order' => 5,
            ],
        ];

        foreach ($standards as $standard) {
            GuidelineStandard::create($standard);
        }
    }
}