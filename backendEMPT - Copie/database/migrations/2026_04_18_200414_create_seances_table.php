<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('enseignant_id')->constrained('enseignants')->onDelete('cascade');
            $table->foreignId('salle_id')->constrained('salles')->onDelete('cascade');
            $table->enum('jour', ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']);
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->integer('semaine'); // numéro de semaine ex: 17
            $table->integer('annee');   // ex: 2025
            $table->timestamps();

            // Contrainte : pas deux séances sur la même plage horaire le même jour
            $table->unique(['jour', 'heure_debut', 'semaine', 'annee', 'salle_id'], 'unique_seance_salle');
            $table->unique(['jour', 'heure_debut', 'semaine', 'annee', 'enseignant_id'], 'unique_seance_enseignant');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seances');
    }
};