<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')
        ->insert(
            [
                'firstname' => str_random(10),
                'lastname' => str_random(10),
                'username' => str_random(10),
                'email' => str_random(10).'@gmail.com',
                'password' => app('hash')->make('secret'),
                'created_at' => date("Y-m-d H:i:s"),
                'updated_at' => date("Y-m-d H:i:s")
            ]
        );
    }
}
