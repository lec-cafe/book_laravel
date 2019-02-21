# Day4. Eloquentの利用

データベースの操作を行う場合、 SQL を利用する他に Eloquent クラスを利用する方法があります。

PHPクラスの操作になれている人にとって、Eloquent は SQL を直接記述するよりも便利なものになるでしょう。

## 本章の目標

- Eloquent を利用したデータベース操作の手法を知る。
- Eloquent を利用して、データベースからデータを取り出す。
- Eloquent を利用して、データベースにデータを書き込む。

## Eloquentの利用

Eloquent を利用するには クラスファイルの作成が必要になります。

tasks テーブルに対して、Eloquent のクラスファイルを作成する場合、
`app/Task.php` を作成して以下のように記述します。

```php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = "tasks";

}
```

php でクラスファイルを作成する上では、以下の点に注意してください。

- 拡張子は `.php` で作成する。
- クラス名とファイル名は揃える。

Eloquent で クラスを作成する際には、 `class Task extends Model` として `Model` クラスの継承を行う必要があります。

また `protected $table = "tasks";` のようにして、操作する対象のテーブルを指定します。

## Eloquent によるデータの追加

Eloquent を用いて、テーブルにデータを追加する場合、
例えば、タスクリストのフォームのコードは以下のようなかたちになります。

```
Route::post("/task",function(){
    $taskName = request()->get("task_name");
    $task = new \App\Task();
    $task->name = $taskName;
    $task->save();    
    return redirect("/tasklist");
});
```

SQL を記述すること無く、クラスの操作のみでデータが保存できるようになりました。

Eloquent には、これらのクラス操作を内部で自動的に SQL に変換して、
データベースへのSQL発行を代行してくれる、といった役割があります。

## Eloquent によるデータの取得

また、Eloquent でテーブルからデータを取得する場合、以下のようなコードになります。

```
Route::get("/tasklist",function(){
    $tasks = \App\Task::all();
    return view("tasklist", [ 
        "message" => "hello world",
        "tasks" => $tasks
    ]);
});
```

`\App\Task::all()` とすることでテーブルのデータを全て取得することが可能です。

### タスクの詳細画面を作る

前回の Try　にあったタスクの詳細画面を作る場合、どのようなコードになるでしょうか？

以下のようなルートとテンプレートが作成できれば、タスクの詳細画面が作成できるはずです。

`/task/1` や `/task/2` のように ID を利用したURL で画面を確認してみましょう。

```
Route::get("/task/{id}",function($id){
    $tasks = DB::select("select * from tasks where id = ?",[$id]);
    return view("taskdetail", [ 
        "task" => $tasks[0],
    ]);
});
```

```
<!--tasklist.blade.php-->
{{$task->name}}
```

DBクラスから取得するデータは常に配列の形式で取得できるため、
データが一つだけ必要な場合は、`$tasks[0]` のようなかたちで先頭のデータを指定する必要があります。

しかしこれでは `/task/999999` のように存在しない ID でアクセスしたときに、
エラーになってしまいます。
このエラーを改善したルートが以下の形です。

```
Route::get("/task/{id}",function($id){
    $tasks = DB::select("select * from tasks where id = ?",[$id]);
    if(count($tasks) === 0){
        return abort(404);
    }else{
        return view("taskdetail", [ 
            "task" => $tasks[0],
        ]);    
    }
});
```

if 文を使って、指定されたIDでデータが取れたときと取れなかったときの判定を行っています。

`count` は DBの結果の件数を調べることが出来る関数です。ここではこの `count` を利用してデータが取得できた・できなかったの判定を行っています。

`count($tasks)` が 0 になる、つまりデータが取得できなかった際には、
`abort(404)` をコールして 404 画面を表示するよう調整しています。

このような where 文を用いた処理を Eloquent で記述すると以下のような形になります。

```
Route::get("/task/{id}",function($id){
    $tasks = \App\Task::where("id",$id)->get();
    if(count($tasks) === 0){
        return abort(404);
    }else{
        return view("taskdetail", [ 
            "task" => $tasks[0],
        ]);    
    }
});
```

Eloquent では `where` もPHPの記法で表現します。
最後に `get()` をコールしたタイミングで、where 文で指定した内容の条件でのデータを取得可能です。

また `get()` ではなく `first()` をコールすることで、自動的に検索結果をひとつだけに絞り込んでくれる様になっています。

```
Route::get("/task/{id}",function($id){
    $task = \App\Task::where("id",$id)->first();
    if($task === null){
        return abort(404);
    }else{
        return view("taskdetail", [ 
            "task" => $task,
        ]);    
    }
});
```

`first()` で取得した場合、データが存在しなかった場合には null が返ってきます。

## データの更新、削除

データを挿入する際には、 `new \App\Task()` としていましたが、
取得した Eloquent の結果を用いてデータを更新、削除することも可能です。

以下のようにすることでタスクテーブルの name 列の値を書き換えることが可能です。

```
$task = \App\Task::where("id",$id)->first();
$task->name = "新しいタスク名";
$task->save();
```

`delete()` をコールすれば、削除することも可能です。

```
$task = \App\Task::where("id",$id)->first();
$task->delete();
```

この様にして、 Eloquent では SQL を記述すること無く PHP の記法を用いて、
様々なデータベース処理を実現することが出来るようになっています。

## try! 

- 前回の Try で作成した内容を全て Eloquent で置き換えて実装してみましょう。

## 参考

PHP クラスの記法

http://php.net/manual/ja/language.oop5.basic.php

Laravel Eloquent

https://laravel.com/docs/5.7/eloquent
