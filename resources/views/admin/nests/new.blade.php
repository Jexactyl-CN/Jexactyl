@extends('layouts.admin')

@section('title')
    新预设组
@endsection

@section('content-header')
    <h1>新预设组<small>配置一个新的预设部署到所有节点.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理</a></li>
        <li><a href="{{ route('admin.nests') }}">预设组</a></li>
        <li class="active">新建</li>
    </ol>
@endsection

@section('content')
<form action="{{ route('admin.nests.new') }}" method="POST">
    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">新建预设组</h3>
                </div>
                <div class="box-body">
                    <div class="form-group">
                        <label class="control-label">名称</label>
                        <div>
                            <input type="text" name="name" class="form-control" value="{{ old('name') }}" />
                            <p class="text-muted"><small>预设组的名称.</small></p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">描述</label>
                        <div>
                            <textarea name="description" class="form-control" rows="6">{{ old('description') }}</textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Nest Visibility</label>
                        <div>
                            <select name="private" class="form-control">
                                <option selected value="0">Public</option>
                                <option value="1">Private</option>
                            </select>
                            <p class="text-muted"><small>Determines whether users can deploy to this nest.</small></p>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    {!! csrf_field() !!}
                    <button type="submit" class="btn btn-primary pull-right">保存</button>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection
