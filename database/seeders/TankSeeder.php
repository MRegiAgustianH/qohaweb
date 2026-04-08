<?php

namespace Database\Seeders;

use App\Models\Tank;
use Illuminate\Database\Seeder;

class TankSeeder extends Seeder
{
    public function run(): void
    {
        $tanks = [
            [
                'name' => 'Tangki Utama',
                'slug' => 'utama',
                'capacity_liters' => 10000,
                'current_volume_liters' => 0,
            ],
            [
                'name' => 'Tangki Gelas',
                'slug' => 'gelas',
                'capacity_liters' => 5000,
                'current_volume_liters' => 0,
            ],
            [
                'name' => 'Tangki Botol',
                'slug' => 'botol',
                'capacity_liters' => 5000,
                'current_volume_liters' => 0,
            ],
            [
                'name' => 'Tangki Galon',
                'slug' => 'galon',
                'capacity_liters' => 5000,
                'current_volume_liters' => 0,
            ],
        ];

        foreach ($tanks as $tank) {
            Tank::updateOrCreate(['slug' => $tank['slug']], $tank);
        }
    }
}
