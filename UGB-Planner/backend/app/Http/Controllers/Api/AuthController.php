<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/connexion
    public function connexion(Request $request)
    {
        $request->validate([
            'email'         => 'required|email',
            'mot_de_passe'  => 'required|string',
        ]);

        $utilisateur = User::where('email', $request->email)->first();

        if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        $jeton = $utilisateur->createToken('jeton_auth')->plainTextToken;

        return response()->json([
            'utilisateur' => $utilisateur,
            'jeton_acces' => $jeton,
            'type_jeton'  => 'Bearer',
        ]);
    }

    // POST /api/deconnexion
    public function deconnexion(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }

    // GET /api/moi
    public function moi(Request $request)
    {
        $utilisateurConnecte = $request->user();

        return response()->json([
            'donnees' => $utilisateurConnecte
        ]);
    }
}
