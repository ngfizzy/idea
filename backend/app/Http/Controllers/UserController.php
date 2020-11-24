<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Hashing\BcryptHasher;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

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
class UserController extends Controller
{

    public $user;
    public $hash;

    /**
     * Create a new controller instance.
     *
     * @param User         $user User model
     * @param BcryptHasher $hash Hash helper
     */
    public function __construct(User $user, BcryptHasher $hash)
    {
        $this->user = $user;
        $this->hash = $hash;
    }

    /**
     * Controller for POST /users. Creates an new user
     *
     * @param Request $request Http Request object
     *
     * @return array currently stored user associative array
     */
    public function store(Request $request)
    {
        $this->validate(
            $request,
            [
                'firstname' => 'required',
                'lastname' => 'required',
                'username' => 'required|unique:users',
                'email' => 'required|unique:users|email',
                'password' => 'required',
            ]
        );

        $user = new User();
        $user->firstname = $request['firstname'];
        $user->lastname = $request['lastname'];
        $user->username = $request['username'];
        $user->email = $request['email'];
        $user->password = $this->hash->make($request['password']);

        $user->save();
        unset($user->password);

        return array('user' => $user);
    }

    /**
     * It returns all the users in the databse
     *
     * @return Illumnate\Http\Model
     */
    public function getAllUsers()
    {
        return $this->user->all();
    }

    /**
     * It finds one user and return it as a response
     *
     * @param int $userId Id of the user to be found
     *
     * @return Illuminate\Http\Response Response of user
     */
    public function getUser($userId)
    {
        $user = $this->user->find($userId);

        if (!$user) {
            return response()->json(
                array(
                    'error' => true,
                    'message' => 'user not found',
                    'id' => $userId,
                ),
                404
            );
        }

        return response()->json(
            array(
                'error' => false,
                'user' => $user,
            ),
            200
        );
    }

    /**
     * It returns response of user data by parsing JWT.
     *
     * @return Illuminate\Http\Response Response of current user
     */
    public function getCurrentUser()
    {

        $currentUser = JWTAuth::parseToken()->toUser();

        return response()->json(
            [
                'user' => $currentUser,
            ],
            200
        );
    }

    /**
     * It updates a user
     *
     * @param Request $request Laravel Http request
     * @param int     $userId  id of the user to be updated
     *
     * @return Illuminate\Http\Response http response of updated user
     */
    public function update(Request $request, $userId)
    {
        $loggedInUserId = JWTAuth::parseToken()->toUser()->id;
        $user = $this->user->find($userId);

        if ($user && $loggedInUserId == $userId) {
            $password = $request->input('password');

            if ($password) {
                $request->password = $this->hash->make($password);
            }

            $user->update($request->only('firstname', 'lastname', 'password'));

            return response()->json(
                [
                    'error' => false,
                    'user' => $user,
                ],
                200
            );
        }
    }

    /**
     * Deletes a user. Only a user can delete his/her account
     *
     * @param int $userId Id of user to be deleted
     *
     * @return Illuminate\Http\Response Http Response
     */
    public function delete($userId)
    {
        $loggedInUserId = JWTAuth::parseToken()->toUser()->id;
        $user = $this->user->find($userId);

        if ($user && $userId == $loggedInUserId) {
            $user->delete();
            return response()->json(
                [
                    'error' => false,
                    'message' => 'user delete successful',
                ],
                204
            );
        }

        return response()->json(
            [
                'error' => true,
                'message' => 'You can only delete your own account',
            ],
            400
        );
    }
}
