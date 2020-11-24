<?php
namespace App\Traits;

use App\Tag;
use App\User;

trait TagOperations
{

    public function findTagByName($name)
    {
        return Tag::where('name', '=', $name)->first();
    }

    public function associateTagToUser($tagToAssociate, $userId)
    {

        if (!$userId) {
            return ['error' => true, 'message' => 'userId required'];
        }

        if (!$tagToAssociate) {
            return ['error' => true, 'message' => 'tag required as first param'];
        }

        $user = User::find($userId)->first();

        if (!$user) {
            return ['error' => true, 'message' => 'user_id does not match any record'];
        }

        $tag = $user->tags()->where('name', '=', $tagToAssociate->name)->first();

        if (!$tag) {
            $user->tags()->attach($tagToAssociate);
        }

        $tag = $tagToAssociate;

        return $tag;
    }
}
