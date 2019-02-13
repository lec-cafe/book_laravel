# Day6. バリデーション

画面が整ってきたところで、次はバリデーションを実施して、
不正な値入力に耐えられるシステムを構築してみましょう。

## 本章の目標

- バリデーションを通じて入力値の画面制御が出来るようにしましょう。


## バリデーションの実施

これまで作成してきたタスクリストはそのままでも動かすことはできますが、
空の文字を入れたときなどにエラーとなってしまいます。

入力データが適切な値であるかチェックする処理をバリデーションと呼び、
バリデーションを行うことで、データベースへ不正な値が入ることを防いだり、
適切な値を入力するよう促したりすることが出来るようになっています。

簡単なバリデーションの実装例を見てみましょう。

```
// フォームを処理するルート
Route::post("/task",function(){
    $rules = [
        "task_name" => ["required","max:10"]
    ];
    $val = validator(request()->all(),$rules);

    if($val->fails()){
        session()->flash("OLD_INPUTS",request()->all());
        session()->flash("FORM_ERRORS",$val->errors());
        return redirect("/tasklist");
    }
    
    $taskName = request()->get("task_name");
    DB::insert("insert into tasks (name) values (?)",[$taskName]);
    return redirect("/tasklist");
});
```

フォームの処理のルート内で、
DBへのデータ格納前にバリデーションの処理が挿入されています。

```
    $rules = [
        "task_name" => ["required","max:10"]
    ];
    $val = validator(request()->all(),$rules);
```

`validator` は バリデーションを実施するための Laravel 関数です。

第一引数にはリクエストの値を入れます。
`request()->all()` はフォームから送信された全ての値を取得する記述になります。

第二引数にはバリデーションのルールを設定します。

バリデーションのルールは、Laravel 側で用意されている様々なルールが利用可能です。

- `required` : 値の入力を必須にする
- `max:{n}` : {n} 文字以上の入力を拒否とする。
- `min:{n}` : {n} 文字以下の入力を拒否する。
- `email` : email 形式でない入力を拒否する。
- `url` : URL 形式でない入力を拒否する。

その他にも様々な入力用のルールがあります。詳細は公式サイトからも確認可能です。

https://laravel.com/docs/5.7/validation#available-validation-rules

ルールとデータを設定したら、`fails()` メソドを利用して、バリデーションのチェックを行いましょう。

```
    if($val->fails()){
        session()->flash("OLD_INPUTS",request()->all());
        session()->flash("FORM_ERRORS",$val->errors());
        return redirect("/tasklist");
    }
```

`$val->fails()` は バリデーション検査でエラーがあった際に、`false` を返します。

エラーが発生した際は、DBへの格納処理を行わず元の入力画面に戻し、エラーメッセージを表示してあげるのが一般的です。

元の画面に、エラーの状態や、以前の入力内容を通知するために、
ここではセッションと呼ばれる一時保存用の領域を使用しています。

`session()->flash()` は一時的なデータを保存する際に使われるセッションへの保存処理です。
`session()->flash()` により保存されたデータは次回の画面表示まで有効で、次回移行の画面表示で自動的にデータはクリアされます。

第一引数に保存するデータの名前、第二引数に保存するデータを指定します。

```
        session()->flash("OLD_INPUTS",request()->all());
        session()->flash("FORM_ERRORS",$val->errors());
```

エラーメッセージの内容は、 `$val->errors()` の形式で取得することが可能です。

ここでは、 `OLD_INPUTS` という名前でフォームの入力値を、
`FORM_ERRORS` という名前で エラーメッセージの内容を保存しています。

## バリデーションの表示

バリデーションを実施することで、
フォームを空で入力してもエラー画面は表示されれず、DBへの格納処理も行われなくなります。
また、↑ のコードのように `max:10` のルールを設定した場合には、10文字以上の入力もブロックされるようになります。

DBへの格納にフィルタリングを実施することには成功しましたが、このままでは、なぜエラーとなっているのか、
まだよくわからない状態です。

バリデーションの結果を画面に反映するには、以下のようなかたちで、フォーム側のルートでも調整が必要です。

```
// タスク一覧画面のルート
Route::get('/tasklist', function () {
    $tasks = \App\Task::all();
    return view('tasklist',[
        "tasks" => $tasks,
        "errors" => session()->get("FORM_ERRORS"),
        "inputs" => session()->get("OLD_INPUTS"),
    ]);
});
```

`session()->get("...")` は セッションに保存されたデータを取得する処理です。
`session()->flash("...", ... )` で保存された過去の入力値やエラーメッセージを、
`session()->get("...")`で取得してテンプレートに渡しています。

この `errors` や `inputs` の値は、セッションから取得するデータのため、
セッションにデータが保存されていない時には `null` が格納される点には注意しましょう。

テンプレートの側では以下のように記述します。

```
<div>
    @if ($errors)
        <div>
            <ul>
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    <form action="/task" method="POST">
        @csrf
        @if($inputs)
        <input type="text" name="task_name" value="{{$inputs["task_name"]}}">
        @else
        <input type="text" name="task_name" value="">
        @endif
        <button type="submit" >Add Task</button>
    </form>
</div>
```

前述の通り、 `$errors` や `$inputs` は `null` が格納されるケースも考えられるため、
エラーが起きたケースとそうでないケースを `@if` で囲んで記述しています。

また エラーの中身を取得する際には、

```
@foreach($errors->all() as $error)
    <li>{{ $error }}</li>
@endforeach
```

のようにして `@errors->all()` で取り出したエラー一覧を foreach にかけて 一覧出力します。

これでバリデーションの処理は完了です。

### エラーメッセージの日本語化

エラーメッセージが画面に表示されるようになりましたが、
エラーメッセージは英語で表示されており、日本人向けのシステムを制作する上ではとても不親切な状態です。

エラーメッセージの定義ファイルは `resources/lang/en/validation.php` に格納されており、
これを編集することでエラーメッセージをカスタマイズすることができます。

```
    ...
    'required' => ':attribute は必須です。',
    ...
```

全てを翻訳するのが手間な場合、
インターネット上でこれらファイルを翻訳したものを公開してくれている人もいるため、
それらを利用するという手もあります。

「laravel validation 日本語」 などで検索して、内容を確認してみましょう。

また項目名は、 form の name 属性の値がそのまま利用されます。
`resources/lang/en/validation.php`  の下の方にある attributes のセクションに、
フォーム名の翻訳を追加することで、項目の名称も日本語で表示することが可能です。

```
    'attributes' => [
        "task_name" => "タスク名"
    ],
```


