# Day1. 環境構築

まずはじめに、 Laravel の開発環境作りを始めてみましょう。

## 本章の目標

- Vagrant と Homestead を使って Laravel の開発環境を構築する。
- Laravel の ソースコードから、Laravel の初期画面を表示する。
- Vagrant の記法操作を理解する。

## Laravel の環境構築

Laravel を使ってDBアプリケーション開発を始めるには、
まずPHP やDatabaseなどの環境構築が必要です。

PHP 実行環境は、Mac に標準でインストールされていますが、
バージョンが古いなどの問題もあるため、ここでは Vagrant を利用した仮想環境による環境構築を進めてみましょう。

環境構築に必要な以下2つのツールをダウンロード・インストールしてください。

- [Vagrant](https://www.vagrantup.com/) 
- [Virtual Box](https://www.virtualbox.org/)

### Homestead による環境構築

Homestead は Laravel でのアプリケーション開発を始めるために用意された、
All In One の環境構築ツールです。 Vagrant で仮想環境として動作します。

まずは以下のコマンドで必要なファイル群をダウンロードしてみましょう。

```bash
$ git clone https://github.com/laravel/homestead.git ~/Homestead
$ cd ~/Homestead
```

ファイルのダウンロードが完了したら、取得したフォルダの中に移動し、以下のコマンドを実行してください。
設定ファイル Homestead.yml が自動的に作成されます。

```bash
$ bash init.sh
```

仮想環境とローカルマシンでソースコードを動悸するためのフォルダを作成します。
ここでは`~/code` を作成して、その中にLaravel のプロジェクトを展開してみましょう。

```bash
$ mkdir ~/code
```

最後にvagrant up コマンドを実行して仮想環境を立ち上げます。

```bash
$ vagrant up
```

しばらくして仮想環境の構築が終わったら vagrant ssh コマンドを実行して仮想環境にログインします。

```bash
$ vagrant ssh
```

鍵関係のエラーが表示された場合は、`ssh-keygen -t rsa` コマンドを利用して、SSH認証鍵の作成を行ってください。

## Laravel プロジェクトの構築

`vagrant ssh` コマンドを実行して仮想環境にログイン出来たら、
コードの同期先である `/home/vagrant/code` に移動して、Laravel のプロジェクトを構築してみましょう。

```bash
# vagrant 
$ cd code
$ composer create-project --prefer-dist laravel/laravel .
```

これで 仮想環境内に Laravel のソースコードが展開されました。

仮想環境内の `code` フォルダ内に展開されたファイル群は、ホストマシンの `~/code` にも同期されて展開されているのが確認できます。

無事 Laravel のセットアップが完了すれば、 `http://192.168.10.10/` で Laravel の初期画面が確認できるはずです。

## Vagrant 環境の操作コマンド

Vagrant は仮想環境を立ち上げるためのコマンドドツールです。

仮想環境の操作は、`Vagrantfile` のあるディレクトリから、コマンド経由で実施します。

仮想環境の立ち上げには `vagrant up` コマンドを利用します。
PCの再起動等で仮想環境は自動的にシャットダウンするため、再起動語などはこれで仮想環境を再度立ち上げてください。

```bash
$ vagrant up 
```

仮想環境の終了には `vagrant halt` コマンドを利用します。
開発作業が終了した際など、仮想環境が不要な場合にはこのコマンドで環境を終了させておくと、CPUなどの負荷がかからずPCに優しいでしょう。

```bash
$ vagrant halt 
```

仮想環境の削除には `vagrant destroy` コマンドを利用します。
仮想環境が完全に不要な場合は、このコマンドで環境を削除します。環境はそれなりのHDD領域を専有するため、
完全に不要な開発環境は削除するのが良いでしょう。

また、環境内でなにかトラブルや動作不良が起きた際にも、一度削除して再度`vagrant up` を実行することで復旧するケースは多いでしょう。

```bash
$ vagrant destroy 
```


