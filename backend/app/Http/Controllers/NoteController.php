<?php
namespace App\Http\Controllers;

use App\Note;
use App\Tag;
use App\Traits\TagOperations;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * It contains methods for carrying out operation on Note model
 *
 * @category Controller
 *
 * @package None
 *download phpmyadmin
 * @author Olufisayo Bamidele <fisiwizy@gmail.com>
 *
 * @license /license.md MIT
 *
 * @link None
 */
class NoteController extends Controller
{

    use TagOperations;

    public $note;
    public $user;
    public $userId;
    public $jwt;
    private $tag;

    /**
     * Inject an instance of Note model into NoteController
     *
     * @param Note $note Note model
     *
     * @return void
     */
    public function __construct(Note $note, Tag $tag)
    {
        $this->note = $note;
        $this->user = JWTAuth::parseToken()->toUser();
        $this->userId = $this->user['id'];
        $this->tag = $tag;
    }

    /**
     * It saves a note
     *
     * @param Request $request HTTP request
     *
     * @return Illuminate\Http\Response JSON response
     */
    public function store(Request $request)
    {

        $this->validate(
            $request,
            [
                'title' => 'max:150',
                'content' => 'required',
            ]
        );

        $requestBody = $request->all();
        $note = new Note();
        $note->user_id = JWTAuth::parseToken()->toUser()->id;
        $note->title = $requestBody['title'] ?? '';
        $note->content = $requestBody['content'];

        $note->save();

        return response()->json(
            [
                'note' => $note,
            ],
            201
        );
    }

    /**
     * It responds with all notes belonging to currently authenticated user
     *
     * @return Illuminate\Http\Response JSON response
     */
    public function getAllNotes()
    {
        $currentUserId = JWTAuth::parseToken()->toUser()->id;
        $notes = $this->note
            ->with('tags')
            ->orderBy('updated_at', 'desc')
            ->where('user_id', $currentUserId)
            ->get();

        if (count($notes) > 0) {
            return response()->json(
                ['notes' => $notes],
                200
            );
        }
        return response()->json(
            [
                'error' => 'no notes in the database',
            ],
            404
        );
    }

    /**
     * It responds with all a note
     *
     * @param int $noteId id of the note to be returned
     *
     * @return Illuminate\Http\Response JSON response
     */
    public function getNote($noteId)
    {
        $currentUserId = JWTAuth::parseToken()->toUser()->id;
        $note = Note::find($noteId);

        if (!$note) {
            return response()->json(
                ['error' => 'note not found'],
                404
            );
        }
        if ($currentUserId !== $note->user_id) {
            return response()
                ->json(
                    [
                        'error' =>
                        'sorry, you don\'t have permission to view this file'],
                    403
                );
        }

        return response()->json(
            [
                'note' => $note,
            ],
            200
        );
    }

    /**
     * It fetches note with limit and offset parameters
     * allowing frontend to paginate easily
     *
     * @param \Illuminate\Http\Request  Request
     *
     * @return \Illuminate\Http\Request  Response
     */
    public function getNotesByLimitAndOffset(Request $request)
    {
        $query = $request->query();

        if (!$query) {
            return response()->json(
                [
                    'error' => 'Please provide limit and offset',
                ],
                400
            );
        }

        $limit = $query['limit'] ?? null;
        $offset = $query['offset'] ?? null;

        if (!$limit && !is_numeric($limit)) {
            return response()->json(
                [
                    'error' => 'Limit is required and should be a number',
                ],
                400
            );
        }

        if ($offset && !is_numeric($offset)) {
            return response()->json(
                [
                    'error' => "If you're providing an offset, it should be a number",
                ],
                400
            );
        }

        $count = $this->note->find($this->userId)->count();
        $notes = $this->note->find($this->userId)->skip($offset)->take($limit)->get();
        $page = [
            'notesCount' => $count,
            'currentPage' => $offset / $limit,
            'totalPages' => $count / $limit,
            'notes' => $notes,
        ];

        return response()->json($page, 200);
    }

    /**
     * It responds with all a note
     *
     * @param Request $request Laravel Http Request
     * @param int     $noteId  id of the note to be returned
     *
     * @return Illuminate\Http\Response JSON response
     */
    public function update(Request $request, $noteId)
    {
        $currentUserId = JWTAuth::parseToken()->toUser()->id;
        $note = Note::find($noteId);

        if ($currentUserId !== $note->user_id) {
            return response()->json(
                [
                    'error' => 'sorry, you don\'t have permission to view this file',
                ],
                403
            );
        }

        if ($note) {
            $note->update($request->only(['title', 'content']));

            return response()->json(
                [
                    'note' => $note,
                ],
                200
            );
        }
        return response()->json(
            [
                'error' => true,
                'message' => 'something went wrong',
            ],
            400
        );
    }

    /**
     * It deletes a note that belongs to the currently logged in user
     *
     * @param int $noteId Id of the note to be deleted
     *
     * @return Illuminate\Http\Response Http response of success message or error
     */
    public function delete($noteId)
    {
        $currentUserId = JWTAuth::parseToken()->toUser()->id;
        $note = $this->note->find($noteId);

        if ($currentUserId !== $note->user_id) {
            return response()
                ->json(
                    [
                        'error' =>
                        'sorry, you don\'t have permission to view this file'],
                    403
                );
        }

        if ($note) {
            $note->delete();
            return response()->json(
                [
                    'message' => 'note deleted successfully',
                ],
                204
            );
        }

        return $this->response->json(
            [
                'error' => true,
                'message' => 'something went wrong',
            ],
            400
        );
    }

    /**
     * This deletes multiple notes
     *
     * @param string $noteIds Ids of notes
     *
     * @return Illuminate\Http\Response Http response of success message or error
     */
    public function bulkDelete($noteIds)
    {
        $currentUserId = JWTAuth::parseToken()->toUser()->id;
        $ids = explode(',', $noteIds);
        $foundNotes = $this->note->whereIn('id', $ids)
            ->where('user_id', $currentUserId)->get()->count();

        if ($foundNotes > 0) {
            $this->note->destroy($ids);

            return response()->json(
                [
                    'message' => 'delete successful',
                ]
            );
        }

        return response()->json(
            [
                'error' => true,
                'message' => 'could not delete the notes',
            ],
            404
        );
    }

    /**
     * This searches a note by title using query param 'query'
     *
     * @param  \Illuminate\Http\Request Request
     *
     * @return \Illuminate\Http\Respnse Found note
     */
    public function search(Request $request)
    {
        $query = $request->query();

        if (!isset($query['query'])) {
            return response()->json(['error' => true, 'you need to provide a param "query"'], 400);
        }

        $notes =  $this->note->searchForNotesAndFilter($query, $this->userId)->get();

        if (count($notes) > 0) {
            return response()->json(['notes' => $notes], 200);
        }

        return response()->json(['error' => true, 'message' => 'not found'], 404);
    }

    public function addTag(Request $request, $noteId)
    {
        $this->validate($request, [
            'tag' => 'required:150',
        ]);

        $note = $this->note->where('user_id', '=', $this->userId)
            ->where('id', '=', $noteId)
            ->with('tags')
            ->first();

        if (!$note) {
            return response()->json([
                'error' => true,
                'message' => 'note not found',
            ], 404);
        }

        $tag = $this->tag->firstOrCreate(['name' => $request->input('tag')]);

        if (!$note->tags->contains($tag->id)) {
            $note->tags()->attach($tag['id']);
        }

        $this->associateTagToUser($tag, $this->userId);
        return response()->json([
            'tags' => $note->tags()->get(),
        ], 200);
    }

    /**
     * This returns tags for a user's note
     * 
     * @param string id of the note to fetch
     * 
     * @return Illuminate\Http\Response
     */
    public function fetchNoteTags($noteId) {
       $note = $this->user->notes()
            ->with('tags')
            ->where('id', '=', $noteId)
            ->first();

        if(!$note) {
            return response()->json([
                'error' => true,
                'message' => "the note who's tag you're trying to find must have been deleted"
            ], 404);
        }

        return response()->json([
            'tags' => $note->tags
        ]);
    }


    /**
     * It removes a tag from a note
     * 
     * @param Integer Id of the note whose tag is to be removed
     * @param Integer Id of the tag to be removed
     * 
     * @return \Illuminate\Http\Response
     */
    public function removeTag($noteId, $tagId) {
        $note = $this->user->notes()
            ->find($noteId);

        if(!$note) {
            return response()
                ->json([
                    'error' => true,
                    'message' => 'note not found'
                ]);
        }

        $note->tags()->detach($tagId);

        return response()->json([
            'tags'=> $note->tags()->get()
        ]);
    }
}
