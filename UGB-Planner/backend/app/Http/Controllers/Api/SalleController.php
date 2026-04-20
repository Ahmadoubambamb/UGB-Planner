<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    // GET /api/salles — public
    public function index()
    {
        $listeSalles = Salle::orderBy('numero')->get();

        return response()->json([
            'donnees' => $listeSalles
        ]);
    }

    // GET /api/salles/{salle} — public
    public function show(Salle $salle)
    {
        return response()->json([
            'donnees' => $salle
        ]);
    }

    // POST /api/salles — admin seulement
    public function store(Request $request)
    {
        $donneesValidees = $request->validate([
            'numero'   => 'required|string|max:20|unique:salles,numero',
            'capacite' => 'nullable|integer|min:1',
            'type'     => 'nullable|in:cours,labo,amphi',
        ]);

        $nouvelleSalle = Salle::create($donneesValidees);

        return response()->json([
            'message' => 'Salle ajoutée avec succès.',
            'donnees' => $nouvelleSalle
        ], 201);
    }

    // PUT /api/salles/{salle} — admin seulement
    public function update(Request $request, Salle $salle)
    {
        $donneesValidees = $request->validate([
            'numero'   => 'required|string|max:20|unique:salles,numero,' . $salle->id,
            'capacite' => 'nullable|integer|min:1',
            'type'     => 'nullable|in:cours,labo,amphi',
        ]);

        $salle->update($donneesValidees);

        return response()->json([
            'message' => 'Salle modifiée avec succès.',
            'donnees' => $salle
        ]);
    }

    // DELETE /api/salles/{salle} — admin seulement
    public function destroy(Salle $salle)
    {
        $salle->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès.'
        ]);
    }
}