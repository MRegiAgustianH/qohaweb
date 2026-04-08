<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_adjustments', function (Blueprint $table) {
            $table->id();
            $table->string('adjustable_type'); // tank, material, finished_good
            $table->unsignedBigInteger('adjustable_id');
            $table->decimal('old_value', 12, 2);
            $table->decimal('new_value', 12, 2);
            $table->string('unit', 20); // liter, pcs
            $table->string('reason');
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->timestamps();

            $table->index(['adjustable_type', 'adjustable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_adjustments');
    }
};
