<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    // GET /api/cours — public
    public function index()
    {
        $listeCours = Cours::orderBy('intitule')->get();

        return response()->json([
            'donnees' => $listeCours
        ]);
    }

    // GET /api/cours/{cours} — public
    public function show(Cours $cours)
    {
        return response()->json([
            'donnees' => $cours->load('seances')
        ]);
    }

    // POST /api/cours — admin seulement
    public function store(Request $request)
    {
        $donneesValidees = $request->validate([
            'intitule'       => 'required|string|max:150|unique:cours,intitule',
            'description'    => 'nullable|string',
            'volume_horaire' => 'nullable|integer|min:0',
        ]);

        $nouveauCours = Cours::create($donneesValidees);

        return response()->json([
            'message' => 'Cours ajouté avec succès.',
            'donnees' => $nouveauCours
        ], 201);
    }

    // PUT /api/cours/{cours} — admin seulement
    public function update(Request $request, Cours $cours)
    {
        $donneesValidees = $request->validate([
            'intitule'       => 'required|string|max:150|unique:cours,intitule,' . $cours->id,
            'description'    => 'nullable|string',
            'volume_horaire' => 'nullable|integer|min:0',
        ]);

        $cours->update($donneesValidees);

        return response()->json([
            'message' => 'Cours modifié avec succès.',
            'donnees' => $cours
        ]);
    }

    // DELETE /api/cours/{cours} — admin seulement
    public function destroy(Cours $cours)
    {
        $cours->delete();

        return response()->json([
            'message' => 'Cours supprimé avec succès.'
        ]);
    }
}