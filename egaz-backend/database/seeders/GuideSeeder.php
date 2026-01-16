<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Guide;

class GuideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guides = [
            [
                'title' => 'Document Requirements for Business Registration',
                'description' => 'Complete guide on required documents for registering a new business in Zanzibar',
                'content' => 'This guide provides detailed information about all documents required for business registration including identification documents, business plans, and legal requirements.',
                'category' => 'Document Requirements',
                'status' => 'active',
                'order' => 1,
                'author' => 'eGAZ Team',
                'tags' => ['business', 'registration', 'documents'],
                'featured' => true,
                'view_count' => 150,
                'download_count' => 45,
            ],
            [
                'title' => 'Step-by-Step Application Process',
                'description' => 'Detailed walkthrough of the application process for government services',
                'content' => 'Learn how to navigate through the complete application process from start to finish with helpful tips and best practices.',
                'category' => 'Application Process',
                'status' => 'active',
                'order' => 2,
                'author' => 'eGAZ Team',
                'tags' => ['application', 'process', 'guide'],
                'featured' => true,
                'view_count' => 200,
                'download_count' => 78,
            ],
            [
                'title' => 'Service Fees and Payment Methods',
                'description' => 'Comprehensive information about fees for various government services',
                'content' => 'Detailed breakdown of all service fees, payment methods accepted, and available exemptions for different categories of users.',
                'category' => 'Service Fees',
                'status' => 'active',
                'order' => 3,
                'author' => 'eGAZ Team',
                'tags' => ['fees', 'payment', 'services'],
                'featured' => false,
                'view_count' => 120,
                'download_count' => 32,
            ],
            [
                'title' => 'Government Service Centers Directory',
                'description' => 'Complete directory of government service centers and their locations',
                'content' => 'Find the nearest government service center with operating hours, contact information, and available services at each location.',
                'category' => 'Service Locations',
                'status' => 'active',
                'order' => 4,
                'author' => 'eGAZ Team',
                'tags' => ['locations', 'centers', 'directory'],
                'featured' => false,
                'view_count' => 180,
                'download_count' => 56,
            ],
            [
                'title' => 'Digital Services User Manual',
                'description' => 'Complete user manual for accessing digital government services',
                'content' => 'Step-by-step instructions for using the digital government services platform, including account creation, service requests, and tracking.',
                'category' => 'User Manuals',
                'status' => 'active',
                'order' => 5,
                'author' => 'eGAZ Team',
                'tags' => ['digital', 'manual', 'user guide'],
                'featured' => true,
                'view_count' => 300,
                'download_count' => 120,
            ],
            [
                'title' => 'Frequently Asked Questions',
                'description' => 'Common questions and answers about government services',
                'content' => 'Comprehensive FAQ section covering the most common questions about government services, applications, and procedures.',
                'category' => 'FAQs',
                'status' => 'active',
                'order' => 6,
                'author' => 'eGAZ Team',
                'tags' => ['faq', 'questions', 'help'],
                'featured' => false,
                'view_count' => 250,
                'download_count' => 89,
            ],
            [
                'title' => 'Technical Support Guide',
                'description' => 'Technical troubleshooting guide for digital services',
                'content' => 'Technical support guide for resolving common issues with digital government services, including browser compatibility and system requirements.',
                'category' => 'Technical',
                'status' => 'active',
                'order' => 7,
                'author' => 'eGAZ Team',
                'tags' => ['technical', 'support', 'troubleshooting'],
                'featured' => false,
                'view_count' => 95,
                'download_count' => 28,
            ],
            [
                'title' => 'General Information Guide',
                'description' => 'General information about government services and procedures',
                'content' => 'Overview of all government services available through the digital platform and traditional service centers.',
                'category' => 'General',
                'status' => 'active',
                'order' => 8,
                'author' => 'eGAZ Team',
                'tags' => ['general', 'information', 'overview'],
                'featured' => false,
                'view_count' => 160,
                'download_count' => 42,
            ],
        ];

        foreach ($guides as $guide) {
            Guide::create($guide);
        }
    }
}
