<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'notes',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Find or create a customer by WhatsApp phone number.
     */
    public static function findOrCreateByPhone(string $phone, array $attributes = []): self
    {
        return self::firstOrCreate(
            ['phone' => $phone],
            array_merge(['name' => $attributes['name'] ?? 'Pelanggan'], $attributes)
        );
    }
}
