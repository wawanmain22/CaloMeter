<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyTracker extends Model
{
    //
    protected $table = 'daily_tracker';

    protected $fillable = [
        'user_id',
        'date',
        'calorie_target',
        'water_target',
        'total_calorie_intake',
        'total_water_intake',
        'calorie_progress_percentage',
        'water_progress_percentage',
        'goal_type',
    ];

    protected $casts = [
        'date' => 'date',
        'calorie_progress_percentage' => 'decimal:2',
        'water_progress_percentage' => 'decimal:2',
    ];

    // table daily_tracker relation to table users
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // table daily_tracker relation to table daily_tracker_detail (one to many)
    public function details()
    {
        return $this->hasMany(DailyTrackerDetail::class, 'tracker_id');
    }
}
