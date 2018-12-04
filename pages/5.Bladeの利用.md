# Day5. Bladeの利用

データベースと結合して、システム的な動きが伴ってきたところで、
Blade を利用した複雑な画面構成の管理を進めてみましょう。

## 本章の目標

- Blade を利用してテンプレートの管理を行う手法を知る。
- Blade によるテンプレート階層化の仕組みを知る
- Blade によるテンプレート分割の仕組みを知る

## テンプレートの階層化

Blade を利用することで HTML/PHP のテンプレートを階層化することが出来るようになります。

例えば 以下のようなかたちで `resources/views/layout.blade.php` を作成してみましょう。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Laravel Quickstart - Basic</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
@yield('content')
</body>
</html>
```

このレイアウトファイルはテンプレートの雛形になるものです。
全てのページで head などを共通化したい場合など、このようなレイアウトファイルを利用するのが便利でしょう。

このレイアウトファイルを利用してテンプレートを記述する場合、以下のようなかたちの blade ファイルが出来上がります。

```
@extends('layout')

@section('content')
    <div class="container">
        ...
    </div>
@endsection
```

テンプレートを利用する blade ファイルでは、 `@extends('layout')`のようにして、
利用するレイアウトファイル名をまず指定します。
                          
次に`@section('content')` でセクションごとの定義を行います。

作成されたセクションは、親のレイアウトで `@yield('content')` のように記述された箇所に出力される仕組みになっています。

## テンプレートの分割

階層化の他にテンプレートの分割も試してみましょう。

ヘッダーやフッター、バナーなど、それだけで人まとまりになる HTML のコンテンツ等は、
別のテンプレートファイルに分割できると便利です。

例えば、ヘッダー用の テンプレートとして、次のようなファイルを 作成してみましょう。

```
<div class="container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/tasklist">Tasklist</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
    </nav>
</div>
```

このファイルを `resources/views/header.blade.php` という名前で作成した場合、
それぞれのテンプレートファイルから以下のように記述して、このテンプレートファイルを呼び出すことができます。

```
@include("navbar")
```

ただし、分割し部品として利用するテンプレートと、 
ルートから`view` 関数で呼び出されるテンプレートとは区別がついた方がいいでしょう。

上記のファイルを、`resources/views/components/header.blade.php` として
フォルダに切り出して保存したとしても、以下のようなかたちで呼び出すことが可能です。

```
@include("components.navbar")
```

## Blade の制御構文

Blade では `@foreach` を利用してリスト形式のデータを繰り返し表示することができます。

例えば以下のようなルートが有る時、

```
Route::get("/tasklist",function(){
    $tasks = DB::select("select * from tasks");
    return view("tasklist", [ 
        "message" => "hello world",
        "tasks" => $tasks
    ]);
});
```

テンプレートに渡された `$tasks` 変数は以下のようにして展開できます。

```html
<ul>
@foreach($tasks as $task)
    <li> {{$task->name}}</li>    
@endforeach
</ul>
```

また `@if` を利用して条件分岐を行うことも可能です。
0/1 が入る `is_finished` 列を利用して、完了・未完了のラベルを実装するには以下のようなかたちにすると良いでしょう。

```
<ul>
@foreach($tasks as $task)
    <li> 
        {{$task->name}}
        @if($task->is_finished)
            <span>完了</span>            
        @else
            <span>未完了</span>            
        @endif
    </li>    
@endforeach
</ul>
```

## try! 

- 様々な画面部品をコンポーネント化して、ファイルを分割してみましょう。

## 参考

その他、Blade の各種機能については、公式ドキュメントを確認してみてください。

https://laravel.com/docs/5.7/blade
