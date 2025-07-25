<?php

namespace App\Http\Controllers\Bmi;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\BMI;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BmiController extends Controller
{
    // Fungsi untuk insert data bmi (hanya untuk user yang login)
    public function insertBmi(Request $request)
    {
        if (!Auth::check()) {
            return Redirect::route('login')->with('error', 'Silakan login terlebih dahulu untuk menyimpan riwayat BMI Anda.');
        }
        $validatedData = $request->validate([
            'height' => 'required|numeric|min:50|max:300', // dalam cm
            'weight' => 'required|numeric|min:10|max:500', // dalam kg
            'gender' => 'required|string|in:male,female',
            'age' => 'required|integer|min:1|max:150',
        ]);

        // Hitung BMI
        $bmiValue = $this->calculateBmi(
            $validatedData['height'],
            $validatedData['weight'],
            $validatedData['gender'],
            $validatedData['age']
        );

        // Tentukan kategori BMI
        $category = $this->getBmiCategory($bmiValue);

        // Dapatkan saran berdasarkan BMI
        $recommendation = $this->getBmiRecommendation($bmiValue, $validatedData['gender'], $validatedData['age']);

        $bmi = BMI::create([
            'user_id' => Auth::user()->id,
            'height' => $validatedData['height'],
            'weight' => $validatedData['weight'],
            'gender' => $validatedData['gender'],
            'age' => $validatedData['age'],
            'bmi_value' => round($bmiValue, 2),
            'category' => $category,
            'recommendation' => $recommendation,
        ]);

        return Redirect::route('bmi.page')
            ->with('success', 'BMI berhasil dihitung dan disimpan ke riwayat Anda!')
            ->with('bmiResult', [
                'bmi' => round($bmiValue, 2),
                'category' => $category,
                'recommendation' => $recommendation
            ]);
    }

    // Fungsi untuk menghitung BMI (diperbaiki)
    private function calculateBmi($height, $weight, $gender, $age)
    {
        // Konversi tinggi dari cm ke meter
        $heightInMeters = $height / 100;

        // Rumus BMI = berat (kg) / (tinggi (m))²
        $bmi = $weight / ($heightInMeters * $heightInMeters);

        return $bmi;
    }

    // Fungsi untuk menentukan kategori BMI
    private function getBmiCategory($bmi)
    {
        if ($bmi < 18.5) {
            return 'Underweight';
        } elseif ($bmi >= 18.5 && $bmi < 25) {
            return 'Normal weight';
        } elseif ($bmi >= 25 && $bmi < 30) {
            return 'Overweight';
        } else {
            return 'Obese';
        }
    }

    // Fungsi untuk memberikan rekomendasi berdasarkan BMI
    private function getBmiRecommendation($bmi, $gender, $age)
    {
        $category = $this->getBmiCategory($bmi);

        switch ($category) {
            case 'Underweight':
                return 'Disarankan untuk menambah berat badan dengan pola makan sehat dan olahraga yang tepat. Konsultasikan dengan dokter atau ahli gizi.';

            case 'Normal weight':
                return 'Berat badan Anda ideal! Pertahankan dengan pola makan seimbang dan olahraga teratur.';

            case 'Overweight':
                return 'Disarankan untuk menurunkan berat badan dengan diet sehat dan meningkatkan aktivitas fisik. Konsultasikan dengan ahli gizi.';

            case 'Obese':
                return 'Sangat disarankan untuk berkonsultasi dengan dokter untuk program penurunan berat badan yang aman dan efektif.';

            default:
                return 'Konsultasikan hasil BMI Anda dengan tenaga kesehatan profesional.';
        }
    }

    // Fungsi untuk insert data bmi untuk guest (tanpa login)
    public function calculateGuestBmi(Request $request)
    {
        $validatedData = $request->validate([
            'height' => 'required|numeric|min:50|max:300', // dalam cm
            'weight' => 'required|numeric|min:10|max:500', // dalam kg
            'gender' => 'required|string|in:male,female',
            'age' => 'required|integer|min:1|max:150',
        ]);

        // Hitung BMI
        $bmiValue = $this->calculateBmi(
            $validatedData['height'],
            $validatedData['weight'],
            $validatedData['gender'],
            $validatedData['age']
        );

        // Tentukan kategori BMI
        $category = $this->getBmiCategory($bmiValue);

        // Dapatkan saran berdasarkan BMI
        $recommendation = $this->getBmiRecommendation($bmiValue, $validatedData['gender'], $validatedData['age']);

        // Simpan ke database dengan user_id null untuk guest
        $bmi = BMI::create([
            'user_id' => null, // Guest user
            'height' => $validatedData['height'],
            'weight' => $validatedData['weight'],
            'gender' => $validatedData['gender'],
            'age' => $validatedData['age'],
            'bmi_value' => round($bmiValue, 2),
            'category' => $category,
            'recommendation' => $recommendation,
        ]);

        return Redirect::route('bmi.page')
            ->with('success', 'BMI berhasil dihitung dan disimpan!')
            ->with('bmiResult', [
                'bmi' => round($bmiValue, 2),
                'category' => $category,
                'recommendation' => $recommendation
            ]);
    }

    // Fungsi untuk menampilkan halaman BMI
    public function bmiPage()
    {
        if (Auth::check()) {
            // Ambil riwayat BMI user yang login
            $bmiHistory = BMI::where('user_id', Auth::user()->id)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            return Inertia::render('bmi/halamanBmi', [
                'bmiHistory' => $bmiHistory,
                'user' => Auth::user()->only(['username', 'gender', 'birth_date']),
                'bmiResult' => session('bmiResult')
            ]);
        }

        // Untuk user yang tidak login
        return Inertia::render('bmi/halamanBmi', [
            'bmiHistory' => [],
            'user' => null,
            'bmiResult' => session('bmiResult')
        ]);
    }

    // Fungsi untuk menampilkan riwayat BMI
    public function index()
    {
        $bmiRecords = BMI::where('user_id', Auth::user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Bmi/Index', [
            'bmiRecords' => $bmiRecords
        ]);
    }

    // Fungsi untuk menghapus record BMI
    public function destroy($id)
    {
        $bmi = BMI::where('user_id', Auth::user()->id)->findOrFail($id);
        $bmi->delete();

        return Redirect::back()
            ->with('success', 'Record BMI berhasil dihapus dari riwayat Anda.');
    }
}
