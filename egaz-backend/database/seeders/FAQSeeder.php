<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FAQ;

class FAQSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'What services does Egaz offer?',
                'answer' => 'Egaz offers a comprehensive range of services including web development, mobile app development, digital marketing, UI/UX design, and IT consulting. We specialize in creating modern, scalable solutions for businesses of all sizes.',
                'category' => 'Services',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'question' => 'How can I contact Egaz for a project?',
                'answer' => 'You can contact us through multiple channels: email us at info@egaz.com, call us at +1234567890, or fill out the contact form on our website. We typically respond within 24 hours during business days.',
                'category' => 'Contact',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'question' => 'What is the typical project timeline?',
                'answer' => 'Project timelines vary depending on complexity and scope. Simple websites typically take 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during the initial consultation and keep you updated throughout the process.',
                'category' => 'Project Management',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'question' => 'Do you provide ongoing support after project completion?',
                'answer' => 'Yes, we offer various support packages including maintenance, updates, hosting, and technical support. We believe in building long-term relationships with our clients and ensuring their digital solutions continue to perform optimally.',
                'category' => 'Support',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'question' => 'What technologies do you use?',
                'answer' => 'We use modern, industry-standard technologies including React, Vue.js, Laravel, Node.js, Python, and various cloud platforms. Our technology stack is chosen based on project requirements to ensure optimal performance and scalability.',
                'category' => 'Technology',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'question' => 'Do you work with international clients?',
                'answer' => 'Absolutely! We have experience working with clients from various countries and time zones. We use modern collaboration tools and maintain clear communication channels to ensure smooth project delivery regardless of location.',
                'category' => 'International',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'question' => 'What is your pricing structure?',
                'answer' => 'Our pricing is project-based and depends on factors like complexity, features, and timeline. We provide detailed quotes after understanding your requirements. We also offer flexible payment terms and milestone-based payments.',
                'category' => 'Pricing',
                'is_active' => true,
                'order' => 7,
            ],
            [
                'question' => 'Do you provide training for the solutions you build?',
                'answer' => 'Yes, we provide comprehensive training for all our solutions. This includes user training, admin training, and technical documentation. We ensure your team is comfortable using and maintaining the systems we develop.',
                'category' => 'Training',
                'is_active' => true,
                'order' => 8,
            ],
        ];

        foreach ($faqs as $faq) {
            FAQ::create($faq);
        }
    }
}
