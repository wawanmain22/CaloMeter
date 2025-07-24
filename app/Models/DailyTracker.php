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
        'goal_type',
    ];

    // table daily_tracker relation to table users
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
