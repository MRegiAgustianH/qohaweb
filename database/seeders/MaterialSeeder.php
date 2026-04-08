<?php

namespace Database\Seeders;

use App\Models\Material;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    public function run(): void
    {
        $materials = [
            ['name' => 'Gelas Kosong 220ml', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Dus Gelas', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Lid/Seal Gelas', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Botol Kosong 600ml', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Dus Botol', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Tutup Botol', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Tutup Galon', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Segel Galon', 'unit' => 'pcs', 'current_stock' => 0],
            ['name' => 'Tisu Galon', 'unit' => 'pcs', 'current_stock' => 0],
        ];

        foreach ($materials as $material) {
            Material::updateOrCreate(['name' => $material['name']], $material);
        }
    }
}
