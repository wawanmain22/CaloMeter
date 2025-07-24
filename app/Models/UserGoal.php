<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserGoal extends Model
{
    //
    protected $table = 'user_goal';

    protected $fillable = [
        'user_id',
        'goal_type',
        'intensity',
        'target_weight',
        'start_date',
    ];

    // table user_goal relation to table users
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
