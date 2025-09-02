<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\CartProduct;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Create a new order from the authenticated user's cart
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $cartProducts = $cart->cartProducts()->with('product')->get();

        if ($cartProducts->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $user->id,
                'order_date' => now(),
                'status' => 'en cours',
            ]);

            foreach ($cartProducts as $cartProduct) {
                OrderProduct::create([
                    'order_id' => $order->id,
                    'product_id' => $cartProduct->product_id,
                    'quantity' => $cartProduct->quantity,
                    'unit_price' => $cartProduct->product->price,
                ]);
            }

            // Clear the cart
            $cart->cartProducts()->delete();

            DB::commit();

            return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create order', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the authenticated user's order history
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $orders = $user->orders()->with('orderProducts.product')->get();

        // Add total amounts to each order
        $orders->transform(function ($order) {
            $total = $order->orderProducts->sum(function ($orderProduct) {
                return $orderProduct->unit_price * $orderProduct->quantity;
            });
            $order->total = $total;
            $order->formatted_total = number_format($total, 2, ',', ' ') . ' €';
            return $order;
        });

        return response()->json($orders);
    }

    /**
     * Get all orders (admin only)
     */
    public function adminIndex(): JsonResponse
    {
        $orders = Order::with('orderProducts.product', 'user')->get();

        return response()->json($orders);
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:en cours,livrée',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }

    /**
     * Get supplier order statistics
     */
    public function supplierStats(): JsonResponse
    {
        $user = Auth::user();

        // Count orders containing products from this supplier
        $pendingOrders = Order::whereHas('orderProducts.product', function ($query) use ($user) {
            $query->where('supplier_id', $user->id);
        })->where('status', 'en cours')->count();

        $deliveredOrders = Order::whereHas('orderProducts.product', function ($query) use ($user) {
            $query->where('supplier_id', $user->id);
        })->where('status', 'livrée')->count();

        return response()->json([
            'pending_orders' => $pendingOrders,
            'delivered_orders' => $deliveredOrders,
        ]);
    }

    /**
     * Get orders containing supplier's products
     */
    public function supplierOrders(): JsonResponse
    {
        $user = Auth::user();

        $orders = Order::whereHas('orderProducts.product', function ($query) use ($user) {
            $query->where('supplier_id', $user->id);
        })->with('orderProducts.product', 'user')->get();

        // Eager load user relation for each order to ensure client name is included
        $orders->load('user');

        // Add total amounts to each order
        $orders->transform(function ($order) {
            $total = $order->orderProducts->sum(function ($orderProduct) {
                return $orderProduct->unit_price * $orderProduct->quantity;
            });
            $order->total = $total;
            $order->formatted_total = number_format($total, 2, ',', ' ') . ' €';
            return $order;
        });

        return response()->json($orders);
    }

    /**
     * Update order status by supplier (only for orders containing their products)
     */
    public function supplierUpdateStatus(Request $request, Order $order): JsonResponse
    {
        $user = Auth::user();

        // Check if the order contains products from this supplier
        $hasSupplierProducts = $order->orderProducts()->whereHas('product', function ($query) use ($user) {
            $query->where('supplier_id', $user->id);
        })->exists();

        if (!$hasSupplierProducts) {
            return response()->json(['error' => 'Vous ne pouvez pas modifier cette commande'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:en cours,livrée',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Statut de la commande mis à jour', 'order' => $order]);
    }

    /**
     * Delete an order (only if it's in 'en cours' status and belongs to the authenticated user)
     */
    public function destroy(Order $order): JsonResponse
    {
        $user = Auth::user();

        // Check if the order belongs to the authenticated user
        if ($order->user_id !== $user->id) {
            return response()->json(['error' => 'Vous ne pouvez pas supprimer cette commande'], 403);
        }

        // Only allow deletion of orders in 'livrée' status
        if ($order->status !== 'livrée') {
            return response()->json(['error' => 'Vous ne pouvez supprimer que les commandes livrées'], 403);
        }

        // Delete associated order products first
        $order->orderProducts()->delete();

        // Delete the order
        $order->delete();

        return response()->json(['message' => 'Commande supprimée avec succès']);
    }
}
