<?php

namespace App\Http\Controllers\CalorieIntake;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\CalorieIntake;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CalorieIntakeController extends Controller
{
    // Fungsi untuk menampilkan halaman calorie intake
    public function calorieIntakePage()
    {
        // Ambil semua aktivitas untuk dropdown
        $activities = Activity::all();
        
        if (Auth::check()) {
            // Ambil riwayat calorie intake user yang login
            $calorieHistory = CalorieIntake::with('activity')
                ->where('user_id', Auth::user()->id)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            return Inertia::render('CalorieIntake/HalamanCalorieIntake', [
                'activities' => $activities,
                'calorieHistory' => $calorieHistory,
                'user' => Auth::user()->only(['username', 'gender', 'birth_date']),
                'calorieResult' => session('calorieResult')
            ]);
        }

        // Untuk user yang tidak login
        return Inertia::render('CalorieIntake/HalamanCalorieIntake', [
            'activities' => $activities,
            'calorieHistory' => [],
            'user' => null,
            'calorieResult' => session('calorieResult')
        ]);
    }

    // Fungsi untuk hitung calorie intake (untuk user yang login)
    public function calculateCalorieIntake(Request $request)
    {
        if (!Auth::check()) {
            return Redirect::route('login')->with('error', 'Silakan login terlebih dahulu untuk menyimpan riwayat kalori Anda.');
        }

        $validatedData = $request->validate([
            'height' => 'required|numeric|min:50|max:300', // dalam cm
            'weight' => 'required|numeric|min:10|max:500', // dalam kg
            'gender' => 'required|string|in:male,female',
            'age' => 'required|integer|min:1|max:150',
            'activity_id' => 'required|exists:activity,id',
        ]);

        // Hitung BMR (Basal Metabolic Rate) menggunakan Harris-Benedict equation
        $bmr = $this->calculateBMR(
            $validatedData['height'],
            $validatedData['weight'],
            $validatedData['gender'],
            $validatedData['age']
        );

        // Ambil data activity untuk mendapatkan multiplier
        $activity = Activity::find($validatedData['activity_id']);
        $activityMultiplier = $this->getActivityMultiplier($activity->name);

        // Hitung total daily calorie needs
        $dailyCalories = $bmr * $activityMultiplier;

        // Buat rekomendasi berdasarkan hasil
        $recommendation = $this->getCalorieRecommendation($dailyCalories, $validatedData['gender'], $validatedData['age']);

        // Simpan ke database dengan hasil perhitungan
        $calorieIntake = CalorieIntake::create([
            'user_id' => Auth::user()->id,
            'activity_id' => $validatedData['activity_id'],
            'height' => $validatedData['height'],
            'weight' => $validatedData['weight'],
            'gender' => $validatedData['gender'],
            'age' => $validatedData['age'],
            'bmr' => round($bmr, 2),
            'daily_calories' => round($dailyCalories, 2),
            'activity_multiplier' => $activityMultiplier,
            'recommendation_maintain' => $recommendation['maintain'],
            'recommendation_lose' => $recommendation['lose'],
            'recommendation_gain' => $recommendation['gain'],
        ]);

        return Redirect::route('calorie-intake.page')
            ->with('success', 'Kebutuhan kalori berhasil dihitung dan disimpan ke riwayat Anda!')
            ->with('calorieResult', [
                'bmr' => round($bmr, 0),
                'dailyCalories' => round($dailyCalories, 0),
                'activity' => $activity->name,
                'recommendation' => $recommendation
            ]);
    }

    // Fungsi untuk hitung calorie intake untuk guest (tanpa login)
    public function calculateGuestCalorieIntake(Request $request)
    {
        $validatedData = $request->validate([
            'height' => 'required|numeric|min:50|max:300', // dalam cm
            'weight' => 'required|numeric|min:10|max:500', // dalam kg
            'gender' => 'required|string|in:male,female',
            'age' => 'required|integer|min:1|max:150',
            'activity_id' => 'required|exists:activity,id',
        ]);

        // Hitung BMR (Basal Metabolic Rate)
        $bmr = $this->calculateBMR(
            $validatedData['height'],
            $validatedData['weight'],
            $validatedData['gender'],
            $validatedData['age']
        );

        // Ambil data activity untuk mendapatkan multiplier
        $activity = Activity::find($validatedData['activity_id']);
        $activityMultiplier = $this->getActivityMultiplier($activity->name);

        // Hitung total daily calorie needs
        $dailyCalories = $bmr * $activityMultiplier;

        // Buat rekomendasi berdasarkan hasil
        $recommendation = $this->getCalorieRecommendation($dailyCalories, $validatedData['gender'], $validatedData['age']);

        // Simpan ke database dengan user_id null untuk guest dan hasil perhitungan
        $calorieIntake = CalorieIntake::create([
            'user_id' => null, // Guest user
            'activity_id' => $validatedData['activity_id'],
            'height' => $validatedData['height'],
            'weight' => $validatedData['weight'],
            'gender' => $validatedData['gender'],
            'age' => $validatedData['age'],
            'bmr' => round($bmr, 2),
            'daily_calories' => round($dailyCalories, 2),
            'activity_multiplier' => $activityMultiplier,
            'recommendation_maintain' => $recommendation['maintain'],
            'recommendation_lose' => $recommendation['lose'],
            'recommendation_gain' => $recommendation['gain'],
        ]);

        return Redirect::route('calorie-intake.page')
            ->with('success', 'Kebutuhan kalori berhasil dihitung dan disimpan!')
            ->with('calorieResult', [
                'bmr' => round($bmr, 0),
                'dailyCalories' => round($dailyCalories, 0),
                'activity' => $activity->name,
                'recommendation' => $recommendation
            ]);
    }

    // Fungsi untuk menghitung BMR (Basal Metabolic Rate) menggunakan Harris-Benedict equation
    private function calculateBMR($height, $weight, $gender, $age)
    {
        if ($gender === 'male') {
            // BMR untuk pria: 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)
            return 88.362 + (13.397 * $weight) + (4.799 * $height) - (5.677 * $age);
        } else {
            // BMR untuk wanita: 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)
            return 447.593 + (9.247 * $weight) + (3.098 * $height) - (4.330 * $age);
        }
    }

    // Fungsi untuk mendapatkan activity multiplier
    private function getActivityMultiplier($activityName)
    {
        switch ($activityName) {
            case 'Sedentary':
                return 1.2;
            case 'Lightly Active':
                return 1.375;
            case 'Moderately Active':
                return 1.55;
            case 'Very Active':
                return 1.725;
            case 'Extremely Active':
                return 1.9;
            default:
                return 1.2; // Default to sedentary
        }
    }

    // Fungsi untuk memberikan rekomendasi berdasarkan kalori harian
    private function getCalorieRecommendation($dailyCalories, $gender, $age)
    {
        $recommendations = [
            'maintain' => "Untuk mempertahankan berat badan saat ini, konsumsi sekitar " . round($dailyCalories) . " kalori per hari.",
            'lose' => "Untuk menurunkan berat badan secara sehat, konsumsi sekitar " . round($dailyCalories - 500) . " kalori per hari (deficit 500 kalori).",
            'gain' => "Untuk menambah berat badan secara sehat, konsumsi sekitar " . round($dailyCalories + 500) . " kalori per hari (surplus 500 kalori)."
        ];

        return $recommendations;
    }

    // Fungsi untuk menampilkan riwayat calorie intake
    public function index()
    {
        $calorieRecords = CalorieIntake::with('activity')
            ->where('user_id', Auth::user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('CalorieIntake/Index', [
            'calorieRecords' => $calorieRecords
        ]);
    }

    // Fungsi untuk menghapus record calorie intake
    public function destroy($id)
    {
        $calorieIntake = CalorieIntake::where('user_id', Auth::user()->id)->findOrFail($id);
        $calorieIntake->delete();

        return Redirect::back()
            ->with('success', 'Record kalori berhasil dihapus dari riwayat Anda.');
    }
}