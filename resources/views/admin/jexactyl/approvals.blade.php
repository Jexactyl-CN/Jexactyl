@extends('layouts.admin')
@include('partials/admin.jexactyl.nav', ['activeTab' => 'approvals'])

@section('title')
    用户审批
@endsection

@section('content-header')
    <h1>用户审批<small>允许或拒绝创建帐户的请求。</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理</a></li>
        <li class="active">Jexactyl</li>
    </ol>
@endsection

@section('content')
    @yield('jexactyl::nav')
    <form action="{{ route('admin.jexactyl.approvals') }}" method="POST">
        <div class="row">
            <div class="col-xs-12">
                <div class="box
                    @if($enabled == 'true')
                        box-success
                    @else
                        box-danger
                    @endif
                ">
                    <div class="box-header with-border">
                        <i class="fa fa-users"></i>
                        <h3 class="box-title">审批系统 <small>决定是启用还是禁用审批系统。</small></h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-md-4">
                                <label class="control-label">启用</label>
                                <div>
                                    <select name="enabled" class="form-control">
                                        <option @if ($enabled == 'false') selected @endif value="false">禁用</option>
                                        <option @if ($enabled == 'true') selected @endif value="true">启用</option>
                                    </select>
                                    <p class="text-muted"><small>确定用户是否必须由管理员批准才能使用面板。</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box box-footer">
                        {!! csrf_field() !!}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-default pull-right">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-success">
                <div class="box-header with-border">
                    <i class="fa fa-list"></i>
                    <h3 class="box-title">审批申请 <small>允许或拒绝创建帐户的请求。</small></h3>
                 </div>
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <tbody>
                            <tr>
                                <th>用户 ID</th>
                                <th>邮箱</th>
                                <th>用户名</th>
                                <th>已注册</th>
                                <th></th>
                                <th></th>
                            </tr>
                            @foreach ($users as $user)
                                <tr>
                                    <td>
                                        <code>{{ $user->id }}</code>
                                    </td>
                                    <td>
                                        {{ $user->email }}
                                    </td>
                                    <td>
                                        <code>{{ $user->username }}</code> ({{ $user->name_first }} {{ $user->name_last }})
                                    </td>
                                    <td>
                                        {{ $user->created_at->diffForHumans() }}
                                    </td>
                                    <td class="text-center">
                                        <form id="approveform" action="{{ route('admin.jexactyl.approvals.approve', $user->id) }}" method="POST">
                                            {!! csrf_field() !!}
                                            <button id="approvalApproveBtn" class="btn btn-xs btn-default">
                                                <i class="fa fa-check text-success"></i>
                                            </button>
                                        </form>
                                    </td>
                                    <td class="text-center">
                                        <form id="denyform" action="{{ route('admin.jexactyl.approvals.deny', $user->id) }}" method="POST">
                                            {!! csrf_field() !!}
                                            <button id="approvalDenyBtn" class="btn btn-xs btn-default">
                                                <i class="fa fa-times text-danger"></i>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
    $('#approvalDenyBtn').on('click', function (event) {
        event.preventDefault();

        swal({
            type: 'error',
            title: '拒绝这个请求？',
            text: '这将导致该用户立即从面板中删除。',
            showCancelButton: true,
            confirmButtonText: '拒绝',
            confirmButtonColor: 'red',
            closeOnConfirm: false
        }, function () {
            $('#denyform').submit()
        });
    });

    $('#approvalApproveBtn').on('click', function (event) {
        event.preventDefault();

        swal({
            type: 'success',
            title: '批准此请求？',
            text: '该用户将立即获得对面板的访问权限。',
            showCancelButton: true,
            confirmButtonText: '批准',
            confirmButtonColor: 'green',
            closeOnConfirm: false
        }, function () {
            $('#approveform').submit()
        });
    });
    </script>
@endsection
