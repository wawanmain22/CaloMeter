import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NonVerifikasiLayout from '@/layouts/non-verifikasi-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { showSuccess, showError } from '@/lib/sweetalert';

export default function HalamanRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    password: '',
    password_confirmation: '',
    gender: '',
    birth_date: '',
  });

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      showSuccess(flash.success);
    }
    if (flash?.error) {
      showError(flash.error);
    }
  }, [flash]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/register', {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <NonVerifikasiLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
            <p className="text-muted-foreground">
              Bergabunglah dengan CaloMeter untuk tracking kesehatan yang lebih baik
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">
                Isi informasi di bawah untuk membuat akun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={data.username}
                    onChange={(e) => setData('username', e.target.value)}
                    placeholder="Masukkan username"
                    required
                    autoFocus
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-destructive">{errors.gender}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Tanggal Lahir</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={data.birth_date}
                    onChange={(e) => setData('birth_date', e.target.value)}
                    required
                  />
                  {errors.birth_date && (
                    <p className="text-sm text-destructive">{errors.birth_date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Masukkan password (min. 8 karakter)"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      placeholder="Ulangi password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    >
                      {showPasswordConfirmation ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Sudah punya akun? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Masuk sekarang
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              � Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    </NonVerifikasiLayout>
  );
}