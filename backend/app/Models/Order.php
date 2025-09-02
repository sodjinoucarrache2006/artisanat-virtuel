<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'order_date', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }

    /**
     * Calculate the total amount of the order
     */
    public function getTotalAttribute()
    {
        return $this->orderProducts->sum(function ($orderProduct) {
            return $orderProduct->unit_price * $orderProduct->quantity;
        });
    }

    /**
     * Get the formatted total with currency
     */
    public function getFormattedTotalAttribute()
    {
        return number_format($this->total, 2, ',', ' ') . ' €';
    }
}
