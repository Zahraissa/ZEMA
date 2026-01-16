<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // User Management Permissions
            [
                'name' => 'manage_users',
                'slug' => 'manage-users',
                'display_name' => 'Manage Users',
                'description' => 'Full access to user management',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'view_users',
                'slug' => 'view-users',
                'display_name' => 'View Users',
                'description' => 'View list of users',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'create_users',
                'slug' => 'create-users',
                'display_name' => 'Create Users',
                'description' => 'Create new user accounts',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'edit_users',
                'slug' => 'edit-users',
                'display_name' => 'Edit Users',
                'description' => 'Edit user information',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'delete_users',
                'slug' => 'delete-users',
                'display_name' => 'Delete Users',
                'description' => 'Delete user accounts',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'manage_user_roles',
                'slug' => 'manage-user-roles',
                'display_name' => 'Manage User Roles',
                'description' => 'Assign and manage user roles',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'assign_roles',
                'slug' => 'assign-roles',
                'display_name' => 'Assign Roles',
                'description' => 'Assign roles to users',
                'group' => 'users',
                'category' => 'users',
            ],

            // Role Management Permissions
            [
                'name' => 'manage_roles',
                'slug' => 'manage-roles',
                'display_name' => 'Manage Roles',
                'description' => 'Full access to role management',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'view_roles',
                'slug' => 'view-roles',
                'display_name' => 'View Roles',
                'description' => 'View list of roles',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'create_roles',
                'slug' => 'create-roles',
                'display_name' => 'Create Roles',
                'description' => 'Create new roles',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'edit_roles',
                'slug' => 'edit-roles',
                'display_name' => 'Edit Roles',
                'description' => 'Edit role information',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'delete_roles',
                'slug' => 'delete-roles',
                'display_name' => 'Delete Roles',
                'description' => 'Delete roles',
                'group' => 'users',
                'category' => 'users',
            ],

            // Permission Management
            [
                'name' => 'manage_permissions',
                'slug' => 'manage-permissions',
                'display_name' => 'Manage Permissions',
                'description' => 'Full access to permission management',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'view_permissions',
                'slug' => 'view-permissions',
                'display_name' => 'View Permissions',
                'description' => 'View list of permissions',
                'group' => 'users',
                'category' => 'users',
            ],
            [
                'name' => 'create_permissions',
                'slug' => 'create-permissions',
                'display_name' => 'Create Permissions',
                'description' => 'Create new permissions',
                'group' => 'users',
                'category' => 'users',
            ],

            // Content Management Permissions
            [
                'name' => 'manage_sliders',
                'slug' => 'manage-sliders',
                'display_name' => 'Manage Sliders',
                'description' => 'Manage homepage sliders',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_sliders',
                'slug' => 'view-sliders',
                'display_name' => 'View Sliders',
                'description' => 'View sliders',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_about',
                'slug' => 'manage-about',
                'display_name' => 'Manage About',
                'description' => 'Manage about page content',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_about',
                'slug' => 'view-about',
                'display_name' => 'View About',
                'description' => 'View about content',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_news',
                'slug' => 'manage-news',
                'display_name' => 'Manage News',
                'description' => 'Full access to news management',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_news',
                'slug' => 'view-news',
                'display_name' => 'View News',
                'description' => 'View news articles',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_services',
                'slug' => 'manage-services',
                'display_name' => 'Manage Services',
                'description' => 'Manage services content',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_services',
                'slug' => 'view-services',
                'display_name' => 'View Services',
                'description' => 'View services',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_website_services',
                'slug' => 'manage-website-services',
                'display_name' => 'Manage Website Services',
                'description' => 'Manage website services',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_website_services',
                'slug' => 'view-website-services',
                'display_name' => 'View Website Services',
                'description' => 'View website services',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_gallery',
                'slug' => 'manage-gallery',
                'display_name' => 'Manage Gallery',
                'description' => 'Manage gallery images',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_gallery',
                'slug' => 'view-gallery',
                'display_name' => 'View Gallery',
                'description' => 'View gallery',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_members',
                'slug' => 'manage-members',
                'display_name' => 'Manage Members',
                'description' => 'Manage band members',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_members',
                'slug' => 'view-members',
                'display_name' => 'View Members',
                'description' => 'View members',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_director_general',
                'slug' => 'manage-director-general',
                'display_name' => 'Manage Director General',
                'description' => 'Manage Director General content',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_director_general',
                'slug' => 'view-director-general',
                'display_name' => 'View Director General',
                'description' => 'View Director General content',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_authority_functions',
                'slug' => 'manage-authority-functions',
                'display_name' => 'Manage Authority Functions',
                'description' => 'Manage Authority Functions content',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_authority_functions',
                'slug' => 'view-authority-functions',
                'display_name' => 'View Authority Functions',
                'description' => 'View Authority Functions',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_contacts',
                'slug' => 'manage-contacts',
                'display_name' => 'Manage Contacts',
                'description' => 'Manage contact office information',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_contacts',
                'slug' => 'view-contacts',
                'display_name' => 'View Contacts',
                'description' => 'View contact offices',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_muhimu',
                'slug' => 'manage-muhimu',
                'display_name' => 'Manage Muhimu Section',
                'description' => 'Manage Muhimu section (announcements, videos, downloads)',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_muhimu',
                'slug' => 'view-muhimu',
                'display_name' => 'View Muhimu',
                'description' => 'View Muhimu section',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_policy_guidelines',
                'slug' => 'manage-policy-guidelines',
                'display_name' => 'Manage Policy Guidelines',
                'description' => 'Manage Miongozo ya Kisera',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_policy_guidelines',
                'slug' => 'view-policy-guidelines',
                'display_name' => 'View Policy Guidelines',
                'description' => 'View policy guidelines',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_viwango',
                'slug' => 'manage-viwango',
                'display_name' => 'Manage Viwango',
                'description' => 'Manage Viwango na Miongozo',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_viwango',
                'slug' => 'view-viwango',
                'display_name' => 'View Viwango',
                'description' => 'View Viwango na Miongozo',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_samples',
                'slug' => 'manage-samples',
                'display_name' => 'Manage Samples',
                'description' => 'Manage Samples & Templates',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_samples',
                'slug' => 'view-samples',
                'display_name' => 'View Samples',
                'description' => 'View samples and templates',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_orodha',
                'slug' => 'manage-orodha',
                'display_name' => 'Manage Orodha',
                'description' => 'Manage Orodha ya Viwango na Miongozo',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_orodha',
                'slug' => 'view-orodha',
                'display_name' => 'View Orodha',
                'description' => 'View Orodha ya Viwango na Miongozo',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_system',
                'slug' => 'manage-system',
                'display_name' => 'Manage System',
                'description' => 'Manage system settings and brands',
                'group' => 'settings',
                'category' => 'settings',
            ],
            [
                'name' => 'view_system',
                'slug' => 'view-system',
                'display_name' => 'View System',
                'description' => 'View system settings',
                'group' => 'settings',
                'category' => 'settings',
            ],
            [
                'name' => 'manage_menu',
                'slug' => 'manage-menu',
                'display_name' => 'Manage Menu',
                'description' => 'Manage website navigation menu',
                'group' => 'settings',
                'category' => 'settings',
            ],
            [
                'name' => 'view_menu',
                'slug' => 'view-menu',
                'display_name' => 'View Menu',
                'description' => 'View menu structure',
                'group' => 'settings',
                'category' => 'settings',
            ],
            [
                'name' => 'manage_guidelines',
                'slug' => 'manage-guidelines',
                'display_name' => 'Manage Guidelines',
                'description' => 'Manage guidelines',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_guidelines',
                'slug' => 'view-guidelines',
                'display_name' => 'View Guidelines',
                'description' => 'View guidelines',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_welcome_messages',
                'slug' => 'manage-welcome-messages',
                'display_name' => 'Manage Welcome Messages',
                'description' => 'Manage welcome messages',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_welcome_messages',
                'slug' => 'view-welcome-messages',
                'display_name' => 'View Welcome Messages',
                'description' => 'View welcome messages',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'manage_faqs',
                'slug' => 'manage-faqs',
                'display_name' => 'Manage FAQs',
                'description' => 'Manage frequently asked questions',
                'group' => 'content',
                'category' => 'content',
            ],
            [
                'name' => 'view_faqs',
                'slug' => 'view-faqs',
                'display_name' => 'View FAQs',
                'description' => 'View FAQs',
                'group' => 'content',
                'category' => 'content',
            ],
        ];

        $createdCount = 0;
        $existingCount = 0;
        
        foreach ($permissions as $permission) {
            $result = Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
            
            if ($result->wasRecentlyCreated) {
                $createdCount++;
            } else {
                $existingCount++;
            }
        }
        
        $this->command->info("Permission Seeder completed!");
        $this->command->info("Created: {$createdCount} permissions");
        $this->command->info("Already existed: {$existingCount} permissions");
        $this->command->info("Total permissions: " . Permission::count());
    }
}


