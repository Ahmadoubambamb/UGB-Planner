<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use Illuminate\Http\Request;

class EnseignantController extends Controller
{
    // GET /api/enseignants — public
    public function index()
    {
        $listeEnseignants = Enseignant::orderBy('nom')->get();

        return response()->json([
            'donnees' => $listeEnseignants
        ]);
    }

    // GET /api/enseignants/{enseignant} — public
    public function show(Enseignant $enseignant)
    {
        return response()->json([
            'donnees' => $enseignant->load('seances.cours')
        ]);
    }

    // POST /api/enseignants — admin seulement
    public function store(Request $request)
    {
        $donneesValidees = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:enseignants,email',
            'telephone'  => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:150',
        ]);

        $nouvelEnseignant = Enseignant::create($donneesValidees);

        return response()->json([
            'message' => 'Enseignant ajouté avec succès.',
            'donnees' => $nouvelEnseignant
        ], 201);
    }

    // PUT /api/enseignants/{enseignant} — admin seulement
    public function update(Request $request, Enseignant $enseignant)
    {
        $donneesValidees = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:enseignants,email,' . $enseignant->id,
            'telephone'  => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:150',
        ]);

        $enseignant->update($donneesValidees);

        return response()->json([
            'message' => 'Enseignant modifié avec succès.',
            'donnees' => $enseignant
        ]);
    }

    // DELETE /api/enseignants/{enseignant} — admin seulement
    public function destroy(Enseignant $enseignant)
    {
        $enseignant->delete();

        return response()->json([
            'message' => 'Enseignant supprimé avec succès.'
        ]);
    }
}