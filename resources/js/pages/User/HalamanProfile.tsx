import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VerifikasiLayout from '@/layouts/verifikasi-layout';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { User, Lock, Calendar, UserCircle, Eye, EyeOff } from 'lucide-react';
import { SharedData } from '@/types';
import { showSuccess, showError } from '@/lib/sweetalert';

interface UserData {
  id: number;
  username: string;
  gender: string;
  birth_date: string;
  created_at: string;
}

interface ProfilePageProps {
  user: UserData;
}

export default function HalamanProfile({ user }: ProfilePageProps) {
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      showSuccess(flash.success);
    }
    if (flash?.error) {
      showError(flash.error);
    }
  }, [flash]);

  const { data, setData, patch, processing, errors, reset } = useForm({
    username: user.username || '',
    gender: user.gender || '',
    birth_date: user.birth_date || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch('/profile/update', {
      onSuccess: () => {
        setData('current_password', '');
        setData('new_password', '');
        setData('new_password_confirmation', '');
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
  };

  return (
    <VerifikasiLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Profil Saya</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kelola informasi profil dan pengaturan akun Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Informasi Akun
              </CardTitle>
              <CardDescription>
                Detail informasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Username</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{user.username}</Badge>
                </div>
              </div>
              

              <div className="space-y-2">
                <Label className="text-sm font-medium">Jenis Kelamin</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{getGenderLabel(user.gender)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tanggal Lahir</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(user.birth_date)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Bergabung Sejak</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(user.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Update Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Edit Profil
                </CardTitle>
                <CardDescription>
                  Perbarui informasi profil dan password Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-6">
                  {/* Basic Info Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          value={data.username}
                          onChange={(e) => setData('username', e.target.value)}
                          placeholder="Username"
                          required
                        />
                        {errors.username && (
                          <p className="text-sm text-destructive">{errors.username}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Jenis Kelamin</Label>
                        <Select 
                          value={data.gender} 
                          onValueChange={(value) => setData('gender', value)}
                        >
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
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">Ubah Password</h3>
                    </div>
                    
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Kosongkan field password jika tidak ingin mengubah password
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">Password Lama</Label>
                        <div className="relative">
                          <Input
                            id="current_password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            placeholder="Masukkan password lama"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {errors.current_password && (
                          <p className="text-sm text-destructive">{errors.current_password}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new_password">Password Baru</Label>
                          <div className="relative">
                            <Input
                              id="new_password"
                              type={showNewPassword ? "text" : "password"}
                              value={data.new_password}
                              onChange={(e) => setData('new_password', e.target.value)}
                              placeholder="Masukkan password baru"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {errors.new_password && (
                            <p className="text-sm text-destructive">{errors.new_password}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new_password_confirmation">Konfirmasi Password Baru</Label>
                          <div className="relative">
                            <Input
                              id="new_password_confirmation"
                              type={showConfirmPassword ? "text" : "password"}
                              value={data.new_password_confirmation}
                              onChange={(e) => setData('new_password_confirmation', e.target.value)}
                              placeholder="Konfirmasi password baru"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <Button 
                      type="submit" 
                      disabled={processing}
                      className="min-w-32"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </VerifikasiLayout>
  );
}