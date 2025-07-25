<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('calorie_intake', function (Blueprint $table) {
            // Tambah kolom untuk hasil perhitungan
            $table->decimal('bmr', 8, 2)->after('age'); // Basal Metabolic Rate
            $table->decimal('daily_calories', 8, 2)->after('bmr'); // Total daily calorie needs
            $table->decimal('activity_multiplier', 4, 3)->after('daily_calories'); // Activity multiplier (1.2 - 1.9)
            $table->text('recommendation_maintain')->after('activity_multiplier'); // Rekomendasi maintain weight
            $table->text('recommendation_lose')->after('recommendation_maintain'); // Rekomendasi lose weight  
            $table->text('recommendation_gain')->after('recommendation_lose'); // Rekomendasi gain weight
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('calorie_intake', function (Blueprint $table) {
            $table->dropColumn([
                'bmr',
                'daily_calories', 
                'activity_multiplier',
                'recommendation_maintain',
                'recommendation_lose',
                'recommendation_gain'
            ]);
        });
    }
};