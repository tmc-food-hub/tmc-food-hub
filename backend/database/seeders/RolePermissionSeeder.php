<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create Roles
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Admin',
                'description' => 'Unrestricted access to all modules, financial settings, and API integrations. Primary account owner role.',
                'badge' => 'Unlimited Power',
                'badge_class' => 'badgeRed',
                'icon' => '🎯',
            ],
            [
                'name' => 'admin',
                'display_name' => 'Admin',
                'description' => 'Full operational control over orders, merchants, and users. Cannot modify global system billing logic.',
                'badge' => 'Operational Lead',
                'badge_class' => 'badgeGray',
                'icon' => '👤',
            ],
            [
                'name' => 'moderator',
                'display_name' => 'Moderator',
                'description' => 'Focused on order support and merchant menu management. Limited access to financial data.',
                'badge' => 'Support Level',
                'badge_class' => 'badgeGray',
                'icon' => '🛡',
            ],
            [
                'name' => 'analyst',
                'display_name' => 'Analyst',
                'description' => 'Read-only access to dashboards and transaction logs. Can export data but cannot modify records.',
                'badge' => 'Data Only',
                'badge_class' => 'badgeGray',
                'icon' => '📊',
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['name' => $role['name']],
                array_merge($role, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        // Create Permissions
        $permissions = [
            // Platform Management
            ['name' => 'edit_system_config', 'display_name' => 'System Configuration', 'description' => 'Edit core platform settings & integrations', 'category' => 'Platform Management'],
            ['name' => 'manage_roles', 'display_name' => 'User Role Management', 'description' => 'Manage user roles and permissions', 'category' => 'Platform Management'],
            
            // Order Operations
            ['name' => 'cancel_refund_orders', 'display_name' => 'Cancel & Refund Orders', 'description' => 'Ability to override active orders and issue credits', 'category' => 'Order Operations'],
            ['name' => 'view_transactions', 'display_name' => 'View Transaction Data', 'description' => 'Access to detailed payment and fee breakdown', 'category' => 'Order Operations'],
            
            // Marketing & Growth
            ['name' => 'create_promotions', 'display_name' => 'Create Promotions', 'description' => 'Manage coupon codes and delivery fee waivers', 'category' => 'Marketing & Growth'],
        ];

        foreach ($permissions as $perm) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $perm['name']],
                array_merge($perm, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        // Assign permissions to roles
        $rolePermissions = [
            'super_admin' => ['edit_system_config', 'manage_roles', 'cancel_refund_orders', 'view_transactions', 'create_promotions'],
            'admin' => ['edit_system_config', 'manage_roles', 'cancel_refund_orders', 'view_transactions', 'create_promotions'],
            'moderator' => ['cancel_refund_orders', 'view_transactions'],
            'analyst' => ['view_transactions'],
        ];

        foreach ($rolePermissions as $roleName => $permissionNames) {
            $role = DB::table('roles')->where('name', $roleName)->first();
            if ($role) {
                foreach ($permissionNames as $permName) {
                    $perm = DB::table('permissions')->where('name', $permName)->first();
                    if ($perm) {
                        DB::table('role_permissions')->updateOrInsert(
                            ['role_id' => $role->id, 'permission_id' => $perm->id],
                            [
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]
                        );
                    }
                }
            }
        }
    }
}
