<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use Illuminate\Http\Request;

class SeanceController extends Controller
{
    // GET /api/seances — accessible par tous (visiteurs)
    public function index(Request $request)
    {
        $requete = Seance::with(['cours', 'enseignant', 'salle']);

        // Filtres optionnels
        if ($request->filled('enseignant_id')) {
            $requete->where('enseignant_id', $request->enseignant_id);
        }

        if ($request->filled('cours_id')) {
            $requete->where('cours_id', $request->cours_id);
        }

        if ($request->filled('salle_id')) {
            $requete->where('salle_id', $request->salle_id);
        }

        if ($request->filled('semaine')) {
            $requete->where('semaine', $request->semaine);
        }

        if ($request->filled('annee')) {
            $requete->where('annee', $request->annee);
        }

        if ($request->filled('jour')) {
            $requete->where('jour', $request->jour);
        }

        $listeSeances = $requete->orderBy('jour')->orderBy('heure_debut')->get();

        return response()->json([
            'donnees' => $listeSeances
        ]);
    }

    // GET /api/seances/{seance}
    public function show(Seance $seance)
    {
        return response()->json([
            'donnees' => $seance->load(['cours', 'enseignant', 'salle'])
        ]);
    }

    // POST /api/seances — admin seulement
    public function store(Request $request)
    {
        $donneesValidees = $request->validate([
            'cours_id'      => 'required|exists:cours,id',
            'enseignant_id' => 'required|exists:enseignants,id',
            'salle_id'      => 'required|exists:salles,id',
            'jour'          => 'required|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'heure_debut'   => 'required|date_format:H:i',
            'heure_fin'     => 'required|date_format:H:i|after:heure_debut',
            'semaine'       => 'required|integer|min:1|max:53',
            'annee'         => 'required|integer|min:2024',
        ]);

        // Vérifier conflit de salle
        $conflitSalle = Seance::where('salle_id', $donneesValidees['salle_id'])
            ->where('jour', $donneesValidees['jour'])
            ->where('semaine', $donneesValidees['semaine'])
            ->where('annee', $donneesValidees['annee'])
            ->where(function ($requete) use ($donneesValidees) {
                $requete->whereBetween('heure_debut', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhereBetween('heure_fin', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhere(function ($sousRequete) use ($donneesValidees) {
                            $sousRequete->where('heure_debut', '<=', $donneesValidees['heure_debut'])
                                        ->where('heure_fin', '>=', $donneesValidees['heure_fin']);
                        });
            })->exists();

        if ($conflitSalle) {
            return response()->json([
                'message' => 'Cette salle est déjà occupée sur cette plage horaire.'
            ], 422);
        }

        // Vérifier conflit enseignant
        $conflitEnseignant = Seance::where('enseignant_id', $donneesValidees['enseignant_id'])
            ->where('jour', $donneesValidees['jour'])
            ->where('semaine', $donneesValidees['semaine'])
            ->where('annee', $donneesValidees['annee'])
            ->where(function ($requete) use ($donneesValidees) {
                $requete->whereBetween('heure_debut', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhereBetween('heure_fin', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhere(function ($sousRequete) use ($donneesValidees) {
                            $sousRequete->where('heure_debut', '<=', $donneesValidees['heure_debut'])
                                        ->where('heure_fin', '>=', $donneesValidees['heure_fin']);
                        });
            })->exists();

        if ($conflitEnseignant) {
            return response()->json([
                'message' => 'Cet enseignant a déjà une séance sur cette plage horaire.'
            ], 422);
        }

        $nouvelleSeance = Seance::create($donneesValidees);

        return response()->json([
            'message' => 'Séance créée avec succès.',
            'donnees' => $nouvelleSeance->load(['cours', 'enseignant', 'salle'])
        ], 201);
    }

    // PUT /api/seances/{seance} — admin seulement
    public function update(Request $request, Seance $seance)
    {
        $donneesValidees = $request->validate([
            'cours_id'      => 'required|exists:cours,id',
            'enseignant_id' => 'required|exists:enseignants,id',
            'salle_id'      => 'required|exists:salles,id',
            'jour'          => 'required|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'heure_debut'   => 'required|date_format:H:i',
            'heure_fin'     => 'required|date_format:H:i|after:heure_debut',
            'semaine'       => 'required|integer|min:1|max:53',
            'annee'         => 'required|integer|min:2024',
        ]);

        // Vérifier conflit salle (exclure la séance en cours de modification)
        $conflitSalle = Seance::where('salle_id', $donneesValidees['salle_id'])
            ->where('jour', $donneesValidees['jour'])
            ->where('semaine', $donneesValidees['semaine'])
            ->where('annee', $donneesValidees['annee'])
            ->where('id', '!=', $seance->id)
            ->where(function ($requete) use ($donneesValidees) {
                $requete->whereBetween('heure_debut', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhereBetween('heure_fin', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhere(function ($sousRequete) use ($donneesValidees) {
                            $sousRequete->where('heure_debut', '<=', $donneesValidees['heure_debut'])
                                        ->where('heure_fin', '>=', $donneesValidees['heure_fin']);
                        });
            })->exists();

        if ($conflitSalle) {
            return response()->json([
                'message' => 'Cette salle est déjà occupée sur cette plage horaire.'
            ], 422);
        }

        // Vérifier conflit enseignant (exclure la séance en cours de modification)
        $conflitEnseignant = Seance::where('enseignant_id', $donneesValidees['enseignant_id'])
            ->where('jour', $donneesValidees['jour'])
            ->where('semaine', $donneesValidees['semaine'])
            ->where('annee', $donneesValidees['annee'])
            ->where('id', '!=', $seance->id)
            ->where(function ($requete) use ($donneesValidees) {
                $requete->whereBetween('heure_debut', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhereBetween('heure_fin', [
                            $donneesValidees['heure_debut'],
                            $donneesValidees['heure_fin']
                        ])
                        ->orWhere(function ($sousRequete) use ($donneesValidees) {
                            $sousRequete->where('heure_debut', '<=', $donneesValidees['heure_debut'])
                                        ->where('heure_fin', '>=', $donneesValidees['heure_fin']);
                        });
            })->exists();

        if ($conflitEnseignant) {
            return response()->json([
                'message' => 'Cet enseignant a déjà une séance sur cette plage horaire.'
            ], 422);
        }

        $seance->update($donneesValidees);

        return response()->json([
            'message' => 'Séance modifiée avec succès.',
            'donnees' => $seance->load(['cours', 'enseignant', 'salle'])
        ]);
    }

    // DELETE /api/seances/{seance} — admin seulement
    public function destroy(Seance $seance)
    {
        $seance->delete();

        return response()->json([
            'message' => 'Séance supprimée avec succès.'
        ]);
    }
}