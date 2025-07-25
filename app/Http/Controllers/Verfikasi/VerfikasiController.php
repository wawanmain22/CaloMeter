<?php

namespace App\Http\Controllers\Verfikasi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Inertia\Inertia;

class VerfikasiController extends Controller
{

    // fungsi untuk register
    public function register(Request $request){

        $validatedData = $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'gender' => 'required|string|in:male,female',
            'birth_date' => 'required|date|before:today',
        ]);

        $user = User::create([
            'username' => $validatedData['username'],
            'password' => Hash::make($validatedData['password']),
            'gender' => $validatedData['gender'],
            'birth_date' => $validatedData['birth_date'],
        ]);

        // Login user otomatis setelah registrasi
        Auth::login($user);

        // Redirect ke home dengan success message
        return Redirect::route('home')
            ->with('success', 'Selamat datang di CaloMeter! Akun Anda berhasil dibuat dan Anda sudah login.');
    }

    // Fungsi untuk login
    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'remember' => 'boolean', // optional untuk remember me
        ]);

        // Attempt login dengan username
        $credentials = $request->only('username', 'password');
        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            // Regenerate session untuk security
            $request->session()->regenerate();

            // Redirect ke intended page atau home
            return Redirect::intended('/')
                ->with('success', 'Selamat datang kembali, ' . Auth::user()->username . '!');
        }

        // Jika login gagal, return dengan error message
        return Redirect::back()
            ->withInput($request->only('username', 'remember'))
            ->with('error', 'Username atau password yang Anda masukkan salah.');
    }

    // Fungsi untuk logout
    public function logout(Request $request)
    {
        Auth::logout();

        // Invalidate session
        $request->session()->invalidate();

        // Regenerate CSRF token
        $request->session()->regenerateToken();

        return Redirect::route('home')
            ->with('success', 'Anda berhasil logout. Sampai jumpa lagi!');
    }

    // fungsi untuk menampilkan halaman login
    public function loginPage(){
        return Inertia::render('verifikasi/halamanLogin');
    }

    // fungsi untuk menampilkan halaman register
    public function registerPage(){
        return Inertia::render('verifikasi/halamanRegister');
    }

    // fungsi untuk menampilkan halaman home
    public function homePage(){
        return Inertia::render('halamanHome');
    }



}
