<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Cart;
use App\Models\CartProduct;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get the authenticated user's cart
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        $cartProducts = $cart->cartProducts()->with('product')->get();

        return response()->json([
            'cart' => $cart,
            'items' => $cartProducts
        ]);
    }

    /**
     * Add product to cart
     */
    public function add(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        $product = Product::find($request->product_id);

        // Check if product already in cart
        $cartProduct = CartProduct::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartProduct) {
            $cartProduct->quantity += $request->quantity;
            $cartProduct->save();
        } else {
            CartProduct::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Product added to cart']);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartProduct $cartProduct): JsonResponse
    {
        // Ensure the cart product belongs to the authenticated user
        if ($cartProduct->cart->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartProduct->quantity = $request->quantity;
        $cartProduct->save();

        return response()->json(['message' => 'Cart updated']);
    }

    /**
     * Remove item from cart
     */
    public function remove(CartProduct $cartProduct): JsonResponse
    {
        // Ensure the cart product belongs to the authenticated user
        if ($cartProduct->cart->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $cartProduct->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }
}
