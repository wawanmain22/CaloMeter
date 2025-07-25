import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import VerifikasiLayout from '@/layouts/verifikasi-layout';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
  Calendar, 
  ArrowLeft,
  Utensils, 
  Droplets, 
  Target,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

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
  details_count: number;
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

interface HistoryPageProps {
  trackers: DailyTrackerData[];
  selectedTracker?: DailyTrackerData;
  selectedDetails?: TrackerDetail[];
  selectedDate?: string;
}

export default function HalamanHistory({ 
  trackers, 
  selectedTracker, 
  selectedDetails = [],
  selectedDate 
}: HistoryPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(selectedTracker ? 'detail' : 'list');

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getGoalTypeLabel = (goalType: string) => {
    switch (goalType) {
      case 'lose_weight': return 'Turunkan BB';
      case 'gain_weight': return 'Naikkan BB';
      case 'maintain_weight': return 'Pertahankan BB';
      default: return 'Pertahankan BB';
    }
  };

  const getGoalColor = (goalType: string) => {
    switch (goalType) {
      case 'lose_weight': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'gain_weight': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintain_weight': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getWeeklyStats = () => {
    const totalDays = trackers.length;
    const avgCalories = trackers.reduce((sum, t) => sum + t.total_calorie_intake, 0) / totalDays;
    const avgWater = trackers.reduce((sum, t) => sum + t.total_water_intake, 0) / totalDays;
    const daysMetCalorieGoal = trackers.filter(t => t.calorie_progress_percentage >= 100).length;
    const daysMetWaterGoal = trackers.filter(t => t.water_progress_percentage >= 100).length;

    return {
      totalDays,
      avgCalories: Math.round(avgCalories),
      avgWater: Math.round(avgWater),
      calorieSuccess: Math.round((daysMetCalorieGoal / totalDays) * 100),
      waterSuccess: Math.round((daysMetWaterGoal / totalDays) * 100)
    };
  };

  const stats = getWeeklyStats();

  if (viewMode === 'detail' && selectedTracker) {
    return (
      <VerifikasiLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Detail Tracking</h1>
              <p className="text-muted-foreground">{formatDate(selectedTracker.date)}</p>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Utensils className="h-5 w-5" />
                  Kalori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold">{selectedTracker.total_calorie_intake}</div>
                      <div className="text-sm text-muted-foreground">
                        dari {selectedTracker.calorie_target} kalori
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(parseFloat(selectedTracker.calorie_progress_percentage?.toString()) || 0)}%
                    </Badge>
                  </div>
                  <Progress value={parseFloat(selectedTracker.calorie_progress_percentage?.toString()) || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplets className="h-5 w-5" />
                  Air
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold">{selectedTracker.total_water_intake} ml</div>
                      <div className="text-sm text-muted-foreground">
                        dari {selectedTracker.water_target} ml
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(parseFloat(selectedTracker.water_progress_percentage?.toString()) || 0)}%
                    </Badge>
                  </div>
                  <Progress value={parseFloat(selectedTracker.water_progress_percentage?.toString()) || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Food Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Makanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedDetails.filter(item => item.food_type === 'food').length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">Tidak ada makanan dicatat</p>
                ) : (
                  selectedDetails.filter(item => item.food_type === 'food').map((item) => (
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
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Drink Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Air & Minuman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedDetails.filter(item => item.food_type === 'drink').length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">Tidak ada minuman dicatat</p>
                ) : (
                  selectedDetails.filter(item => item.food_type === 'drink').map((item) => (
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
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </VerifikasiLayout>
    );
  }

  return (
    <VerifikasiLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">History Daily Tracker</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Riwayat tracking makanan dan minuman Anda
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/daily-tracker">
              <Target className="h-4 w-4 mr-2" />
              Tracking Hari Ini
            </Link>
          </Button>
        </div>

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ringkasan {stats.totalDays} Hari Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.avgCalories}</div>
                <div className="text-sm text-muted-foreground">Rata-rata Kalori</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{stats.avgWater} ml</div>
                <div className="text-sm text-muted-foreground">Rata-rata Air</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.calorieSuccess}%</div>
                <div className="text-sm text-muted-foreground">Target Kalori Tercapai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.waterSuccess}%</div>
                <div className="text-sm text-muted-foreground">Target Air Tercapai</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Riwayat Harian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada riwayat tracking</p>
                </div>
              ) : (
                trackers.map((tracker) => (
                  <div
                    key={tracker.id}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/daily-tracker/history/${tracker.date}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{formatDate(tracker.date)}</h3>
                          <Badge className={getGoalColor(tracker.goal_type)}>
                            {getGoalTypeLabel(tracker.goal_type)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Utensils className="h-4 w-4 text-orange-500" />
                              <span>{tracker.total_calorie_intake} / {tracker.calorie_target} kal</span>
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(parseFloat(tracker.calorie_progress_percentage?.toString()) || 0)}%
                              </Badge>
                            </div>
                            <Progress 
                              value={parseFloat(tracker.calorie_progress_percentage?.toString()) || 0} 
                              className="h-1"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              <span>{tracker.total_water_intake} / {tracker.water_target} ml</span>
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(parseFloat(tracker.water_progress_percentage?.toString()) || 0)}%
                              </Badge>
                            </div>
                            <Progress 
                              value={parseFloat(tracker.water_progress_percentage?.toString()) || 0} 
                              className="h-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </VerifikasiLayout>
  );
}