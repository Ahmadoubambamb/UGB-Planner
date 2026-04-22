<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salle extends Model
{
    protected $fillable = ['numero', 'capacite', 'type'];

    public function seances(): HasMany
    {
        return $this->hasMany(Seance::class);
    }
}