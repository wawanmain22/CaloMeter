import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VerifikasiLayout from '@/layouts/verifikasi-layout';
import NonVerifikasiLayout from '@/layouts/non-verifikasi-layout';
import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Calculator, Target, TrendingUp, Users, CheckCircle, Star, BarChart3, History } from 'lucide-react';
import { showSuccess, showError } from '@/lib/sweetalert';
import { SharedData } from '@/types';

export default function HalamanHome() {
  const { flash, auth } = usePage<{ flash: { success?: string; error?: string }; auth: any }>().props;
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

  const features = [
    {
      icon: <Calculator className="h-8 w-8 text-primary" />,
      title: "BMI Calculator",
      description: "Hitung Body Mass Index dengan akurat untuk mengetahui kategori berat badan ideal Anda",
      href: "/bmi"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Calorie Intake",
      description: "Hitung kebutuhan kalori harian berdasarkan aktivitas dan tujuan kesehatan",
      href: "/calorie-intake"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Daily Tracker",
      description: "Pantau progres kesehatan harian dengan fitur tracking yang komprehensif",
      href: "/daily-tracker"
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "10,000+", label: "Pengguna Aktif" },
    { icon: <Calculator className="h-6 w-6" />, value: "50,000+", label: "Kalkulasi BMI" },
    { icon: <Target className="h-6 w-6" />, value: "25,000+", label: "Target Tercapai" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "95%", label: "Kepuasan User" }
  ];

  const benefits = [
    "Perhitungan BMI yang akurat dan mudah dipahami",
    "Rekomendasi kalori berdasarkan profil personal",
    "Tracking progress harian untuk motivasi",
    "Interface yang user-friendly dan responsive",
    "Data history untuk monitoring jangka panjang",
    "Tips kesehatan dari ahli gizi"
  ];

  const Layout = user ? VerifikasiLayout : NonVerifikasiLayout;

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              {user ? `👋 Selamat datang, ${String(user.username)}!` : '🚀 Platform Kesehatan Terdepan'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              CaloMeter
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Platform lengkap untuk menghitung BMI, kalori harian, dan tracking kesehatan Anda dengan mudah dan akurat
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/bmi">
                    <Calculator className="mr-2 h-5 w-5" />
                    Hitung BMI Sekarang
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/bmi">
                    <History className="mr-2 h-5 w-5" />
                    Lihat Riwayat BMI
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/register">Mulai Sekarang</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/bmi">Coba BMI Calculator</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="flex justify-center text-primary">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Fitur Unggulan</h2>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Dapatkan akses ke berbagai tools kesehatan yang dapat membantu mencapai target berat badan ideal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-6">
                    {feature.description}
                  </CardDescription>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={feature.href}>Mulai Gunakan</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-muted/30 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Mengapa Memilih CaloMeter?
              </h2>
              <p className="text-lg text-muted-foreground">
                Platform yang dirancang khusus untuk membantu Anda mencapai target kesehatan dengan pendekatan yang scientific dan mudah dipahami.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 space-y-6">
                <div className="text-center space-y-4">
                  <Star className="h-12 w-12 text-yellow-500 mx-auto" />
                  <h3 className="text-2xl font-bold">Rating Pengguna</h3>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-3xl font-bold">4.9/5</p>
                  <p className="text-muted-foreground">Dari 1,200+ pengguna</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 py-12">
          <div className="space-y-4">
            {user ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Selamat datang kembali, {String(user.username)}!
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Lanjutkan perjalanan kesehatan Anda dengan menggunakan fitur-fitur CaloMeter untuk mencapai target yang optimal.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Siap Memulai Perjalanan Kesehatan Anda?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat CaloMeter dalam mencapai target kesehatan mereka.
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/calorie-intake">
                    <Target className="mr-2 h-5 w-5" />
                    Hitung Kalori Harian
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/daily-tracker">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Daily Tracker
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/register">Daftar Gratis</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sudah Punya Akun?</Link>
                </Button>
              </>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}