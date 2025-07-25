import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VerifikasiLayout from '@/layouts/verifikasi-layout';
import NonVerifikasiLayout from '@/layouts/non-verifikasi-layout';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { History, Info, Trash2, Target, Activity } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/lib/sweetalert';
import Swal from 'sweetalert2';

interface ActivityData {
  id: number;
  name: string;
  description: string;
}

interface CalorieRecord {
  id: number;
  height: number;
  weight: number;
  gender: string;
  age: number;
  bmr: number;
  daily_calories: number;
  activity_multiplier: number;
  recommendation_maintain: string;
  recommendation_lose: string;
  recommendation_gain: string;
  activity: ActivityData;
  created_at: string;
}

interface CaloriePageProps {
  activities: ActivityData[];
  calorieHistory?: CalorieRecord[];
  calorieResult?: {
    bmr: number;
    dailyCalories: number;
    activity: string;
    recommendation: {
      maintain: string;
      lose: string;
      gain: string;
    };
  };
}

export default function HalamanCalorieIntake({ activities, calorieHistory = [], calorieResult }: CaloriePageProps) {
  const { auth, flash } = usePage<{ auth: any; flash: { success?: string; error?: string } }>().props;
  const user = auth?.user;

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      showSuccess(flash.success);
    }
    if (flash?.error) {
      showError(flash.error);
    }
  }, [flash]);

  // Handle calorie result display
  useEffect(() => {
    if (calorieResult) {
      showCalorieResult(calorieResult);
    }
  }, [calorieResult]);

  const showCalorieResult = (result: any) => {
    const content = `
      <div class="text-left space-y-4">
        <div class="text-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Hasil Perhitungan Kalori</h3>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">${result.bmr}</div>
            <div class="text-sm text-blue-800">BMR (Kalori Dasar)</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">${result.dailyCalories}</div>
            <div class="text-sm text-green-800">Kebutuhan Harian</div>
          </div>
        </div>
        
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="font-semibold text-gray-900 mb-2">Level Aktivitas: ${result.activity}</div>
        </div>
        
        <div class="space-y-2">
          <div class="text-sm"><strong>Pertahankan Berat:</strong> ${result.recommendation.maintain}</div>
          <div class="text-sm"><strong>Turunkan Berat:</strong> ${result.recommendation.lose}</div>
          <div class="text-sm"><strong>Naikkan Berat:</strong> ${result.recommendation.gain}</div>
        </div>
      </div>
    `;

    // @ts-expect-error - Swal is available globally
    Swal.fire({
      title: 'Kebutuhan Kalori Harian',
      html: content,
      icon: 'success',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#10b981',
      width: '600px',
    });
  };
  
  const { data, setData, post, processing, errors, reset } = useForm({
    height: '',
    weight: '',
    gender: (user?.gender as string) || '',
    age: '',
    activity_id: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (user) {
      // For authenticated users, use the existing route
      post('/calorie-intake/calculate', {
        onSuccess: () => reset(),
      });
    } else {
      // For non-authenticated users, send data to backend for database storage
      post('/calorie-intake/calculate-guest', {
        onSuccess: () => reset(),
      });
    }
  };

  const getActivityColor = (activityName: string): string => {
    switch (activityName.toLowerCase()) {
      case 'sedentary':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'lightly active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'moderately active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'very active':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'extremely active':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const Layout = user ? VerifikasiLayout : NonVerifikasiLayout;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Calorie Intake Calculator</h1>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Hitung kebutuhan kalori harian Anda berdasarkan tinggi, berat, usia, dan tingkat aktivitas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Calorie Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Kalkulator Kalori
              </CardTitle>
              <CardDescription>
                Masukkan data diri dan tingkat aktivitas Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Tinggi Badan (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="50"
                      max="300"
                      value={data.height}
                      onChange={(e) => setData('height', e.target.value)}
                      placeholder="170"
                      required
                    />
                    {errors.height && (
                      <p className="text-sm text-destructive">{errors.height}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Berat Badan (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="10"
                      max="500"
                      value={data.weight}
                      onChange={(e) => setData('weight', e.target.value)}
                      placeholder="70"
                      required
                    />
                    {errors.weight && (
                      <p className="text-sm text-destructive">{errors.weight}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <Select 
                      value={data.gender} 
                      onValueChange={(value) => setData('gender', value)}
                      disabled={Boolean(user && user.gender)}
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
                    <Label htmlFor="age">Umur (tahun)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="150"
                      value={data.age}
                      onChange={(e) => setData('age', e.target.value)}
                      placeholder="25"
                      required
                    />
                    {errors.age && (
                      <p className="text-sm text-destructive">{errors.age}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_id">Tingkat Aktivitas</Label>
                  <Select 
                    value={data.activity_id} 
                    onValueChange={(value) => setData('activity_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat aktivitas" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map((activity) => (
                        <SelectItem key={activity.id} value={activity.id.toString()}>
                          {activity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.activity_id && (
                    <p className="text-sm text-destructive">{errors.activity_id}</p>
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
                      Menghitung...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Hitung Kebutuhan Kalori
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Activity Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Level Aktivitas
              </CardTitle>
              <CardDescription>
                Pilih level aktivitas yang sesuai dengan rutinitas harian Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium">{activity.name}</span>
                      <Badge className={getActivityColor(activity.name)}>
                        {activity.name === 'Sedentary' && '1.2x'}
                        {activity.name === 'Lightly Active' && '1.375x'}
                        {activity.name === 'Moderately Active' && '1.55x'}
                        {activity.name === 'Very Active' && '1.725x'}
                        {activity.name === 'Extremely Active' && '1.9x'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                ))}
              </div>

              {!user && (
                <Alert className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">Ingin menyimpan riwayat kalori?</span>
                    <br />
                    <a href="/register" className="text-primary hover:underline">
                      Daftar sekarang
                    </a> untuk menyimpan dan melacak perhitungan kalori Anda.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calorie History - Only for authenticated users */}
        {user && calorieHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Riwayat Perhitungan Kalori
              </CardTitle>
              <CardDescription>
                Riwayat perhitungan kebutuhan kalori Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calorieHistory.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString('id-ID')}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Tinggi: {record.height} cm</span>
                          <span>Berat: {record.weight} kg</span>
                          <span>Umur: {record.age} tahun</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getActivityColor(record.activity.name)}>
                          {record.activity.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const result = await showConfirm(
                              'Record kalori ini akan dihapus permanen dan tidak dapat dikembalikan.',
                              'Hapus Record Kalori?',
                              'Ya, Hapus!',
                              'Batal'
                            );
                            
                            if (result.isConfirmed) {
                              window.location.href = `/calorie-intake/delete/${record.id}`;
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Hasil Perhitungan */}
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{Math.round(record.bmr)}</div>
                          <div className="text-xs text-muted-foreground">BMR (Kalori Dasar)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{Math.round(record.daily_calories)}</div>
                          <div className="text-xs text-muted-foreground">Kebutuhan Harian</div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div><strong>Pertahankan:</strong> {record.recommendation_maintain}</div>
                        <div><strong>Turunkan:</strong> {record.recommendation_lose}</div>
                        <div><strong>Naikkan:</strong> {record.recommendation_gain}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}