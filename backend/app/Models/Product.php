<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image_url', 'address', 'supplier_id'];

    protected $casts = [
        'price' => 'float',
    ];

    public function cartProducts()
    {
        return $this->hasMany(CartProduct::class);
    }

    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
}
