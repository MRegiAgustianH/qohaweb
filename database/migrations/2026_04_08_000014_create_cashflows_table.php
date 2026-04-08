<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cashflows', function (Blueprint $table) {
            $table->id();
            $table->string('type', 20); // income, expense
            $table->string('category', 30); // sale, raw_water_purchase, salary, other
            $table->decimal('amount', 15, 2);
            $table->string('description');
            $table->nullableMorphs('reference'); // polymorphic: Order, RawWaterPurchase
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->date('transaction_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cashflows');
    }
};
