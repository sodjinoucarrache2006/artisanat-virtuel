<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Trouver l'utilisateur fournisseur
        $supplier = \App\Models\User::where('email', 'fournisseur@artisan.com')->first();

        if ($supplier) {
            $products = [
                [
                    'name' => 'Vase en céramique artisanale',
                    'description' => 'Vase unique fait main avec des motifs traditionnels.',
                    'price' => 45.00,
                    'image_url' => 'https://via.placeholder.com/300x300?text=Vase+Ceramique',
                    'supplier_id' => $supplier->id,
                    'address' => '123 Rue de l\'Artisan, Paris',
                ],
                [
                    'name' => 'Sac en cuir cousu main',
                    'description' => 'Sac élégant en cuir véritable, parfait pour tous les jours.',
                    'price' => 120.00,
                    'image_url' => 'https://via.placeholder.com/300x300?text=Sac+Cuir',
                    'supplier_id' => $supplier->id,
                    'address' => '456 Avenue des Créateurs, Lyon',
                ],
                [
                    'name' => 'Bijoux en argent',
                    'description' => 'Collier et boucles d\'oreilles en argent sterling.',
                    'price' => 85.00,
                    'image_url' => 'https://via.placeholder.com/300x300?text=Bijoux+Argent',
                    'supplier_id' => $supplier->id,
                    'address' => '789 Boulevard des Métiers, Marseille',
                ],
                [
                    'name' => 'Tapis tissé à la main',
                    'description' => 'Tapis traditionnel avec des motifs complexes.',
                    'price' => 200.00,
                    'image_url' => 'https://via.placeholder.com/300x300?text=Tapis+Tisse',
                    'supplier_id' => $supplier->id,
                    'address' => '101 Place de l\'Art, Toulouse',
                ],
                [
                    'name' => 'Pot en terre cuite',
                    'description' => 'Pot décoratif pour plantes, fait en terre cuite locale.',
                    'price' => 35.00,
                    'image_url' => 'https://via.placeholder.com/300x300?text=Pot+Terre',
                    'supplier_id' => $supplier->id,
                    'address' => '202 Rue des Potiers, Nice',
                ],
            ];

            foreach ($products as $product) {
                Product::create($product);
            }
        }
    }
}
