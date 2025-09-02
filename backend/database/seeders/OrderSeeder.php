<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = User::where('email', 'client@artisan.com')->first();
        $supplier = User::where('email', 'fournisseur@artisan.com')->first();
        $products = Product::where('supplier_id', $supplier->id)->get();

        if ($client && $supplier && $products->count() > 0) {
            // Créer des commandes sur les 30 derniers jours
            for ($i = 0; $i < 30; $i++) {
                $date = Carbon::now()->subDays($i);
                // Alterner entre 'en cours' et 'livrée' pour avoir des commandes en cours
                $status = ($i % 3 === 0) ? 'en cours' : 'livrée';

                $order = Order::create([
                    'user_id' => $client->id,
                    'order_date' => $date,
                    'status' => $status,
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);

                $numProducts = rand(1, 3);
                $selectedProducts = $products->random($numProducts);

                foreach ($selectedProducts as $product) {
                    $quantity = rand(1, 5);
                    OrderProduct::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $product->price,
                    ]);
                }
            }
        }
    }
}
