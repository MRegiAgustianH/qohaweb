<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockAdjustment extends Model
{
    protected $fillable = [
        'adjustable_type',
        'adjustable_id',
        'old_value',
        'new_value',
        'unit',
        'reason',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'old_value' => 'decimal:2',
            'new_value' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the difference (new - old).
     */
    public function getDifferenceAttribute(): float
    {
        return $this->new_value - $this->old_value;
    }
}
