# Day2. 画面の作成

環境構築が完了したら、Laravel を利用して実際に画面の作成を行っていきましょう。

## 本章の目標

- タスクリストアプリケーションの基本画面を作成する。
- Laravel におけるルートの書き方をマスターする。
- Laravel におけるフォームの書き方をマスターする。

## Laravel を使った画面開発

実際にLaravel を利用して画面制作を行っていきましょう。

Laravel で画面を作成する場合、まずはじめに `routes/web.php` を編集します。

`routes/web.php` を以下のように編集してみましょう。

```php
Route::get("/hello",function(){
    return "hello world";
});
```

`http://192.168.10.10/hello` にアクセスすると、画面に `hello world`　と表示されたでしょう。

次に以下の記述を追加してみましょう。

```php
Route::get("/hello2",function(){
    return "this is welcome page!";
});
```

今度は アドレス `/hello2` で `this is welcome page!` の表示を確認できます。

Laravel ではこのように `Route::get("画面のURL", 処理 )`  の形式でシステムの画面を追加していきます。

### HTML を表示する

実際のシステム制作では、`hello world` のような文字ではなく、HTMLを表示したいケースのほうがほとんどです。
HTML を画面に表示するには、まず `resouces/views/tasklist.blade.php` を作成し 以下のようなHTMLを記述します。

```html
<h1>hello world</h1>
```

このHTMLを画面に表示するには、以下のようなルートを記述します。

```
Route::get("/tasklist",function(){
    return view("tasklist");
});
```

return で文字列を返していた箇所を view 関数を使った処理に書き換えると 
`resources/views` フォルダからテンプレートを参照して画面に表示してくれるようになります。

`resouces/views/tasklist.blade.php` の中に任意のHTMLを記述して、
タスクリストの画面をLaravel 経由で生成出来る様に編集してみましょう。

### PHP によるページ記述

Laravel で記述したルート、画面は 通常のHTMLと異なり、PHPによるプログラミングを加えることが出来ます。

例えば、`resouces/views/tasklist.blade.php` の中で以下のように記述してみましょう。

```
<?= 10 * 10 ?>
```

`<?=  ?>` はHTML上に PHP のプログラムを出力する記法です。 画面上には計算された結果の `100` が表示されるでしょう。

画面上に日付を描画するには以下のようにします。

```
<?=date("Y-m-d")?>
```

このように PHP を使ったプログラムでは HTML の中に プログラムの記述を埋め込んで、
様々な処理結果等を出力する事ができるようになっています。

変数を使用する場合には、ルートの側で以下のようにしてデータを宣言します。

```php
<?php
Route::get("/tasklist",function(){
    return view("tasklist", [ 
        "message" => "hello world"
    ]);
});
```

ここで作成された `message` は
テンプレートファイル `resources/views/tasklist.blade.php` の中で 
PHP 変数として利用する事が出来ます。

```html
<h1><?=$message?></h1>
```

配列を使用する場合には、 `[ ]` を用いて以下のようにします。

```php
Route::get("/tasklist",function(){
    return view("tasklist", [ 
        "message" => "hello world",
        "tasks" => [
            "本を買いに行く",
            "部屋の掃除をする",
        ],
    ]);
});
```

配列を繰り返しページ内で使用する場合 `foreach` を用いて、テンプレート内で以下の様に記述出来ます。

```html
<ul>
<?php foreach($tasks as $task): ?>
    <li>{{$task}}</li>    
<?php endforeach; ?>
</ul>
```

### Blade による PHP 記述

`.blade.php` は Laravel で利用可能なPHPのテンプレートファイルです。
内部では様々なPHPの記法の他、 `@` や `{{  }}` を利用した特別な記法を利用することが可能です。

例えば、以下のような変数埋め込みの記述は

```html
<h1><?=$message?></h1>
```

Blade ファイルの中では以下のように記述することもできます。

```html
<h1>{{$message}}></h1>
```

`{{  }}` による変数出力は HTML 文字列の埋込 いわゆる`XSS脆弱性` に対応しており、
より安全なアプリケーション構築に役立ちます。

また、 `<?php foreach( ... ): ?> `　などの構文も `@` を利用して以下のように記述することが可能です。

```html
<ul>
@foreach($tasks as $task)
    <li>{{$task}}</li>    
@endforeach
</ul>
```

その他にも `@` を利用して様々な便利機能を利用することが可能なため、
ここでは Blade を利用したテンプレート記法をベースに解説を進めていきます。

## フォームの作成

タスクの投稿フォームを作成してみましょう。

`tasklist.blade.php` に以下のようなコードを組み込んでみましょう。

```html
<form action="/task" method="POST">
    @csrf
    <input type="text" name="task_name">
    <input type="submit" value="タスクの追加">
</form>
```

上記のコードで、画面上にフォームを表示することが可能です。
フォームには送信ボタンがついており、クリックするとエラーになるはずです。
(action で指定している  `/task` のルートを実装していないため。)

１行目の form の要素で `method="POST"` と指定しているように
多くの場合、フォームは POST メソドで実装します。
Laravel では POST で作成されるフォームに自動で CSRF セキュリティ対策が施されており、
これに対応するために フォーム内に `@csrf` の記述を差し込む必要があります。
ブラウザでHTML を確認してみると、内部で `input[type="hidden"]`が出力されているのが分かるでしょう。

### フォームデータの受け取り

form の action で指定した `/task` のリクエストを受け取るルートを追加するため、
`routes/web.php` に以下の記述を追加します。

```
Route::post("/task",function(){
    return "hello world";
});
```

フォームの送信先のような POST リクエストを受け取るルートは 
`Route::post` を用いて定義します。　

フォームのボタンを押すと、 hello world の画面に遷移するはずです。

フォームで入力した文字は `request()->get("task_name")` のようにして受け取ることができます。

```
Route::post("/task",function(){
    $taskName = request()->get("task_name");
    return "入力された文字は {$taskName} です。";
});
```

今回作成するのはタスクリストのアプリケーションなので、
本来はここでフォームに入力された文字を受け取ってデータベースにその内容を保存するはずです。

保存された後はもとの画面に戻したいでしょう。
ルート内で別の画面に遷移させるには`redirect`関数を利用します。

```
Route::post("/task",function(){
    $taskName = request()->get("task_name");
    // ここで$taskName をDBなりに保存する。
    return redirect("/tasklist");
});
```

### リクエストパラメータの受け取り

`request()->get("...")`は リクエスト上のパラメータを受け取るための
Laravel 上での一般的な記述方法です。

リクエストパラメータは、前述の様にフォームから送信する他、
URL上にクエリパラメータとして付与して送信することも可能です。

通常の ページでも、URL内にパラメータを埋め込むことが出来ます。

以下のルートを追加して、`/param_test?title=hogehoge` のURLにアクセスしてみましょう。

```
Route::get("/param_test",function(){
    $title = request()->get("title");
    return $title;
});
```

画面に hogehoge の文字が出力されたら成功です。

URLのhogehogeの個所を変更すれば、任意の文字を画面に出力できるはずです。

### リクエストへのアクセス

リクエストオブジェクトへのアクセス方法は、案件によって様々です。

上記のコードでは `request()` というヘルパー関数を利用した方法を紹介しましたが、
中には以下のようなコードを使用するプロジェクトもあるでしょう。

```
use Illuminate\Http\Request;

...

Route::get("/param_test",function(Request $request){
    $title = $request->get("title");
    return $title;
});
```

use 文は `web.php` の上部にひとつだけ記述します。

ルートの `function(){ ... }` の引数部分に記述した `$request` は、
`request()` と同様のものとして扱うことができます。

## ルートの作成

ルートの作成方法について、少しまとめて置きましょう。

Laravel における ルートは `web.php` にて `Route::get` , `Route::post` のようにして定義することが可能でした。

```
Route::get("/sample",function(){ ... });

Route::post("/sample/form",function(){ ... });
```

同じURL 同じメソド名で複数のルート定義を記述した場合、最後に書いたものが優先されます。
コードの管理が複雑になり、挙動がややこしくなるのでルート定義の重複は絶対に避けるようにしてください。

URL の中に `{}` の記号を入れるとその部分にあらゆる文字がマッチするようになります。

マッチした文字列は function の引数の中で取得できます。

```
Route::get("/task/{id}",function($id){ 
    return view("task",[
        "id" => $id
    ]) 
});
```

URL の中に動的なパラメータ利用したい場合には、便利な記法です。

## try! 

- `/tasklist` でアクセスした際に表示される画面に、タスクリストアプリケーション風の HTML / CSS コーディングを実装してみましょう。
- 様々な画面実装を行い、任意のURLで任意のページが表示できるようルートと画面の作成に慣れておきましょう。

## 参考

PHP の基本文法については PHPの公式ドキュメントを確認してみてください。

http://php.net/manual/ja/langref.php

Blade の各種機能については、公式ドキュメントを確認してみてください。

https://laravel.com/docs/5.7/blade
