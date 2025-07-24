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
        Schema::create('daily_tracker_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracker_id')->constrained('daily_tracker')->onDelete('cascade');
            $table->enum('food_type', ['food', 'drink']);
            $table->string('food_or_drink_name');
            $table->integer('amount_food_or_drink');
            $table->integer('calories')->nullable();
            $table->integer('water_intake')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_tracker_detail');
    }
};
