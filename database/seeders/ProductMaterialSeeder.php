<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductMaterialSeeder extends Seeder
{
    public function run(): void
    {
        // Galon 19L: Tutup Galon (1), Segel Galon (1), Tisu Galon (1)
        $galon = Product::where('slug', 'galon-19l')->first();
        if ($galon) {
            $tutupGalon = Material::where('name', 'Tutup Galon')->first();
            $segelGalon = Material::where('name', 'Segel Galon')->first();
            $tisuGalon = Material::where('name', 'Tisu Galon')->first();

            if ($tutupGalon) $galon->materials()->syncWithoutDetaching([$tutupGalon->id => ['qty_needed' => 1]]);
            if ($segelGalon) $galon->materials()->syncWithoutDetaching([$segelGalon->id => ['qty_needed' => 1]]);
            if ($tisuGalon) $galon->materials()->syncWithoutDetaching([$tisuGalon->id => ['qty_needed' => 1]]);
        }

        // Dus Gelas 220ml: Gelas Kosong (48 per dus = 1 per pcs), Lid/Seal (1 per pcs), Dus Gelas (1 per 48 pcs = handled at order level)
        $gelas = Product::where('slug', 'dus-gelas-220ml')->first();
        if ($gelas) {
            $gelasKosong = Material::where('name', 'Gelas Kosong 220ml')->first();
            $lidGelas = Material::where('name', 'Lid/Seal Gelas')->first();
            $dusGelas = Material::where('name', 'Dus Gelas')->first();

            // Materials are per 1 pcs (1 gelas)
            if ($gelasKosong) $gelas->materials()->syncWithoutDetaching([$gelasKosong->id => ['qty_needed' => 1]]);
            if ($lidGelas) $gelas->materials()->syncWithoutDetaching([$lidGelas->id => ['qty_needed' => 1]]);
            // 1 dus per 48 pcs - this is special, but we track at pcs level
            // Dus consumption is handled separately in production logic
        }

        // Dus Botol 600ml: Botol Kosong (1 per pcs), Tutup Botol (1 per pcs), Dus Botol (1 per 24 pcs)
        $botol = Product::where('slug', 'dus-botol-600ml')->first();
        if ($botol) {
            $botolKosong = Material::where('name', 'Botol Kosong 600ml')->first();
            $tutupBotol = Material::where('name', 'Tutup Botol')->first();
            $dusBotol = Material::where('name', 'Dus Botol')->first();

            if ($botolKosong) $botol->materials()->syncWithoutDetaching([$botolKosong->id => ['qty_needed' => 1]]);
            if ($tutupBotol) $botol->materials()->syncWithoutDetaching([$tutupBotol->id => ['qty_needed' => 1]]);
        }
    }
}
