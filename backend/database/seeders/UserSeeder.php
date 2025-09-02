<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un administrateur
        User::updateOrCreate(
            ['email' => 'admin@artisan.com'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Créer un fournisseur
        User::updateOrCreate(
            ['email' => 'fournisseur@artisan.com'],
            [
                'name' => 'Fournisseur Test',
                'password' => Hash::make('fournisseur123'),
                'role' => 'fournisseur',
            ]
        );

        // Créer un client
        User::updateOrCreate(
            ['email' => 'client@artisan.com'],
            [
                'name' => 'Client Test',
                'password' => Hash::make('client123'),
                'role' => 'client',
            ]
        );
    }
}
