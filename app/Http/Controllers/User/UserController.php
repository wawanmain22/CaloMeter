<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    // Fungsi untuk menampilkan halaman profile
    public function profilePage()
    {
        $user = Auth::user();
        
        return Inertia::render('User/HalamanProfile', [
            'user' => $user->only([
                'id', 
                'username', 
                'gender', 
                'birth_date', 
                'created_at'
            ])
        ]);
    }

    // Fungsi untuk update data user
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'username' => [
                'required', 
                'string', 
                'max:255', 
                Rule::unique('users')->ignore($user->id)
            ],
            'gender' => 'required|string|in:male,female',
            'birth_date' => 'required|date|before:today',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);

        // Jika user ingin update password
        if ($request->filled('current_password') && $request->filled('new_password')) {
            // Verifikasi password lama
            if (!Hash::check($request->current_password, $user->password)) {
                return Redirect::back()
                    ->withErrors(['current_password' => 'Password lama tidak sesuai.'])
                    ->withInput();
            }
            
            // Update password baru
            $validatedData['password'] = Hash::make($request->new_password);
        }

        // Hapus field password dari validatedData jika tidak diupdate
        unset($validatedData['current_password'], $validatedData['new_password']);

        // Update data user
        $user->update($validatedData);

        return Redirect::route('profile.page')
            ->with('success', 'Profil berhasil diperbarui!');
    }

    // Fungsi untuk menampilkan data user (API style jika diperlukan)
    public function getUserData()
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'data' => $user->only([
                'id', 
                'username', 
                'gender', 
                'birth_date', 
                'created_at'
            ])
        ]);
    }
}