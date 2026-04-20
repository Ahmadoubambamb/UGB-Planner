<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SeanceController;
use App\Http\Controllers\Api\EnseignantController;
use App\Http\Controllers\Api\CoursController;
use App\Http\Controllers\Api\SalleController;

// ─── Routes publiques (visiteurs) ────────────────────────────────────────────

Route::post('/connexion', [AuthController::class, 'connexion']);

// Lecture publique
Route::get('/seances',                     [SeanceController::class, 'index']);
Route::get('/seances/{seance}',            [SeanceController::class, 'show']);
Route::get('/enseignants',                 [EnseignantController::class, 'index']);
Route::get('/enseignants/{enseignant}',    [EnseignantController::class, 'show']);
Route::get('/cours',                       [CoursController::class, 'index']);
Route::get('/cours/{cours}',               [CoursController::class, 'show']);
Route::get('/salles',                      [SalleController::class, 'index']);

// ─── Routes authentifiées ─────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/deconnexion', [AuthController::class, 'deconnexion']);
    Route::get('/moi',          [AuthController::class, 'moi']);

    // ─── Routes admin uniquement ──────────────────────────────────────────────

    Route::middleware('admin')->group(function () {

        // Séances
        Route::post('/seances',            [SeanceController::class, 'store']);
        Route::put('/seances/{seance}',    [SeanceController::class, 'update']);
        Route::delete('/seances/{seance}', [SeanceController::class, 'destroy']);

        // Enseignants
        Route::post('/enseignants',                [EnseignantController::class, 'store']);
        Route::put('/enseignants/{enseignant}',    [EnseignantController::class, 'update']);
        Route::delete('/enseignants/{enseignant}', [EnseignantController::class, 'destroy']);

        // Cours
        Route::post('/cours',           [CoursController::class, 'store']);
        Route::put('/cours/{cours}',    [CoursController::class, 'update']);
        Route::delete('/cours/{cours}', [CoursController::class, 'destroy']);

        // Salles
        Route::post('/salles',           [SalleController::class, 'store']);
        Route::put('/salles/{salle}',    [SalleController::class, 'update']);
        Route::delete('/salles/{salle}', [SalleController::class, 'destroy']);
    });
});