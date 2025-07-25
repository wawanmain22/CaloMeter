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
        'name',
        'consumed_at',
        'amount',
        'unit',
        'calories',
        'water_intake',
    ];

    // No casts needed for time field - Laravel handles it as string automatically

    // table daily_tracker_detail relation to table daily_tracker
    public function dailyTracker()
    {
        return $this->belongsTo(DailyTracker::class);
    }
}
