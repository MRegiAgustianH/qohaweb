<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Cashflow extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'category',
        'amount',
        'description',
        'reference_id',
        'reference_type',
        'user_id',
        'transaction_date',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transaction_date' => 'date',
        ];
    }

    public const TYPE_INCOME = 'income';
    public const TYPE_EXPENSE = 'expense';

    public const CATEGORY_SALE = 'sale';
    public const CATEGORY_RAW_WATER_PURCHASE = 'raw_water_purchase';
    public const CATEGORY_SALARY = 'salary';
    public const CATEGORY_OTHER = 'other';

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get category label for display.
     */
    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            self::CATEGORY_SALE => 'Penjualan',
            self::CATEGORY_RAW_WATER_PURCHASE => 'Pembelian Air',
            self::CATEGORY_SALARY => 'Gaji Karyawan',
            self::CATEGORY_OTHER => 'Lainnya',
            default => $this->category,
        };
    }
}
