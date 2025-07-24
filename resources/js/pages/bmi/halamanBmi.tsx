import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VerifikasiLayout from '@/layouts/verifikasi-layout';
import NonVerifikasiLayout from '@/layouts/non-verifikasi-layout';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { Calculator, History, Info, Trash2 } from 'lucide-react';
import { SharedData } from '@/types';
import { showSuccess, showError, showConfirm, showBMIResult } from '@/lib/sweetalert';

interface BMIRecord {
  id: number;
  height: number;
  weight: number;
  gender: string;
  age: number;
  bmi_value: number;
  category: string;
  recommendation: string;
  created_at: string;
}

interface BMIPageProps {
  bmiHistory?: BMIRecord[];
  bmiResult?: {
    bmi: number;
    category: string;
    recommendation: string;
  };
}

export default function HalamanBmi({ bmiHistory = [], bmiResult }: BMIPageProps) {
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

  // Handle BMI result display
  useEffect(() => {
    if (bmiResult) {
      showBMIResult(bmiResult.bmi, bmiResult.category, bmiResult.recommendation);
    }
  }, [bmiResult]);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    height: '',
    weight: '',
    gender: (user?.gender as string) || '',
    age: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (user) {
      post('/bmi/calculate', {
        onSuccess: () => reset(),
      });
    } else {
      // For non-authenticated users, calculate BMI client-side
      const heightInMeters = parseFloat(data.height) / 100;
      const weight = parseFloat(data.weight);
      const bmi = weight / (heightInMeters * heightInMeters);
      const category = getBMICategory(bmi);
      const recommendation = getBMIRecommendation(bmi);
      
      // Show BMI result with SweetAlert
      showBMIResult(parseFloat(bmi.toFixed(2)), category, recommendation);
      reset();
    }
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMIRecommendation = (bmi: number): string => {
    const category = getBMICategory(bmi);
    
    switch (category) {
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
  };

  const getBMIColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'underweight':
        return 'bg-blue-100 text-blue-800';
      case 'normal weight':
        return 'bg-green-100 text-green-800';
      case 'overweight':
        return 'bg-yellow-100 text-yellow-800';
      case 'obese':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const Layout = user ? VerifikasiLayout : NonVerifikasiLayout;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">BMI Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hitung Body Mass Index (BMI) Anda untuk mengetahui kategori berat badan dan mendapatkan rekomendasi kesehatan
          </p>
        </div>

        {/* BMI Result Alert */}
        {bmiResult && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">BMI Anda: {bmiResult.bmi}</span>
                <Badge className={getBMIColor(bmiResult.category)}>
                  {bmiResult.category}
                </Badge>
              </div>
              <p className="text-sm">{bmiResult.recommendation}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* BMI Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Kalkulator BMI
              </CardTitle>
              <CardDescription>
                Masukkan data diri Anda untuk menghitung BMI
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
                      <Calculator className="mr-2 h-4 w-4" />
                      Hitung BMI
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* BMI Information */}
          <Card>
            <CardHeader>
              <CardTitle>Kategori BMI</CardTitle>
              <CardDescription>
                Referensi kategori Body Mass Index menurut WHO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
                  <span className="font-medium">Underweight</span>
                  <span className="text-sm text-muted-foreground">&lt; 18.5</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                  <span className="font-medium">Normal weight</span>
                  <span className="text-sm text-muted-foreground">18.5 - 24.9</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50">
                  <span className="font-medium">Overweight</span>
                  <span className="text-sm text-muted-foreground">25.0 - 29.9</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
                  <span className="font-medium">Obese</span>
                  <span className="text-sm text-muted-foreground">&geq; 30.0</span>
                </div>
              </div>

              {!user && (
                <Alert className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">Ingin menyimpan riwayat BMI?</span>
                    <br />
                    <a href="/register" className="text-primary hover:underline">
                      Daftar sekarang
                    </a> untuk menyimpan dan melacak progres BMI Anda.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* BMI History - Only for authenticated users */}
        {user && bmiHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Riwayat BMI
              </CardTitle>
              <CardDescription>
                Riwayat perhitungan BMI Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bmiHistory.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString('id-ID')}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Tinggi: {record.height} cm</span>
                          <span>Berat: {record.weight} kg</span>
                          <span className="font-medium">BMI: {record.bmi_value}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getBMIColor(record.category)}>
                          {record.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const result = await showConfirm(
                              'Record BMI ini akan dihapus permanen dan tidak dapat dikembalikan.',
                              'Hapus Record BMI?',
                              'Ya, Hapus!',
                              'Batal'
                            );
                            
                            if (result.isConfirmed) {
                              window.location.href = `/bmi/delete/${record.id}`;
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{record.recommendation}</p>
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