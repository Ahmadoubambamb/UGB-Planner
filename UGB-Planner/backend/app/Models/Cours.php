<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cours extends Model
{
    protected $fillable = ['intitule', 'description', 'volume_horaire'];

    public function seances(): HasMany
    {
        return $this->hasMany(Seance::class);
    }
}
