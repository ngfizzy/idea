<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Note;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            'UsersTableSeeder',
            'NotesTableSeeder'
        ]);

      
    }
}
