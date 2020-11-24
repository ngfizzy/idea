<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name'];

    public function notes()
    {
        return $this->belongsToMany('App\Note', 'note_tags');
    }

    public function users()
    {
        return $this->belongsToMany('App\User', 'user_tags')
            ->withTimestamps();
    }
}
