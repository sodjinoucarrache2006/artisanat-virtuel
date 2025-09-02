<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Routes publiques pour produits
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/profile/remove-image', [AuthController::class, 'removeProfileImage']);

    // Création du fournisseur (admin uniquement)
    Route::post('/supplier', [AuthController::class, 'createSupplier'])->middleware('isAdmin');

    // Routes produits admin
    Route::middleware('isAdmin')->group(function () {
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::put('/admin/products/{product}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy']);
    });

    // Routes panier
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update/{cartProduct}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{cartProduct}', [CartController::class, 'remove']);

    // Routes commandes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);

    // Routes admin commandes
    Route::middleware('isAdmin')->group(function () {
        Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
        Route::put('/admin/orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

    // Route évolution des ventes fournisseur
    Route::middleware('isSupplier')->group(function () {
        Route::get('/supplier/products', [ProductController::class, 'supplierProducts']);
        Route::post('/supplier/products', [ProductController::class, 'store']);
        Route::put('/supplier/products/{product}', [ProductController::class, 'update']);
        Route::delete('/supplier/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/supplier/sales-evolution', [SalesController::class, 'salesEvolution']);
        Route::get('/supplier/order-stats', [OrderController::class, 'supplierStats']);
        Route::get('/supplier/orders', [OrderController::class, 'supplierOrders']);
        Route::put('/supplier/orders/{order}/status', [OrderController::class, 'supplierUpdateStatus']);
    });
});
