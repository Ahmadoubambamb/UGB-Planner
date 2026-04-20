<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Enseignant;
use App\Models\Cours;
use App\Models\Salle;
use App\Models\Seance;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Compte administrateur (CSP)
        $administrateur = User::create([
            'name'     => 'Chef Service Pédagogique',
            'email'    => 'admin@eduplan.sn',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        // Enseignants
        $enseignantDiallo = Enseignant::create([
            'nom'        => 'Diallo',
            'prenom'     => 'Amadou',
            'email'      => 'a.diallo@univ.sn',
            'telephone'  => '771234567',
            'specialite' => 'Mathématiques',
        ]);

        $enseignantSow = Enseignant::create([
            'nom'        => 'Sow',
            'prenom'     => 'Fatou',
            'email'      => 'f.sow@univ.sn',
            'telephone'  => '772345678',
            'specialite' => 'Algorithmique',
        ]);

        $enseignantBa = Enseignant::create([
            'nom'        => 'Ba',
            'prenom'     => 'Moussa',
            'email'      => 'm.ba@univ.sn',
            'telephone'  => '773456789',
            'specialite' => 'Réseaux',
        ]);

        $enseignantNdiaye = Enseignant::create([
            'nom'        => 'Ndiaye',
            'prenom'     => 'Aissatou',
            'email'      => 'a.ndiaye@univ.sn',
            'telephone'  => '774567890',
            'specialite' => 'Anglais Technique',
        ]);

        // Cours
        $coursMaths = Cours::create([
            'intitule'       => 'Mathématiques',
            'description'    => 'Cours de mathématiques appliquées',
            'volume_horaire' => 60,
        ]);

        $coursAlgo = Cours::create([
            'intitule'       => 'Algorithmique',
            'description'    => 'Structures de données et algorithmes',
            'volume_horaire' => 45,
        ]);

        $coursBdd = Cours::create([
            'intitule'       => 'Base de données',
            'description'    => 'Conception et gestion des bases de données',
            'volume_horaire' => 45,
        ]);

        $coursReseaux = Cours::create([
            'intitule'       => 'Réseaux',
            'description'    => 'Architecture et protocoles réseaux',
            'volume_horaire' => 30,
        ]);

        $coursAnglais = Cours::create([
            'intitule'       => 'Anglais technique',
            'description'    => 'Communication technique en anglais',
            'volume_horaire' => 30,
        ]);

        // Salles
        $salleA1   = Salle::create(['numero' => 'A1',   'capacite' => 40, 'type' => 'cours']);
        $salleB2   = Salle::create(['numero' => 'B2',   'capacite' => 35, 'type' => 'cours']);
        $salleLabo = Salle::create(['numero' => 'Labo', 'capacite' => 25, 'type' => 'labo']);
        $salleA3   = Salle::create(['numero' => 'A3',   'capacite' => 30, 'type' => 'cours']);

        // Séances — Semaine 17 / 2025
        $listeSeances = [
            ['cours_id' => $coursMaths->id,   'enseignant_id' => $enseignantDiallo->id,  'salle_id' => $salleA1->id,   'jour' => 'Lundi',    'heure_debut' => '08:00', 'heure_fin' => '10:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursAlgo->id,    'enseignant_id' => $enseignantSow->id,     'salle_id' => $salleB2->id,   'jour' => 'Lundi',    'heure_debut' => '14:00', 'heure_fin' => '16:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursBdd->id,     'enseignant_id' => $enseignantDiallo->id,  'salle_id' => $salleLabo->id, 'jour' => 'Mardi',    'heure_debut' => '10:00', 'heure_fin' => '12:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursReseaux->id, 'enseignant_id' => $enseignantBa->id,      'salle_id' => $salleLabo->id, 'jour' => 'Mercredi', 'heure_debut' => '08:00', 'heure_fin' => '10:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursAnglais->id, 'enseignant_id' => $enseignantNdiaye->id,  'salle_id' => $salleA3->id,   'jour' => 'Mercredi', 'heure_debut' => '14:00', 'heure_fin' => '16:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursMaths->id,   'enseignant_id' => $enseignantDiallo->id,  'salle_id' => $salleA1->id,   'jour' => 'Jeudi',    'heure_debut' => '10:00', 'heure_fin' => '12:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursBdd->id,     'enseignant_id' => $enseignantDiallo->id,  'salle_id' => $salleLabo->id, 'jour' => 'Jeudi',    'heure_debut' => '14:00', 'heure_fin' => '16:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursAlgo->id,    'enseignant_id' => $enseignantSow->id,     'salle_id' => $salleB2->id,   'jour' => 'Vendredi', 'heure_debut' => '08:00', 'heure_fin' => '10:00', 'semaine' => 17, 'annee' => 2025],
            ['cours_id' => $coursAnglais->id, 'enseignant_id' => $enseignantNdiaye->id,  'salle_id' => $salleA3->id,   'jour' => 'Vendredi', 'heure_debut' => '16:00', 'heure_fin' => '18:00', 'semaine' => 17, 'annee' => 2025],
        ];

        foreach ($listeSeances as $donneesSeance) {
            Seance::create($donneesSeance);
        }
    }
}