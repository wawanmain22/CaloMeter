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
        // Improve daily_tracker table
        Schema::table('daily_tracker', function (Blueprint $table) {
            // Add unique constraint for user_id + date (one tracker per user per day)
            $table->unique(['user_id', 'date'], 'unique_user_date');
            
            // Add default values
            $table->integer('total_calorie_intake')->default(0)->change();
            $table->integer('total_water_intake')->default(0)->change();
            
            // Add progress percentage columns
            $table->decimal('calorie_progress_percentage', 5, 2)->default(0)->after('total_calorie_intake');
            $table->decimal('water_progress_percentage', 5, 2)->default(0)->after('total_water_intake');
        });

        // Improve daily_tracker_detail table
        Schema::table('daily_tracker_detail', function (Blueprint $table) {
            // Add time field for when the food/drink was consumed
            $table->time('consumed_at')->default('00:00:00')->after('food_or_drink_name');
            
            // Add unit field for amount (gram, ml, cup, etc)
            $table->string('unit', 20)->default('gram')->after('amount_food_or_drink');
            
            // Improve field names and types
            $table->string('name')->after('food_type'); // Better field name
            $table->dropColumn('food_or_drink_name'); // Remove old field
            
            $table->integer('amount')->after('name'); // Better field name  
            $table->dropColumn('amount_food_or_drink'); // Remove old field
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('daily_tracker', function (Blueprint $table) {
            $table->dropUnique('unique_user_date');
            $table->dropColumn(['calorie_progress_percentage', 'water_progress_percentage']);
        });

        Schema::table('daily_tracker_detail', function (Blueprint $table) {
            $table->dropColumn(['consumed_at', 'unit', 'name', 'amount']);
            $table->string('food_or_drink_name')->after('food_type');
            $table->integer('amount_food_or_drink')->after('food_or_drink_name');
        });
    }
};