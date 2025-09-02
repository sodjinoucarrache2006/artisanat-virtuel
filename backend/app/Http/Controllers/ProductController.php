<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $products = Product::all();
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'address' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // If supplier_id is not provided, set it to the authenticated user if available
        if (!isset($data['supplier_id']) && $request->user()) {
            $data['supplier_id'] = $request->user()->id;
        }

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        // Check if the authenticated user is the supplier of this product
        if ($request->user()->id !== $product->supplier_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|url',
            'address' => 'sometimes|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update($request->all());
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product): JsonResponse
    {
        // Check if the authenticated user is the supplier of this product
        if ($request->user()->id !== $product->supplier_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Get products for the authenticated supplier.
     */
    public function supplierProducts(): JsonResponse
    {
        $user = auth()->user();
        $products = Product::where('supplier_id', $user->id)->get();
        return response()->json($products);
    }
}
