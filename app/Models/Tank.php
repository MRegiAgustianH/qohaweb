<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tank extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'capacity_liters',
        'current_volume_liters',
    ];

    protected function casts(): array
    {
        return [
            'capacity_liters' => 'decimal:2',
            'current_volume_liters' => 'decimal:2',
        ];
    }

    public function filtrationsAsSource(): HasMany
    {
        return $this->hasMany(Filtration::class, 'source_tank_id');
    }

    public function filtrationsAsDestination(): HasMany
    {
        return $this->hasMany(Filtration::class, 'destination_tank_id');
    }

    public function productions(): HasMany
    {
        return $this->hasMany(Production::class);
    }

    /**
     * Get fill percentage.
     */
    public function getFillPercentageAttribute(): float
    {
        if ($this->capacity_liters <= 0) {
            return 0;
        }

        return round(($this->current_volume_liters / $this->capacity_liters) * 100, 1);
    }

    /**
     * Check if tank is the main tank.
     */
    public function isMainTank(): bool
    {
        return $this->slug === 'utama';
    }
}
