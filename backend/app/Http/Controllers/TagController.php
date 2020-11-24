<?php

namespace App\Http\Controllers;

use App\Note;
use App\Tag;
use App\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TagController extends Controller
{

    private $tag;
    private $note;
    private $userId;
    private $user;
    private $currentUser;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Tag $tag, Note $note, User $user)
    {
        $this->tag = $tag;
        $this->note = $note;
        $this->user = $user;
        $currentUser = JWTAuth::parseToken()->toUser();
        $this->userId = $currentUser->id;
        $this->currentUser = $currentUser;
    }

    /**
     * Creates a tags
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $this->validate($request, ['name' => 'required']);
        $tag = $this->tag->create($request->only('name'));

        return response()->json(['tag' => $tag], 201);
    }

    /**
     * Get all tags belonging to a user
     * 
     * @return Illuminate\Http\Response all tags belonging to a user
     */
    public function getAll()
    {
        $tags = $this->user->tags()
            ->get();

        if (!$tags) {
            return response()->json([
                'error' => true,
                'message' => 'no tag found',
            ], 404);
        }

        return response()->json(['tags' => $tags], 200);
    }

    /**
     * It searches for that matches a search term
     * belonging to a particular user
     * 
     * @param Illuminate\Http\Request
     * 
     * @return Illuminate\Http\Response found
     */
    public function search(Request $request)
    {
        $this->validate($request, [
            'query' => 'required|max:150',
        ]);

        $query = $request->query()['query'];
        $tags = $this->currentUser
            ->tags()
            ->where('name', 'LIKE', '%' . $query . '%')
            ->get();

        if (sizeof($tags) < 1) {
            return response()->json([
                'error' => true,
                'message' => 'no tag found',
            ], 404);
        }   

        return response()->json(['tags' => $tags], 200);
    }
}
