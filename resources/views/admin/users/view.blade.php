@extends('layouts.admin')
@include('partials/admin.users.nav', ['activeTab' => 'overview', 'user' => $user])

@section('title')
    管理用户: {{ $user->username }}
@endsection

@section('content-header')
    <h1>{{ $user->name_first }} {{ $user->name_last}}<small>{{ $user->username }}</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理</a></li>
        <li><a href="{{ route('admin.users') }}">用户</a></li>
        <li class="active">{{ $user->username }}</li>
    </ol>
@endsection

@section('content')
    @yield('users::nav')
    <div class="row">
        <form action="{{ route('admin.users.view', $user->id) }}" method="post">
            <div class="col-md-6">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">身份表示</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label for="email" class="control-label">电子邮箱地址</label>
                            <div>
                                <input type="email" name="email" value="{{ $user->email }}" class="form-control form-autocomplete-stop">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registered" class="control-label">用户名</label>
                            <div>
                                <input type="text" name="username" value="{{ $user->username }}" class="form-control form-autocomplete-stop">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registered" class="control-label">客户名字</label>
                            <div>
                                <input type="text" name="name_first" value="{{ $user->name_first }}" class="form-control form-autocomplete-stop">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registered" class="control-label">客户姓氏</label>
                            <div>
                                <input type="text" name="name_last" value="{{ $user->name_last }}" class="form-control form-autocomplete-stop">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">默认语言</label>
                            <div>
                                <select name="language" class="form-control">
                                    @foreach($languages as $key => $value)
                                        <option value="{{ $key }}" @if($user->language === $key) selected @endif>{{ $value }}</option>
                                    @endforeach
                                </select>
                                <p class="text-muted"><small>用户使用的默认语言.</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer">
                        {!! csrf_field() !!}
                        {!! method_field('PATCH') !!}
                        <input type="submit" value="更新用户" class="btn btn-primary btn-sm">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">密码</h3>
                    </div>
                    <div class="box-body">
                        <div class="alert alert-success" style="display:none;margin-bottom:10px;" id="gen_pass"></div>
                        <div class="form-group no-margin-bottom">
                            <label for="password" class="control-label">密码 <span class="field-optional"></span></label>
                            <div>
                                <input type="password" id="password" name="password" class="form-control form-autocomplete-stop">
                                <p class="text-muted small">留空以保持此用户的密码相同。如果更改密码，用户将不会收到任何通知.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">权限</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label for="root_admin" class="control-label">系统管理员</label>
                            <div>
                                <select name="root_admin" class="form-control">
                                    <option value="0">@lang('strings.no')</option>
                                    <option value="1" {{ $user->root_admin ? 'selected="selected"' : '' }}>@lang('strings.yes')</option>
                                </select>
                                <p class="text-muted"><small>将此设置为“是”为用户提供完全的管理访问权限.</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="col-xs-12">
            <div class="box box-danger">
                <div class="box-header with-border">
                    <h3 class="box-title">删除用户</h3>
                </div>
                <div class="box-body">
                    <p class="no-margin">必须没有与此帐户关联的服务器才能删除此用户.</p>
                </div>
                <div class="box-footer">
                    <form action="{{ route('admin.users.view', $user->id) }}" method="POST">
                        {!! csrf_field() !!}
                        {!! method_field('DELETE') !!}
                        <input id="delete" type="submit" class="btn btn-sm btn-danger pull-right" {{ $user->servers->count() < 1 ?: 'disabled' }} value="删除用户" />
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
