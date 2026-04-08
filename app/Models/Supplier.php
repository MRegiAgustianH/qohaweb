<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'price_per_liter',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_per_liter' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function rawWaterPurchases(): HasMany
    {
        return $this->hasMany(RawWaterPurchase::class);
    }
}
