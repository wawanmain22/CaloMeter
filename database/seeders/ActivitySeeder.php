<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $activities = [
            [
                'name' => 'Sedentary',
                'description' => 'Sedikit atau tidak ada aktivitas fisik (pekerjaan kantor, duduk sepanjang hari)'
            ],
            [
                'name' => 'Lightly Active',
                'description' => 'Aktivitas ringan 1-3 hari per minggu (olahraga ringan, jalan santai)'
            ],
            [
                'name' => 'Moderately Active',
                'description' => 'Aktivitas sedang 3-5 hari per minggu (olahraga teratur, gym 3-5x seminggu)'
            ],
            [
                'name' => 'Very Active',
                'description' => 'Aktivitas berat 6-7 hari per minggu (olahraga intensif, pelatihan rutin)'
            ],
            [
                'name' => 'Extremely Active',
                'description' => 'Aktivitas sangat berat atau pekerjaan fisik (atlet, pekerja bangunan, 2x sehari olahraga)'
            ]
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}