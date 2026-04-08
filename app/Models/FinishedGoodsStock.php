<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinishedGoodsStock extends Model
{
    protected $table = 'finished_goods_stock';

    protected $fillable = [
        'product_id',
        'stock_pcs',
    ];

    protected function casts(): array
    {
        return [
            'stock_pcs' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
