<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Verfikasi\VerfikasiController;
use App\Http\Controllers\Bmi\BmiController;

// Home Route
Route::get('/', [VerfikasiController::class, 'homePage'])->name('home');

// Authentication Routes
Route::get('/login', [VerfikasiController::class, 'loginPage'])->name('login');
Route::post('/login', [VerfikasiController::class, 'login']);
Route::get('/register', [VerfikasiController::class, 'registerPage'])->name('register');
Route::post('/register', [VerfikasiController::class, 'register']);
Route::post('/logout', [VerfikasiController::class, 'logout'])->name('logout');

// BMI Routes (accessible without login)
Route::get('/bmi', [BmiController::class, 'bmiPage'])->name('bmi.page');

// BMI Routes for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::post('/bmi/calculate', [BmiController::class, 'insertBmi'])->name('bmi.calculate');
    Route::get('/bmi/history', [BmiController::class, 'index'])->name('bmi.index');
    Route::delete('/bmi/delete/{id}', [BmiController::class, 'destroy'])->name('bmi.delete');
});

// Dashboard for authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Placeholder routes for future features
Route::get('/calorie-intake', function () {
    return Inertia::render('halamanHome'); // Temporary redirect to home
})->name('calorie-intake');

Route::get('/daily-tracker', function () {
    return Inertia::render('halamanHome'); // Temporary redirect to home
})->name('daily-tracker');

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
