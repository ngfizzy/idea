<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Hashing\BcryptHasher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Support\Utils;

class PasswordResetController extends Controller
{
    private $user;
    private $jwt;
    private $utils;
    private $hasher;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(User $user, JWTAuth $jwt, Utils $utils, BcryptHasher $hasher)
    {
        $this->user = $user;
        $this->utils = $utils;
        $this->jwt = $jwt;
        $this->hasher = $hasher;
    }

    /**
     * It gets user by email and sends a refresh token to the email using
     * \Tymon\JWTAuth\JWTAuth::fromUser()
     *
     * @param Request $request Illuminate Http request
     *
     * @return \Illuminate\Http\Response $response Illuminate Http response
     */
    public function sendPasswordResetMail(Request $request)
    {
        // get email from url query string
        $email = $request->query('email');

        $this->setPasswordResetBaseUrl($request);

        if (!$email) {
            return response()->json(
                [
                    'error' => true,
                    'message' => 'You must provide query string \'email\'',
                ],
                400
            );
        }

        $user = $this->user->where('email', $email)->first();

        if (!$user) {
            return response()->json(
                [
                    'error' => true,
                    'message' =>
                    'It appears that this email has not been registered with
                    this platform. Please check the email and try again',
                ],
                404
            );
        }

        $expiresAt = $this->utils->now()->addMinutes(15)->timestamp;
        $token = $this->jwt->customClaims(['exp' => $expiresAt])->fromUser($user);

        Mail::to($email)
            ->send(new \App\Mail\PasswordResetMail($token));

        $errorResponse = $this->getMailingError();

        return $errorResponse ? $errorResponse : response()->json([
            'message' => 'Please check your email for instructions on how to reset your password',
        ], 200);
    }

    /**
     * @param Request $request Http Request
     *
     * @return \Illuminate\Http\Response Illuminate Http response
     */
    public function resetPassword(Request $request)
    {
        $newPassword = $request->input('password');

        if ($newPassword != $request->input('confirm')) {
            return response()->json([
                'error' => true,
                'message' => 'passsword and confirm password must match',
            ], 400);
        }

        $tokenPayload = $this->jwt->toUser($this->jwt->getToken());

        if ($tokenPayload) {
            $user = $this->user->where('email', $tokenPayload->email)->first();
            $hashedPassword = $this->hasher->make($newPassword);
            $user->update(['password' => $hashedPassword]);
        }

        return response()->json([
            'message' => 'You have reset your password successfully. You can now login with your new password',
        ]);
    }

    /**
     * It sets the based url which token is appended to
     *
     * @return Void
     */
    private function setPasswordResetBaseUrl($request)
    {
        $baseUrl = $request->query('baseurl');

        if ($baseUrl) {
            env('PASSWORD_RESET_BASE_URL', $baseUrl);
        }
    }

    /**
     * It returns an error response if an error occured while trying to send mail
     * false if no error occured
     *
     * @return \Illuminate\Http\Response|boolean
     */
    private function getMailingError()
    {
        // check if failures
        if (Mail::failures()) {
            return response([
                'error' => true,
                'message' => "For some weird reason, your reset link couldn't be sent
                Please try again.
                ",
            ], 500);
        }
        return false;
    }
}
