<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ContactOffice;

class ContactOfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $offices = [
            [
                'title' => 'HEADQUARTER',
                'office_type' => 'headquarter',
                'office_name' => "President's Office\ne-Government Authority",
                'location' => 'Mtumba-Mtandao Street',
                'postal_address' => 'PO Box 2833, 40404 DODOMA.',
                'email' => 'barua@ega.go.tz',
                'phone' => '+255 026 - 296 1957',
                'helpdesk' => '+255 764 292 299 / +255 0763 292 299',
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890123!2d35.12345678901234!3d-6.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuMCJTIDM1wrAwNycwMC4wIkU!5e0!3m2!1sen!2stz!4v1234567890123',
                'map_latitude' => -6.12345678901234,
                'map_longitude' => 35.12345678901234,
                'map_rating' => 4.7,
                'map_reviews' => 3,
                'order' => 1,
                'status' => 'active'
            ],
            [
                'title' => 'DAR ES SALAAM',
                'office_type' => 'regional',
                'office_name' => "President's Office\ne-Government Authority",
                'location' => '8 Kivukoni Road, Utumishi House,',
                'postal_address' => 'PO Box 4273, Dar es Salaam',
                'email' => 'info@ega.go.tz',
                'phone' => '+255222129868',
                'helpdesk' => null,
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890123!2d39.12345678901234!3d-6.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuMCJTIDM5wrAwNycwMC4wIkU!5e0!3m2!1sen!2stz!4v1234567890123',
                'map_latitude' => -6.12345678901234,
                'map_longitude' => 39.12345678901234,
                'map_rating' => 4.2,
                'map_reviews' => 65,
                'order' => 2,
                'status' => 'active'
            ],
            [
                'title' => 'IRINGA',
                'office_type' => 'regional',
                'office_name' => "President's Office\ne-Government Authority",
                'location' => 'Iringa NSSF Akiba HOUSE, Mtaa wa Miyombo, Kiwanja Na. 11-16, Ghorofa ya tatu',
                'postal_address' => 'P. O Box 1149',
                'email' => 'info@ega.go.tz',
                'phone' => '+255 026 - 296 1957',
                'helpdesk' => null,
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890123!2d35.12345678901234!3d-7.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDcnMjQuMCJTIDM1wrAwNycwMC4wIkU!5e0!3m2!1sen!2stz!4v1234567890123',
                'map_latitude' => -7.12345678901234,
                'map_longitude' => 35.12345678901234,
                'map_rating' => 3.0,
                'map_reviews' => 1,
                'order' => 3,
                'status' => 'active'
            ],
            [
                'title' => 'RESEARCH AND INNOVATION CENTRE',
                'office_type' => 'research',
                'office_name' => "President's Office\ne-Government Authority",
                'location' => 'Academic Block, 3rd Floor College of Informatics and Virtual Education, University of Dodoma',
                'postal_address' => 'P.O. BOX 2833, 40404 DODOMA',
                'email' => 'info@ega.go.tz',
                'phone' => '+255 764 292 299',
                'helpdesk' => null,
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890123!2d35.12345678901234!3d-6.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuMCJTIDM1wrAwNycwMC4wIkU!5e0!3m2!1sen!2stz!4v1234567890123',
                'map_latitude' => -6.12345678901234,
                'map_longitude' => 35.12345678901234,
                'map_rating' => null,
                'map_reviews' => null,
                'order' => 4,
                'status' => 'active'
            ]
        ];

        foreach ($offices as $office) {
            ContactOffice::create($office);
        }
    }
}
