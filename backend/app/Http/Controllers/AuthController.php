<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\JWTAuth;

/**
 * Controller for login
 *
 * @category Controller
 *
 * @package None
 *
 * @author Olufisayo Bamidele <andela.obamidele@andela.com>
 *
 * @license /license.md MIT
 *
 * @link None
 */
class AuthController extends Controller
{

    protected $jwt;

    /**
     * Injects Tymon\JWTAuth\JWTAuth to the controller
     *
     * @param JWTAuth $jwt JWT helper
     */
    public function __construct(JWTAuth $jwt)
    {
        $this->jwt = $jwt;
    }

    /**
     * It responds with a JWT token when endpoint is hit
     * or it responds with an error response
     *
     * @param Request $request Laravel Http Request
     *
     * @return Illuminate\Http\Response
     */
    public function postLogin(Request $request)
    {
        $this->validate(
            $request,
            [
            'email'    => 'required|email|max:255',
            'password' => 'required',
            ]
        );

        try {
            if (! $token = $this->jwt->attempt($request->only('email', 'password'))) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], 500);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], 500);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent' => $e->getMessage()], 500);
        }

        return response()->json(compact('token'));
    }
}
