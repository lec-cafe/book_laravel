<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Tasks extends Migration
{
    public function up(){
        //テーブル作成
        Schema::create('tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->boolean('is_finished')->default(false);
            $table->timestamps();
        });
    }

    public function down(){
        //テーブル削除
        Schema::dropIfExists('tasks');
    }
}
