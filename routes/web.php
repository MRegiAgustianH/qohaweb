<?php

use App\Http\Controllers\CashflowController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FiltrationController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\RawWaterPurchaseController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth Required)
|--------------------------------------------------------------------------
*/

// Landing page / Catalog
Route::get('/', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/checkout', [CatalogController::class, 'checkout'])->name('catalog.checkout');
Route::post('/checkout', [CatalogController::class, 'processCheckout'])->name('catalog.processCheckout');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Admin/Staff Dashboard)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ---- Master Data ----
    Route::resource('suppliers', SupplierController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('customers', CustomerController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::resource('products', ProductController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('materials', MaterialController::class)->only(['index', 'store', 'update', 'destroy']);

    // ---- Inventory ----
    Route::prefix('inventory')->name('inventory.')->group(function () {
        Route::get('/tanks', [InventoryController::class, 'tanks'])->name('tanks');
        Route::put('/tanks/{tank}', [InventoryController::class, 'updateTank'])->name('tanks.update');
        Route::get('/materials', [InventoryController::class, 'materials'])->name('materials');
        Route::get('/finished-goods', [InventoryController::class, 'finishedGoods'])->name('finished-goods');
        Route::get('/stock-adjustment', [InventoryController::class, 'stockAdjustment'])->name('stock-adjustment');
        Route::post('/stock-adjustment', [InventoryController::class, 'storeAdjustment'])->name('stock-adjustment.store');
    });

    // ---- Manufacturing ----
    Route::prefix('manufacturing')->name('manufacturing.')->group(function () {
        Route::get('/purchase', [RawWaterPurchaseController::class, 'index'])->name('purchase');
        Route::post('/purchase', [RawWaterPurchaseController::class, 'store'])->name('purchase.store');
        Route::get('/filtration', [FiltrationController::class, 'index'])->name('filtration');
        Route::post('/filtration', [FiltrationController::class, 'store'])->name('filtration.store');
        Route::get('/packaging', [ProductionController::class, 'index'])->name('packaging');
        Route::post('/packaging', [ProductionController::class, 'store'])->name('packaging.store');
    });

    // ---- Orders & POS ----
    Route::resource('orders', OrderController::class)->only(['index', 'show']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos', [PosController::class, 'store'])->name('pos.store');

    // ---- Cashflow ----
    Route::get('/cashflow', [CashflowController::class, 'index'])->name('cashflow.index');
    Route::post('/cashflow', [CashflowController::class, 'store'])->name('cashflow.store');

    // ---- User Management (Admin Only) ----
    Route::middleware('can:admin.users.manage')->group(function () {
        Route::resource('users', UserManagementController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('/roles', [UserManagementController::class, 'roles'])->name('roles.index');
        Route::put('/roles/{role}', [UserManagementController::class, 'updateRole'])->name('roles.update');
    });
});

require __DIR__.'/settings.php';
