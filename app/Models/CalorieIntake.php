<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalorieIntake extends Model
{
    //
    protected $table = 'calorie_intake';

    protected $fillable = [
        'user_id',
        'activity_id',
        'height',
        'weight',
        'gender',
        'age',
        'bmr',
        'daily_calories',
        'activity_multiplier',
        'recommendation_maintain',
        'recommendation_lose',
        'recommendation_gain',
    ];

    // table calorie_intake relation to table users
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // table calorie_intake relation to table activity
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}
