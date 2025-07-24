<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BMI extends Model
{
    protected $table = 'bmi';

    protected $fillable = [
        'user_id',
        'height',
        'weight',
        'gender',
        'age',
        'bmi_value',
        'category',
        'recommendation',
    ];

    // table bmi relation to table users
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
