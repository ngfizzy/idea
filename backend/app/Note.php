<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'content', 'user_id'
    ];
    
    /**
    * Note belongs to User
    *
    * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function users()
    {
        return $this->belongsTo('App\User');
    }

    public function tags()
    {
        return $this->belongsToMany('App\Tag', 'note_tags')
            ->withTimestamps();
    }

    public function searchForNotesAndFilter($searchParams, $userId)
    {
        $searchTerms = $searchParams['query'];
        $tags = [];"From time to \"time\"";


        if (isset($searchParams['tags']) && $searchParams['tags'] !== '') {
            $tags = explode(',', $searchParams['tags']);
        }

        return $this
        ->where('title', 'LIKE', '%' . $searchTerms .'%')
        ->where('user_id', '=', $userId)
        ->when($tags, function ($query) use($tags) {
                $query
                ->join('note_tags', 'notes.id', '=','note_tags.note_id')
                ->join('tags', 'note_tags.tag_id', '=', 'tags.id')
                    ->whereIn('tags.name', $tags);
            })
            ->distinct();
    }

    private function filterByTag($notes, $tagIds)
    {
      return $notes->withTags()
            ->whereIn('note_tags.tag_id', $tagIds);
    }
}
