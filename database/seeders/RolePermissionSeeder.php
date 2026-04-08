<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions grouped by module
        $permissions = [
            // Master Data
            'master_data.suppliers.view',
            'master_data.suppliers.manage',
            'master_data.customers.view',
            'master_data.customers.manage',
            'master_data.products.view',
            'master_data.products.manage',
            'master_data.materials.view',
            'master_data.materials.manage',

            // Inventory
            'inventory.tanks.view',
            'inventory.stock.view',
            'inventory.stock_adjustment.manage',

            // Manufacturing
            'manufacturing.purchase.view',
            'manufacturing.purchase.manage',
            'manufacturing.filtration.view',
            'manufacturing.filtration.manage',
            'manufacturing.production.view',
            'manufacturing.production.manage',

            // Sales
            'sales.orders.view',
            'sales.orders.manage',
            'sales.pos.access',

            // Finance
            'finance.cashflow.view',
            'finance.cashflow.manage',
            'finance.reports.view',
            'finance.reports.export',

            // Admin
            'admin.users.view',
            'admin.users.manage',
            'admin.roles.manage',
            'admin.settings.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $staffRole = Role::firstOrCreate(['name' => 'staff']);

        // Admin gets all permissions
        $adminRole->syncPermissions(Permission::all());

        // Staff gets limited permissions (view + basic operations)
        $staffRole->syncPermissions([
            'master_data.suppliers.view',
            'master_data.customers.view',
            'master_data.products.view',
            'master_data.materials.view',
            'inventory.tanks.view',
            'inventory.stock.view',
            'manufacturing.purchase.view',
            'manufacturing.filtration.view',
            'manufacturing.filtration.manage',
            'manufacturing.production.view',
            'manufacturing.production.manage',
            'sales.orders.view',
            'sales.orders.manage',
            'sales.pos.access',
            'finance.cashflow.view',
        ]);
    }
}
