@extends('layout')

@section('content')
    <div class="container">
        <div class="row d-flex justify-content-center mt-5">
            <div class="col-10">
                <div class="card">
                    <div class="card-header">
                        task detail
                    </div>
                    <div class="card-body">
                        <h5 class="mb-5">
                            {{$task->name}}
                        </h5>

                        <form action="/task/delete/{{$task->id}}" method="post">
                            @csrf
                            <button type="submit" class="btn btn-danger"> <i class="fa fa-trash"></i> &nbsp;DELETE</button>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
