<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Filtration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'source_tank_id',
        'destination_tank_id',
        'liters_transferred',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'liters_transferred' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sourceTank(): BelongsTo
    {
        return $this->belongsTo(Tank::class, 'source_tank_id');
    }

    public function destinationTank(): BelongsTo
    {
        return $this->belongsTo(Tank::class, 'destination_tank_id');
    }
}
