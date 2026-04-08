<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image_path',
        'price',
        'sell_unit',
        'pcs_per_unit',
        'liters_per_pcs',
        'tank_type',
        'is_active',
        'show_in_catalog',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'liters_per_pcs' => 'decimal:4',
            'pcs_per_unit' => 'integer',
            'is_active' => 'boolean',
            'show_in_catalog' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'product_materials')
            ->withPivot('qty_needed')
            ->withTimestamps();
    }

    public function finishedGoodsStock(): HasOne
    {
        return $this->hasOne(FinishedGoodsStock::class);
    }

    public function productions(): HasMany
    {
        return $this->hasMany(Production::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the corresponding tank for this product.
     */
    public function tank(): ?Tank
    {
        return Tank::where('slug', $this->tank_type)->first();
    }

    /**
     * Get current stock in pcs.
     */
    public function getStockPcsAttribute(): int
    {
        return $this->finishedGoodsStock?->stock_pcs ?? 0;
    }
}
