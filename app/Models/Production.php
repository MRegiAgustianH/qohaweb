<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Production extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'tank_id',
        'qty_produced_pcs',
        'qty_reject_pcs',
        'liters_used',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'qty_produced_pcs' => 'integer',
            'qty_reject_pcs' => 'integer',
            'liters_used' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function tank(): BelongsTo
    {
        return $this->belongsTo(Tank::class);
    }

    /**
     * Total pcs consumed (produced + reject).
     */
    public function getTotalPcsConsumedAttribute(): int
    {
        return $this->qty_produced_pcs + $this->qty_reject_pcs;
    }
}
