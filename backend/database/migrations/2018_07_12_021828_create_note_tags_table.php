<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNoteTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('note_tags', function (Blueprint $table) {
            $table->integer('id')->unsigned();
            $table->integer('note_id')->unsigned()->references('id')->on('notes');
            $table->integer('tag_id')->unsigned()->references('id')->on('tags');
            $table->primary(['id', 'note_id', 'tag_id'], 'note_tags_primary');
            $table->timestamps();
        });
        Schema::table('note_tags', function (Blueprint $table) {
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
        Schema::dropIfExists('note_tags');
    }
}
