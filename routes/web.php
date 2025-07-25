<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Verfikasi\VerfikasiController;
use App\Http\Controllers\Bmi\BmiController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\CalorieIntake\CalorieIntakeController;
use App\Http\Controllers\DailyTracker\DailyTrackerController;

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
Route::post('/bmi/calculate-guest', [BmiController::class, 'calculateGuestBmi'])->name('bmi.calculate.guest');

// BMI Routes for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::post('/bmi/calculate', [BmiController::class, 'insertBmi'])->name('bmi.calculate');
    Route::get('/bmi/history', [BmiController::class, 'index'])->name('bmi.index');
    Route::delete('/bmi/delete/{id}', [BmiController::class, 'destroy'])->name('bmi.delete');
});

// User Profile Routes (authenticated users only)
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [UserController::class, 'profilePage'])->name('profile.page');
    Route::patch('/profile/update', [UserController::class, 'updateProfile'])->name('profile.update');
    Route::get('/profile/data', [UserController::class, 'getUserData'])->name('profile.data');
});

// No dashboard needed - authenticated users go to home

// Calorie Intake Routes (accessible without login)
Route::get('/calorie-intake', [CalorieIntakeController::class, 'calorieIntakePage'])->name('calorie-intake.page');
Route::post('/calorie-intake/calculate-guest', [CalorieIntakeController::class, 'calculateGuestCalorieIntake'])->name('calorie-intake.calculate.guest');

// Calorie Intake Routes for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::post('/calorie-intake/calculate', [CalorieIntakeController::class, 'calculateCalorieIntake'])->name('calorie-intake.calculate');
    Route::get('/calorie-intake/history', [CalorieIntakeController::class, 'index'])->name('calorie-intake.index');
    Route::delete('/calorie-intake/delete/{id}', [CalorieIntakeController::class, 'destroy'])->name('calorie-intake.delete');
});

// Daily Tracker Routes (accessible to all, but requires auth for functionality)
Route::get('/daily-tracker', [DailyTrackerController::class, 'dailyTrackerPage'])->name('daily-tracker.page');

// Daily Tracker Routes for authenticated users only
Route::middleware(['auth'])->group(function () {
    Route::post('/daily-tracker/add', [DailyTrackerController::class, 'addFoodDrink'])->name('daily-tracker.add');
    Route::post('/daily-tracker/update-targets', [DailyTrackerController::class, 'updateTargets'])->name('daily-tracker.update-targets');
    Route::get('/daily-tracker/delete/{id}', [DailyTrackerController::class, 'deleteItem'])->name('daily-tracker.delete');
    Route::get('/daily-tracker/history', [DailyTrackerController::class, 'historyPage'])->name('daily-tracker.history');
    Route::get('/daily-tracker/history/{date}', [DailyTrackerController::class, 'historyDetail'])->name('daily-tracker.history.detail');
});

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
