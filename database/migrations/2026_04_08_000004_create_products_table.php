<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->string('sell_unit', 20)->default('Pcs'); // Pcs or Dus
            $table->integer('pcs_per_unit')->default(1); // 1 Dus = N Pcs
            $table->decimal('liters_per_pcs', 10, 4)->default(0); // Liters per 1 pcs
            $table->string('tank_type', 20); // gelas, botol, galon
            $table->boolean('is_active')->default(true);
            $table->boolean('show_in_catalog')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
