<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyTrackerDetail extends Model
{
    //
    protected $table = 'daily_tracker_detail';

    protected $fillable = [
        'tracker_id',
        'food_type',
        'food_or_drink_name',
        'amount_food_or_drink',
        'calories',
        'water_intake',
    ];

    // table daily_tracker_detail relation to table daily_tracker
    public function dailyTracker()
    {
        return $this->belongsTo(DailyTracker::class);
    }
}
