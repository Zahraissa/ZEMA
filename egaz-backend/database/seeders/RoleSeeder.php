<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default roles (use firstOrCreate to avoid duplicates)
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin'],
            ['description' => 'Super Administrator with complete system control and all permissions']
        );
        
        // Log if super admin was created or already existed
        if ($superAdminRole->wasRecentlyCreated) {
            $this->command->info("✓ Created Super Admin role");
        } else {
            $this->command->info("✓ Super Admin role already exists");
        }

        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['description' => 'Administrator with content and settings management access']
        );
        
        // Log if admin was created or already existed
        if ($adminRole->wasRecentlyCreated) {
            $this->command->info("✓ Created Admin role");
        } else {
            $this->command->info("✓ Admin role already exists");
        }

        $editorRole = Role::firstOrCreate(
            ['name' => 'editor'],
            ['description' => 'Can create, edit, and publish content']
        );

        $authorRole = Role::firstOrCreate(
            ['name' => 'author'],
            ['description' => 'Can create and edit their own content']
        );

        $subscriberRole = Role::firstOrCreate(
            ['name' => 'subscriber'],
            ['description' => 'Read-only access to content']
        );

        // Get all permissions (if they exist)
        $allPermissions = Permission::all();
        
        if ($allPermissions->isEmpty()) {
            $this->command->warn("No permissions found! Please run PermissionSeeder first.");
            return;
        }
        
        $this->command->info("Found " . $allPermissions->count() . " permissions to assign to roles.");
        $this->command->info("Super Admin Role ID: " . $superAdminRole->id . ", Name: " . $superAdminRole->name);
        
        // Assign all permissions to super admin (highest level access - complete system control)
        $superAdminRole->permissions()->sync($allPermissions->pluck('id'));
        $superAdminRole->refresh(); // Refresh to get updated permissions
        $this->command->info("✓ Super Admin role assigned " . $allPermissions->count() . " permissions (Full System Access)");
        $this->command->info("Super Admin now has " . $superAdminRole->permissions()->count() . " permissions");
        
        // Assign permissions to admin (content and settings management, but NOT user/role/permission management)
        // Admin can manage content and settings but cannot manage users, roles, or permissions
        $adminPermissions = Permission::where(function($query) {
            $query->where('group', 'content')
                  ->orWhere('group', 'settings');
        })->get();
        
        if ($adminPermissions->isNotEmpty()) {
            $adminRole->permissions()->sync($adminPermissions->pluck('id'));
            $this->command->info("✓ Admin role assigned " . $adminPermissions->count() . " permissions (Content & Settings Only)");
        } else {
            $this->command->warn("No content/settings permissions found for admin role");
        }

        // Assign content management permissions to editor
        $editorPermissions = Permission::where(function($query) {
            $query->where('group', 'content')
                  ->orWhere('group', 'settings');
        })->get();
        
        if ($editorPermissions->isNotEmpty()) {
            $editorRole->permissions()->sync($editorPermissions->pluck('id'));
            $this->command->info("✓ Editor role assigned " . $editorPermissions->count() . " permissions");
        } else {
            $this->command->warn("No content/settings permissions found for editor role");
        }

        // Assign limited content permissions to author
        // Author can only view and manage specific content types
        $authorPermissions = Permission::whereIn('name', [
            'view_news',
            'manage_news',
            'view_about',
            'manage_about',
            'view_services',
            'manage_services',
            'view_gallery',
            'manage_gallery',
            'view_members',
            'manage_members',
            'view_director_general',
            'manage_director_general',
            'view_authority_functions',
            'manage_authority_functions',
            'view_contacts',
            'manage_contacts',
            'view_muhimu',
            'manage_muhimu',
            'view_policy_guidelines',
            'manage_policy_guidelines',
            'view_viwango',
            'manage_viwango',
            'view_samples',
            'manage_samples',
            'view_orodha',
            'manage_orodha',
            'view_guidelines',
            'manage_guidelines',
            'view_welcome_messages',
            'manage_welcome_messages',
            'view_faqs',
            'manage_faqs',
        ])->get();
        
        if ($authorPermissions->isNotEmpty()) {
            $authorRole->permissions()->sync($authorPermissions->pluck('id'));
            $this->command->info("✓ Author role assigned " . $authorPermissions->count() . " permissions");
        } else {
            $this->command->warn("No author permissions found");
        }

        // Assign view-only permissions to subscriber
        $viewPermissions = Permission::where('name', 'like', 'view_%')->get();
        if ($viewPermissions->isNotEmpty()) {
            $subscriberRole->permissions()->sync($viewPermissions->pluck('id'));
            $this->command->info("✓ Subscriber role assigned " . $viewPermissions->count() . " permissions");
        } else {
            $this->command->warn("No view permissions found for subscriber role");
        }
        
        // Verify all roles were created
        $allRoles = Role::all();
        $this->command->info("\n=== Role Seeder Summary ===");
        $this->command->info("Total roles in database: " . $allRoles->count());
        foreach ($allRoles as $role) {
            $permCount = $role->permissions()->count();
            $this->command->info("  - " . $role->name . " (" . $permCount . " permissions)");
        }
        $this->command->info("Role Seeder completed successfully!");
    }
}

