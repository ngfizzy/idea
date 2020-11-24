<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_tags', function (Blueprint $table) {
            $table->integer('id')->unsigned();
            $table->integer('user_id')
                ->references('id')->on('users');
            $table->integer('tag_id')
                ->refrences('id')
                ->on('tags');
            $table->primary(['id', 'user_id', 'tag_id'], 'note_tags_primary');
            $table->timestamps();
        });
        Schema::table('user_tags', function (Blueprint $table) {
            $table->integer('id', true, true)->change();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_tags');
    }
}
