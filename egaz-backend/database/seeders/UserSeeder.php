<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $adminRole = Role::where('name', 'admin')->first();
        $editorRole = Role::where('name', 'editor')->first();
        $authorRole = Role::where('name', 'author')->first();
        $subscriberRole = Role::where('name', 'subscriber')->first();

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@demo.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        if ($adminRole) {
            $admin->roles()->attach($adminRole->id);
        }

        // Create editor user
        $editor = User::create([
            'name' => 'Editor User',
            'email' => 'editor@demo.com',
            'password' => Hash::make('editor123'),
            'role' => 'editor',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        if ($editorRole) {
            $editor->roles()->attach($editorRole->id);
        }

        // Create author user
        $author = User::create([
            'name' => 'Author User',
            'email' => 'author@demo.com',
            'password' => Hash::make('author123'),
            'role' => 'author',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        if ($authorRole) {
            $author->roles()->attach($authorRole->id);
        }

        // Create subscriber user
        $subscriber = User::create([
            'name' => 'Subscriber User',
            'email' => 'subscriber@demo.com',
            'password' => Hash::make('subscriber123'),
            'role' => 'subscriber',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        if ($subscriberRole) {
            $subscriber->roles()->attach($subscriberRole->id);
        }

        // Create demo user (no specific role)
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => Hash::make('password'),
            'role' => 'author',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
    }
}
