<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Enseignant extends Model
{
    protected $fillable = ['nom', 'prenom', 'email', 'telephone', 'specialite'];

    public function seances(): HasMany
    {
        return $this->hasMany(Seance::class);
    }

    // Nom complet
    public function getNomCompletAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }
}

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Enseignant extends Model
// {
//     //
// }
