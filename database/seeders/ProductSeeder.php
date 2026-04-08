<?php

namespace Database\Seeders;

use App\Models\FinishedGoodsStock;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Galon 19L',
                'slug' => 'galon-19l',
                'description' => 'Air mineral dalam kemasan galon 19 Liter. Cocok untuk kebutuhan rumah tangga dan kantor.',
                'price' => 8000,
                'sell_unit' => 'Pcs',
                'pcs_per_unit' => 1,
                'liters_per_pcs' => 19.0000,
                'tank_type' => 'galon',
                'is_active' => true,
                'show_in_catalog' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Dus Gelas 220ml',
                'slug' => 'dus-gelas-220ml',
                'description' => 'Air mineral dalam kemasan gelas plastik 220ml. 1 Dus berisi 48 gelas.',
                'price' => 20000,
                'sell_unit' => 'Dus',
                'pcs_per_unit' => 48,
                'liters_per_pcs' => 0.2200,
                'tank_type' => 'gelas',
                'is_active' => true,
                'show_in_catalog' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Dus Botol 600ml',
                'slug' => 'dus-botol-600ml',
                'description' => 'Air mineral dalam kemasan botol 600ml. 1 Dus berisi 24 botol.',
                'price' => 36000,
                'sell_unit' => 'Dus',
                'pcs_per_unit' => 24,
                'liters_per_pcs' => 0.6000,
                'tank_type' => 'botol',
                'is_active' => true,
                'show_in_catalog' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::updateOrCreate(
                ['slug' => $productData['slug']],
                $productData
            );

            // Create finished goods stock if not exists
            FinishedGoodsStock::firstOrCreate(
                ['product_id' => $product->id],
                ['stock_pcs' => 0]
            );
        }
    }
}
