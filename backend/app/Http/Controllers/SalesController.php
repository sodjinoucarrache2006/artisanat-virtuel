<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\OrderProduct;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    /**
     * Get sales evolution data for the authenticated supplier.
     * Returns sales count grouped by date for the supplier's products.
     */
    public function salesEvolution(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Validate period parameter (day, week, month)
        $period = $request->query('period', 'day');
        if (!in_array($period, ['day', 'week', 'month'])) {
            $period = 'day';
        }

        // Optional address filter
        $address = $request->query('address');

        // Query sales data grouped by period
        $query = OrderProduct::select(
            DB::raw("DATE_FORMAT(order_products.created_at, '" . $this->getDateFormat($period) . "') as period"),
            DB::raw('SUM(order_products.quantity * order_products.unit_price) as total_sales')
        )
        ->join('products', 'order_products.product_id', '=', 'products.id')
        ->where('products.supplier_id', $user->id);

        if ($address) {
            $query->where('products.address', $address);
        }

        $query->groupBy('period')
              ->orderBy('period');

        $salesData = $query->get();

        return response()->json($salesData);
    }

    private function getDateFormat(string $period): string
    {
        switch ($period) {
            case 'week':
                return '%x-%v'; // Year-Week number
            case 'month':
                return '%Y-%m'; // Year-Month
            case 'day':
            default:
                return '%Y-%m-%d'; // Year-Month-Day
        }
    }
}
