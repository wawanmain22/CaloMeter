import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import NonVerifikasiLayout from '@/layouts/non-verifikasi-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { showSuccess, showError } from '@/lib/sweetalert';

export default function HalamanLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    password: '',
    remember: false,
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
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  return (
    <NonVerifikasiLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Masuk ke Akun</h1>
            <p className="text-muted-foreground">
              Masukkan kredensial Anda untuk mengakses akun
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Gunakan username dan password untuk masuk
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Masukkan password"
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={data.remember}
                    onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Ingat saya
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Belum punya akun? </span>
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Daftar sekarang
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