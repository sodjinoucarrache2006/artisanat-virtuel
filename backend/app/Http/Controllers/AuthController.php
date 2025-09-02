<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Create token for Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client', // Default role for registration
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Get authenticated user information
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Créer un compte fournisseur (seulement pour l'admin)
     * Le fournisseur est unique et son compte est créé directement en base de données.
     * Il n'a pas de page d'inscription sur le front-end, seulement la connexion.
     */
    public function createSupplier(Request $request)
    {
        // Vérifier que l'utilisateur connecté est admin
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $supplier = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'fournisseur', // Rôle fournisseur
        ]);

        return response()->json([
            'message' => 'Fournisseur créé avec succès',
            'supplier' => $supplier
        ], 201);
    }

    /**
     * Remove profile image
     */
    public function removeProfileImage(Request $request)
    {
        $user = $request->user();

        if ($user->profile_image) {
            // Delete the image file from storage if it exists
            $imagePath = public_path('storage/profile_images/' . $user->profile_image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }

            // Remove the profile_image from the user record
            $user->profile_image = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Image de profil supprimée avec succès',
            'user' => $user
        ]);
    }

    /**
     * Explication du fonctionnement du fournisseur :
     * - Le fournisseur est un utilisateur unique dont le compte est créé par l'administrateur via la méthode createSupplier.
     * - Il n'y a pas de page d'inscription pour le fournisseur sur le front-end.
     * - Le fournisseur se connecte simplement via la route login normale avec son email et mot de passe.
     * - Une fois connecté, il peut accéder aux fonctionnalités d'administration (gestion des produits, etc.).
     * - Le système reconnaît son rôle 'fournisseur' et lui donne les mêmes droits que l'admin.
     */
}
