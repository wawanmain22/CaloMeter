import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VerifikasiLayout from '@/layouts/verifikasi-layout';
import NonVerifikasiLayout from '@/layouts/non-verifikasi-layout';
import { useForm, usePage, Link } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Target, 
  Droplets, 
  Utensils, 
  Coffee,
  Trash2,
  Settings,
  TrendingUp,
  Info,
  UserPlus,
  History,
  Lightbulb
} from 'lucide-react';
import { showSuccess, showError, showConfirm } from '@/lib/sweetalert';

interface DailyTrackerData {
  id: number;
  date: string;
  calorie_target: number;
  water_target: number;
  total_calorie_intake: number;
  total_water_intake: number;
  calorie_progress_percentage: number;
  water_progress_percentage: number;
  goal_type: string;
}

interface TrackerDetail {
  id: number;
  food_type: string;
  name: string;
  consumed_at: string;
  amount: number;
  unit: string;
  calories: number;
  water_intake: number;
}

interface DailyTrackerPageProps {
  requiresAuth: boolean;
  dailyTracker?: DailyTrackerData;
  dailyDetails?: TrackerDetail[];
  weeklyHistory?: DailyTrackerData[];
  selectedDate?: string;
  user?: {
    username: string;
    gender: string;
  };
  smartSuggestions?: {
    calorie_target: number;
    water_target: number;
    goal_type: string;
    activity_level: string;
    calculation_date: string;
  };
}

export default function HalamanDailyTracker({ 
  requiresAuth, 
  dailyTracker, 
  dailyDetails = [], 
  weeklyHistory = [],
  selectedDate,
  user,
  smartSuggestions 
}: DailyTrackerPageProps) {
  const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
  const [showFoodForm, setShowFoodForm] = useState(false);
  const [showWaterForm, setShowWaterForm] = useState(false);
  const [showTargetForm, setShowTargetForm] = useState(false);

  // Helper untuk menentukan apakah ini adalah hari ini
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const isPastDate = selectedDate && selectedDate < new Date().toISOString().split('T')[0];
  const isFutureDate = selectedDate && selectedDate > new Date().toISOString().split('T')[0];

  // Debug logging
  console.log('Daily Tracker Debug:', {
    dailyTracker,
    calorie_progress_percentage: dailyTracker?.calorie_progress_percentage,
    water_progress_percentage: dailyTracker?.water_progress_percentage,
    typeof_calorie: typeof dailyTracker?.calorie_progress_percentage,
    typeof_water: typeof dailyTracker?.water_progress_percentage
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

  const foodForm = useForm({
    date: selectedDate || new Date().toISOString().split('T')[0],
    food_type: 'food',
    name: '',
    consumed_at: new Date().toTimeString().slice(0, 5),
    amount: '',
    unit: 'gram',
    calories: '',
    water_intake: '0',
  });

  const waterForm = useForm({
    date: selectedDate || new Date().toISOString().split('T')[0],
    food_type: 'drink',
    name: '',
    consumed_at: new Date().toTimeString().slice(0, 5),
    amount: '',
    unit: 'ml',
    calories: '0',
    water_intake: '',
  });

  const targetForm = useForm({
    date: selectedDate || new Date().toISOString().split('T')[0],
    calorie_target: dailyTracker?.calorie_target?.toString() || '2000',
    water_target: dailyTracker?.water_target?.toString() || '2000',
    goal_type: dailyTracker?.goal_type || 'maintain_weight',
  });

  const submitFood: FormEventHandler = (e) => {
    e.preventDefault();
    foodForm.post('/daily-tracker/add', {
      onSuccess: () => {
        foodForm.reset();
        setShowFoodForm(false);
      },
    });
  };

  const submitWater: FormEventHandler = (e) => {
    e.preventDefault();
    // Ensure water_intake matches amount for drinks
    const formData = {
      ...waterForm.data,
      water_intake: waterForm.data.amount,
    };
    
    waterForm.transform(() => formData);
    waterForm.post('/daily-tracker/add', {
      onSuccess: () => {
        waterForm.reset();
        setShowWaterForm(false);
      },
    });
  };

  const submitTargets: FormEventHandler = (e) => {
    e.preventDefault();
    targetForm.post('/daily-tracker/update-targets', {
      onSuccess: () => {
        setShowTargetForm(false);
      },
    });
  };

  const applySmartSuggestions = () => {
    if (!smartSuggestions) return;
    
    targetForm.setData({
      date: selectedDate || new Date().toISOString().split('T')[0],
      calorie_target: smartSuggestions.calorie_target.toString(),
      water_target: smartSuggestions.water_target.toString(),
      goal_type: smartSuggestions.goal_type,
    });
    
    setShowTargetForm(true);
    showSuccess('Target berhasil disesuaikan berdasarkan kalkulasi kalori Anda!');
  };

  const getGoalTypeLabel = (goalType: string) => {
    switch (goalType) {
      case 'lose_weight': return 'Turunkan Berat Badan';
      case 'gain_weight': return 'Naikkan Berat Badan';
      case 'maintain_weight': return 'Pertahankan Berat Badan';
      default: return 'Pertahankan Berat Badan';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const getProgressStatus = (percentage: number, type: 'calorie' | 'water') => {
    if (percentage >= 100) {
      return { status: 'Tercapai', color: 'text-green-600', icon: '✅' };
    } else if (percentage >= 75) {
      return { status: 'Hampir Tercapai', color: 'text-yellow-600', icon: '⚡' };
    } else if (percentage >= 50) {
      return { status: 'Separuh Perjalanan', color: 'text-blue-600', icon: '💪' };
    } else if (percentage > 0) {
      return { status: 'Mulai Baik', color: 'text-purple-600', icon: '🚀' };
    } else {
      return { 
        status: type === 'calorie' ? 'Belum Makan' : 'Belum Minum', 
        color: 'text-gray-500', 
        icon: type === 'calorie' ? '🍽️' : '💧' 
      };
    }
  };

  // If user not authenticated, show auth required page
  if (requiresAuth) {
    return (
      <NonVerifikasiLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Daily Tracker</CardTitle>
              <CardDescription>
                Fitur tracking harian untuk mencatat makanan, minuman, dan progress kalori Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Login Required!</strong><br />
                  Daily Tracker hanya tersedia untuk pengguna yang sudah login. 
                  Silakan login atau daftar akun terlebih dahulu.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <Target className="mr-2 h-4 w-4" />
                    Login untuk Mulai Tracking
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Belum Punya Akun? Daftar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </NonVerifikasiLayout>
    );
  }

  const Layout = VerifikasiLayout;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Daily Tracker</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Tracking harian makanan, minuman, dan progress kalori Anda
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                window.location.href = `/daily-tracker?date=${e.target.value}`;
              }}
              className="flex-1 sm:w-auto"
            />
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Link href="/daily-tracker/history">
                  <History className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">History</span>
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTargetForm(true)}
                className="flex-1 sm:flex-none"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Target</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Date Status Alert */}
        {isPastDate && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              <strong>Melihat Data Masa Lalu</strong><br />
              Anda sedang melihat tracking untuk tanggal {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. 
              Data ini sudah tidak bisa diubah secara otomatis.
            </AlertDescription>
          </Alert>
        )}

        {isFutureDate && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Perencanaan Masa Depan</strong><br />
              Anda sedang merencanakan tracking untuk {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. 
              Target dan pengaturan bisa diatur dari sekarang.
            </AlertDescription>
          </Alert>
        )}

        {/* Smart Suggestions */}
        {smartSuggestions && isToday && (
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Lightbulb className="h-5 w-5" />
                Rekomendasi Target
              </CardTitle>
              <CardDescription>
                Berdasarkan kalkulasi kalori Anda ({smartSuggestions.calculation_date})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {smartSuggestions.calorie_target}
                  </div>
                  <div className="text-sm text-muted-foreground">Kalori/hari</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">
                    {smartSuggestions.water_target} ml
                  </div>
                  <div className="text-sm text-muted-foreground">Air/hari</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-emerald-600">
                    {getGoalTypeLabel(smartSuggestions.goal_type)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {smartSuggestions.activity_level}
                  </div>
                </div>
              </div>
              <Button onClick={applySmartSuggestions} className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Terapkan Rekomendasi
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Kalori Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Utensils className="h-5 w-5" />
                Kalori
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">
                    {dailyTracker?.total_calorie_intake || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    dari {dailyTracker?.calorie_target || 0} kalori
                  </div>
                </div>
                <Badge variant="secondary">
                  {Math.round(parseFloat(dailyTracker?.calorie_progress_percentage) || 0)}%
                </Badge>
              </div>
              <Progress 
                value={parseFloat(dailyTracker?.calorie_progress_percentage) || 0} 
                className="h-3"
              />
              <div className="flex items-center justify-between text-sm">
                <span className={getProgressStatus(parseFloat(dailyTracker?.calorie_progress_percentage) || 0, 'calorie').color}>
                  {getProgressStatus(parseFloat(dailyTracker?.calorie_progress_percentage) || 0, 'calorie').icon} {getProgressStatus(parseFloat(dailyTracker?.calorie_progress_percentage) || 0, 'calorie').status}
                </span>
                <span className="text-muted-foreground">
                  Sisa: {Math.max(0, (dailyTracker?.calorie_target || 0) - (dailyTracker?.total_calorie_intake || 0))} kal
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Air Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Droplets className="h-5 w-5" />
                Air
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">
                    {dailyTracker?.total_water_intake || 0} ml
                  </div>
                  <div className="text-sm text-muted-foreground">
                    dari {dailyTracker?.water_target || 0} ml
                  </div>
                </div>
                <Badge variant="secondary">
                  {Math.round(parseFloat(dailyTracker?.water_progress_percentage) || 0)}%
                </Badge>
              </div>
              <Progress 
                value={parseFloat(dailyTracker?.water_progress_percentage) || 0} 
                className="h-3"
              />
              <div className="flex items-center justify-between text-sm">
                <span className={getProgressStatus(parseFloat(dailyTracker?.water_progress_percentage) || 0, 'water').color}>
                  {getProgressStatus(parseFloat(dailyTracker?.water_progress_percentage) || 0, 'water').icon} {getProgressStatus(parseFloat(dailyTracker?.water_progress_percentage) || 0, 'water').status}
                </span>
                <span className="text-muted-foreground">
                  Sisa: {Math.max(0, (dailyTracker?.water_target || 0) - (dailyTracker?.total_water_intake || 0))} ml
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Summary */}
        {(dailyTracker?.total_calorie_intake > 0 || dailyTracker?.total_water_intake > 0) && (
          <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <TrendingUp className="h-5 w-5" />
                Ringkasan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-emerald-600">
                    {dailyDetails.filter(item => item.food_type === 'food').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Makanan</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">
                    {dailyDetails.filter(item => item.food_type === 'drink').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Minuman</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-600">
                    {(() => {
                      const calorieProgress = parseFloat(dailyTracker?.calorie_progress_percentage) || 0;
                      const waterProgress = parseFloat(dailyTracker?.water_progress_percentage) || 0;
                      const average = (calorieProgress + waterProgress) / 2;
                      
                      console.log('Average Calculation Fixed:', {
                        calorieProgress,
                        waterProgress,
                        sum: calorieProgress + waterProgress,
                        average,
                        rounded: Math.round(average)
                      });
                      
                      return Math.round(average);
                    })()}%
                  </div>
                  <div className="text-sm text-muted-foreground">Progress Rata-rata</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">
                    {getGoalTypeLabel(dailyTracker?.goal_type || 'maintain_weight').split(' ')[0]}
                  </div>
                  <div className="text-sm text-muted-foreground">Tujuan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Food Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Makanan
              </CardTitle>
              <Button 
                onClick={() => setShowFoodForm(!showFoodForm)}
                disabled={isPastDate}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isPastDate ? 'Data Masa Lalu' : 'Tambah Makanan'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showFoodForm && (
              <form onSubmit={submitFood} className="space-y-4 mb-6 p-4 border rounded-lg bg-orange-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="food_name">Nama Makanan</Label>
                    <Input
                      id="food_name"
                      value={foodForm.data.name}
                      onChange={(e) => foodForm.setData('name', e.target.value)}
                      placeholder="Contoh: Nasi Goreng"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="food_time">Waktu Makan</Label>
                    <Input
                      id="food_time"
                      type="time"
                      value={foodForm.data.consumed_at}
                      onChange={(e) => foodForm.setData('consumed_at', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="food_amount">Jumlah</Label>
                    <Input
                      id="food_amount"
                      type="number"
                      value={foodForm.data.amount}
                      onChange={(e) => foodForm.setData('amount', e.target.value)}
                      placeholder="100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="food_unit">Satuan</Label>
                    <Select
                      value={foodForm.data.unit}
                      onValueChange={(value) => foodForm.setData('unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gram">gram</SelectItem>
                        <SelectItem value="pcs">pcs</SelectItem>
                        <SelectItem value="cup">cup</SelectItem>
                        <SelectItem value="tbsp">tbsp</SelectItem>
                        <SelectItem value="tsp">tsp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="food_calories">Kalori</Label>
                    <Input
                      id="food_calories"
                      type="number"
                      value={foodForm.data.calories}
                      onChange={(e) => foodForm.setData('calories', e.target.value)}
                      placeholder="250"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={foodForm.processing}>
                    {foodForm.processing ? 'Menyimpan...' : 'Simpan Makanan'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowFoodForm(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            )}

            {/* Food List */}
            <div className="space-y-3">
              {dailyDetails.filter(item => item.food_type === 'food').length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada makanan yang dicatat hari ini</p>
                </div>
              ) : (
                dailyDetails.filter(item => item.food_type === 'food').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Utensils className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.amount} {item.unit} • {item.consumed_at} • {item.calories} kal
                        </div>
                      </div>
                    </div>
                    {!isPastDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const result = await showConfirm(
                            'Makanan ini akan dihapus dari tracking hari ini.',
                            'Hapus Makanan?',
                            'Ya, Hapus!',
                            'Batal'
                          );
                          
                          if (result.isConfirmed) {
                            window.location.href = `/daily-tracker/delete/${item.id}`;
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Water Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Air & Minuman
              </CardTitle>
              <Button 
                onClick={() => setShowWaterForm(!showWaterForm)}
                disabled={isPastDate}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isPastDate ? 'Data Masa Lalu' : 'Tambah Minuman'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showWaterForm && (
              <form onSubmit={submitWater} className="space-y-4 mb-6 p-4 border rounded-lg bg-blue-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="water_name">Nama Minuman</Label>
                    <Input
                      id="water_name"
                      value={waterForm.data.name}
                      onChange={(e) => waterForm.setData('name', e.target.value)}
                      placeholder="Contoh: Air Putih, Teh, Kopi"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water_time">Waktu Minum</Label>
                    <Input
                      id="water_time"
                      type="time"
                      value={waterForm.data.consumed_at}
                      onChange={(e) => waterForm.setData('consumed_at', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="water_amount">Jumlah (ml)</Label>
                    <Input
                      id="water_amount"
                      type="number"
                      value={waterForm.data.amount}
                      onChange={(e) => {
                        waterForm.setData('amount', e.target.value);
                        waterForm.setData('water_intake', e.target.value);
                      }}
                      placeholder="250"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water_calories">Kalori (opsional)</Label>
                    <Input
                      id="water_calories"
                      type="number"
                      value={waterForm.data.calories}
                      onChange={(e) => waterForm.setData('calories', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={waterForm.processing}>
                    {waterForm.processing ? 'Menyimpan...' : 'Simpan Minuman'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowWaterForm(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            )}

            {/* Water List */}
            <div className="space-y-3">
              {dailyDetails.filter(item => item.food_type === 'drink').length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Droplets className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada minuman yang dicatat hari ini</p>
                </div>
              ) : (
                dailyDetails.filter(item => item.food_type === 'drink').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.water_intake} ml • {item.consumed_at}
                          {item.calories > 0 && ` • ${item.calories} kal`}
                        </div>
                      </div>
                    </div>
                    {!isPastDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const result = await showConfirm(
                            'Minuman ini akan dihapus dari tracking hari ini.',
                            'Hapus Minuman?',
                            'Ya, Hapus!',
                            'Batal'
                          );
                          
                          if (result.isConfirmed) {
                            window.location.href = `/daily-tracker/delete/${item.id}`;
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Target Settings Modal */}
        <Dialog open={showTargetForm} onOpenChange={setShowTargetForm}>
          <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Atur Target Harian</DialogTitle>
              <DialogDescription>
                Sesuaikan target kalori dan air harian Anda sesuai dengan kebutuhan dan tujuan kesehatan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitTargets} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calorie_target">Target Kalori</Label>
                <Input
                  id="calorie_target"
                  type="number"
                  value={targetForm.data.calorie_target}
                  onChange={(e) => targetForm.setData('calorie_target', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="water_target">Target Air (ml)</Label>
                <Input
                  id="water_target"
                  type="number"
                  value={targetForm.data.water_target}
                  onChange={(e) => targetForm.setData('water_target', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal_type">Tujuan</Label>
                <Select
                  value={targetForm.data.goal_type}
                  onValueChange={(value) => targetForm.setData('goal_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Turunkan Berat Badan</SelectItem>
                    <SelectItem value="maintain_weight">Pertahankan Berat Badan</SelectItem>
                    <SelectItem value="gain_weight">Naikkan Berat Badan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={targetForm.processing}>
                  {targetForm.processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowTargetForm(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}