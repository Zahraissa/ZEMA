<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SampleTemplate;

class SampleTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'title' => 'Project Proposal Template',
                'description' => 'Standard template for government project proposals',
                'content' => 'This template provides a structured format for project proposals including executive summary, objectives, methodology, budget, and timeline.',
                'template_type' => 'Document Template',
                'category' => 'Project Management',
                'template_category' => 'Project Management',
                'use_case' => 'New project planning and approval',
                'version' => '3.0',
                'status' => 'active',
                'author' => 'Project Management Office',
                'department' => 'Planning Department',
                'date_published' => '2024-01-10',
                'tags' => ['project', 'proposal', 'template', 'planning'],
                'prerequisites' => ['Project planning knowledge', 'Budget estimation skills', 'Stakeholder management'],
                'estimated_time' => '2-3 hours',
                'complexity' => 'Medium',
                'featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Budget Request Form',
                'description' => 'Standard form for budget requests and approvals',
                'content' => 'This form standardizes the budget request process with clear sections for justification, cost breakdown, and approval workflow.',
                'template_type' => 'Form Template',
                'category' => 'Finance',
                'template_category' => 'Finance',
                'use_case' => 'Annual budget planning and requests',
                'version' => '2.1',
                'status' => 'active',
                'author' => 'Finance Department',
                'department' => 'Finance Department',
                'date_published' => '2024-01-20',
                'tags' => ['budget', 'finance', 'form', 'request'],
                'prerequisites' => ['Financial planning basics', 'Department budget knowledge'],
                'estimated_time' => '1-2 hours',
                'complexity' => 'Low',
                'featured' => false,
                'order' => 2,
            ],
            [
                'title' => 'Meeting Minutes Template',
                'description' => 'Standard template for recording meeting minutes',
                'content' => 'Comprehensive template for recording meeting minutes with sections for attendees, agenda items, decisions, and action items.',
                'template_type' => 'Document Template',
                'category' => 'Administration',
                'template_category' => 'Administration',
                'use_case' => 'Official meeting documentation',
                'version' => '1.5',
                'status' => 'active',
                'author' => 'Administrative Services',
                'department' => 'Administration Department',
                'date_published' => '2024-01-05',
                'tags' => ['meeting', 'minutes', 'documentation', 'administration'],
                'prerequisites' => ['Note-taking skills', 'Meeting facilitation knowledge'],
                'estimated_time' => '30-45 minutes',
                'complexity' => 'Low',
                'featured' => false,
                'order' => 3,
            ],
            [
                'title' => 'Risk Assessment Template',
                'description' => 'Template for conducting risk assessments',
                'content' => 'Structured template for identifying, analyzing, and mitigating risks in government projects and operations.',
                'template_type' => 'Assessment Template',
                'category' => 'Risk Management',
                'template_category' => 'Risk Management',
                'use_case' => 'Project and operational risk assessment',
                'version' => '2.0',
                'status' => 'active',
                'author' => 'Risk Management Office',
                'department' => 'Planning Department',
                'date_published' => '2024-01-25',
                'tags' => ['risk', 'assessment', 'management', 'evaluation'],
                'prerequisites' => ['Risk management knowledge', 'Project analysis skills'],
                'estimated_time' => '3-4 hours',
                'complexity' => 'High',
                'featured' => true,
                'order' => 4,
            ],
            [
                'title' => 'Performance Evaluation Form',
                'description' => 'Standard form for employee performance evaluation',
                'content' => 'Comprehensive form for evaluating employee performance with clear criteria and rating scales.',
                'template_type' => 'Form Template',
                'category' => 'Human Resources',
                'template_category' => 'Human Resources',
                'use_case' => 'Annual performance reviews',
                'version' => '1.8',
                'status' => 'active',
                'author' => 'Human Resources Department',
                'department' => 'Human Resources Department',
                'date_published' => '2024-01-15',
                'tags' => ['performance', 'evaluation', 'hr', 'assessment'],
                'prerequisites' => ['HR management knowledge', 'Performance evaluation skills'],
                'estimated_time' => '1-2 hours',
                'complexity' => 'Medium',
                'featured' => false,
                'order' => 5,
            ],
        ];

        foreach ($templates as $template) {
            SampleTemplate::create($template);
        }
    }
}