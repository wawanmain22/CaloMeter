<?php

namespace App\Http\Controllers\DailyTracker;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\DailyTracker;
use App\Models\DailyTrackerDetail;
use App\Models\CalorieIntake;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Carbon\Carbon;

class DailyTrackerController extends Controller
{
    // Fungsi untuk menampilkan halaman daily tracker (hanya untuk user yang login)
    public function dailyTrackerPage(Request $request)
    {
        if (!Auth::check()) {
            return Inertia::render('DailyTracker/HalamanDailyTracker', [
                'requiresAuth' => true
            ]);
        }

        $user = Auth::user();
        $selectedDate = $request->get('date', Carbon::today()->format('Y-m-d'));
        
        // Ambil atau buat daily tracker untuk tanggal yang dipilih
        $dailyTracker = DailyTracker::firstOrCreate([
            'user_id' => $user->id,
            'date' => $selectedDate,
        ], [
            // Default values berdasarkan latest calorie intake user
            'calorie_target' => $this->getDefaultCalorieTarget($user->id),
            'water_target' => 2000, // Default 2L per day
            'total_calorie_intake' => 0,
            'total_water_intake' => 0,
            'calorie_progress_percentage' => 0,
            'water_progress_percentage' => 0,
            'goal_type' => 'maintain_weight',
        ]);

        // Ambil detail makanan dan minuman untuk hari ini
        $dailyDetails = DailyTrackerDetail::where('tracker_id', $dailyTracker->id)
            ->orderBy('consumed_at')
            ->get();

        // Ambil riwayat 7 hari terakhir
        $weeklyHistory = DailyTracker::where('user_id', $user->id)
            ->where('date', '>=', Carbon::parse($selectedDate)->subDays(6))
            ->where('date', '<=', $selectedDate)
            ->orderBy('date', 'desc')
            ->get();

        // Get smart suggestions from latest calorie intake
        $smartSuggestions = $this->getSmartSuggestions($user->id, $dailyTracker);

        return Inertia::render('DailyTracker/HalamanDailyTracker', [
            'requiresAuth' => false,
            'dailyTracker' => $dailyTracker,
            'dailyDetails' => $dailyDetails,
            'weeklyHistory' => $weeklyHistory,
            'selectedDate' => $selectedDate,
            'user' => $user->only(['username', 'gender']),
            'smartSuggestions' => $smartSuggestions
        ]);
    }

    // Fungsi untuk menambah makanan/minuman
    public function addFoodDrink(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validatedData = $request->validate([
            'date' => 'required|date',
            'food_type' => 'required|string|in:food,drink',
            'name' => 'required|string|max:255',
            'consumed_at' => 'required|date_format:H:i',
            'amount' => 'required|integer|min:1',
            'unit' => 'required|string|max:20',
            'calories' => 'nullable|integer|min:0',
            'water_intake' => 'nullable|integer|min:0',
        ]);

        $user = Auth::user();

        // Ambil atau buat daily tracker
        $dailyTracker = DailyTracker::firstOrCreate([
            'user_id' => $user->id,
            'date' => $validatedData['date'],
        ], [
            'calorie_target' => $this->getDefaultCalorieTarget($user->id),
            'water_target' => 2000,
            'total_calorie_intake' => 0,
            'total_water_intake' => 0,
            'calorie_progress_percentage' => 0,
            'water_progress_percentage' => 0,
            'goal_type' => 'maintain_weight',
        ]);

        // Tambah detail makanan/minuman
        $detail = DailyTrackerDetail::create([
            'tracker_id' => $dailyTracker->id,
            'food_type' => $validatedData['food_type'],
            'name' => $validatedData['name'],
            'consumed_at' => $validatedData['consumed_at'],
            'amount' => $validatedData['amount'],
            'unit' => $validatedData['unit'],
            'calories' => $validatedData['calories'] ?? 0,
            'water_intake' => $validatedData['water_intake'] ?? 0,
        ]);

        // Update total di daily tracker
        $this->updateDailyTrackerTotals($dailyTracker);

        return Redirect::route('daily-tracker.page', ['date' => $validatedData['date']])
            ->with('success', ucfirst($validatedData['food_type']) . ' berhasil ditambahkan!');
    }

    // Fungsi untuk update target harian
    public function updateTargets(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validatedData = $request->validate([
            'date' => 'required|date',
            'calorie_target' => 'required|integer|min:500|max:5000',
            'water_target' => 'required|integer|min:500|max:10000',
            'goal_type' => 'required|string|in:lose_weight,gain_weight,maintain_weight',
        ]);

        $user = Auth::user();

        // Update daily tracker
        $dailyTracker = DailyTracker::where('user_id', $user->id)
            ->where('date', $validatedData['date'])
            ->first();

        if ($dailyTracker) {
            $dailyTracker->update([
                'calorie_target' => $validatedData['calorie_target'],
                'water_target' => $validatedData['water_target'],
                'goal_type' => $validatedData['goal_type'],
            ]);

            // Recalculate percentages
            $this->updateDailyTrackerTotals($dailyTracker);
        }

        return Redirect::route('daily-tracker.page', ['date' => $validatedData['date']])
            ->with('success', 'Target harian berhasil diperbarui!');
    }

    // Fungsi untuk menghapus item makanan/minuman
    public function deleteItem($id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $detail = DailyTrackerDetail::find($id);
        
        if (!$detail) {
            return Redirect::back()->with('error', 'Item tidak ditemukan.');
        }

        // Pastikan item ini milik user yang sedang login
        $dailyTracker = $detail->dailyTracker;
        if ($dailyTracker->user_id !== Auth::user()->id) {
            return Redirect::back()->with('error', 'Unauthorized.');
        }

        $date = $dailyTracker->date;
        $detail->delete();

        // Update total di daily tracker
        $this->updateDailyTrackerTotals($dailyTracker);

        return Redirect::route('daily-tracker.page', ['date' => $date])
            ->with('success', 'Item berhasil dihapus!');
    }

    // Fungsi helper untuk update total kalori dan air
    private function updateDailyTrackerTotals(DailyTracker $dailyTracker)
    {
        $details = $dailyTracker->details;
        
        $totalCalories = $details->sum('calories');
        $totalWater = $details->sum('water_intake');
        
        $caloriePercentage = $dailyTracker->calorie_target > 0 
            ? ($totalCalories / $dailyTracker->calorie_target) * 100 
            : 0;
            
        $waterPercentage = $dailyTracker->water_target > 0 
            ? ($totalWater / $dailyTracker->water_target) * 100 
            : 0;

        $dailyTracker->update([
            'total_calorie_intake' => $totalCalories,
            'total_water_intake' => $totalWater,
            'calorie_progress_percentage' => round($caloriePercentage, 2),
            'water_progress_percentage' => round($waterPercentage, 2),
        ]);
    }

    // Fungsi untuk menampilkan history daily tracker
    public function historyPage()
    {
        if (!Auth::check()) {
            return Redirect::route('login');
        }

        $user = Auth::user();
        
        // Ambil 30 hari terakhir dengan data lengkap
        $trackers = DailyTracker::where('user_id', $user->id)
            ->withCount('details')
            ->orderBy('date', 'desc')
            ->take(30)
            ->get()
            ->map(function ($tracker) {
                $tracker->details_count = $tracker->details_count;
                return $tracker;
            });

        return Inertia::render('DailyTracker/HalamanHistory', [
            'trackers' => $trackers
        ]);
    }

    // Fungsi untuk menampilkan detail history berdasarkan tanggal
    public function historyDetail($date)
    {
        if (!Auth::check()) {
            return Redirect::route('login');
        }

        $user = Auth::user();
        
        // Ambil tracker untuk tanggal spesifik
        $tracker = DailyTracker::where('user_id', $user->id)
            ->where('date', $date)
            ->first();

        if (!$tracker) {
            return Redirect::route('daily-tracker.history')
                ->with('error', 'Data tracking untuk tanggal tersebut tidak ditemukan.');
        }

        // Ambil detail makanan dan minuman
        $details = DailyTrackerDetail::where('tracker_id', $tracker->id)
            ->orderBy('consumed_at')
            ->get();

        // Ambil 30 hari terakhir untuk context
        $trackers = DailyTracker::where('user_id', $user->id)
            ->withCount('details')
            ->orderBy('date', 'desc')
            ->take(30)
            ->get();

        return Inertia::render('DailyTracker/HalamanHistory', [
            'trackers' => $trackers,
            'selectedTracker' => $tracker,
            'selectedDetails' => $details,
            'selectedDate' => $date
        ]);
    }

    // Fungsi helper untuk mendapatkan default calorie target dari latest calorie intake
    private function getDefaultCalorieTarget($userId)
    {
        $latestCalorieIntake = CalorieIntake::where('user_id', $userId)
            ->latest()
            ->first();

        if ($latestCalorieIntake) {
            return (int) $latestCalorieIntake->daily_calories;
        }

        return 2000; // Default fallback
    }

    // Fungsi untuk mendapatkan smart suggestions berdasarkan CalorieIntake
    private function getSmartSuggestions($userId, $dailyTracker)
    {
        $latestCalorieIntake = CalorieIntake::where('user_id', $userId)
            ->latest()
            ->first();

        if (!$latestCalorieIntake) {
            return null;
        }

        // Check if targets are still default (belum disesuaikan)
        $isUsingDefaults = (
            $dailyTracker->calorie_target == 2000 && 
            $dailyTracker->water_target == 2000 &&
            $dailyTracker->goal_type == 'maintain_weight'
        );

        if (!$isUsingDefaults) {
            return null; // User sudah customize, tidak perlu suggestion
        }

        // Calculate recommended targets based on CalorieIntake data
        $recommendedCalorie = (int) $latestCalorieIntake->daily_calories;
        $recommendedWater = 2000; // Base water intake
        $recommendedGoal = 'maintain_weight';

        // Adjust based on activity multiplier
        if ($latestCalorieIntake->activity_multiplier <= 1.2) {
            $recommendedWater = 2000;
        } elseif ($latestCalorieIntake->activity_multiplier <= 1.55) {
            $recommendedWater = 2500;
        } else {
            $recommendedWater = 3000;
        }

        // Determine goal based on BMR vs daily calories
        $bmr = $latestCalorieIntake->bmr;
        if ($recommendedCalorie < $bmr) {
            $recommendedGoal = 'lose_weight';
        } elseif ($recommendedCalorie > ($bmr * 1.1)) {
            $recommendedGoal = 'gain_weight';
        }

        return [
            'calorie_target' => $recommendedCalorie,
            'water_target' => $recommendedWater,
            'goal_type' => $recommendedGoal,
            'activity_level' => $this->getActivityLevelName($latestCalorieIntake->activity_multiplier),
            'calculation_date' => $latestCalorieIntake->created_at->format('d M Y')
        ];
    }

    // Helper untuk nama activity level
    private function getActivityLevelName($multiplier)
    {
        if ($multiplier <= 1.2) return 'Tidak Aktif';
        if ($multiplier <= 1.375) return 'Sedikit Aktif';
        if ($multiplier <= 1.55) return 'Cukup Aktif';
        if ($multiplier <= 1.725) return 'Sangat Aktif';
        return 'Ekstrem Aktif';
    }
}