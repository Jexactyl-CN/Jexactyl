@extends('layouts.admin')

@section('title')
    {{ $node->name }}: Settings
@endsection

@section('content-header')
    <h1>{{ $node->name }}<small>更改节点设置.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">管理</a></li>
        <li><a href="{{ route('admin.nodes') }}">节点</a></li>
        <li><a href="{{ route('admin.nodes.view', $node->id) }}">{{ $node->name }}</a></li>
        <li class="active">节点设置</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="nav-tabs-custom nav-tabs-floating">
            <ul class="nav nav-tabs">
                <li><a href="{{ route('admin.nodes.view', $node->id) }}">关于</a></li>
                <li class="active"><a href="{{ route('admin.nodes.view.settings', $node->id) }}">节点设置</a></li>
                <li><a href="{{ route('admin.nodes.view.configuration', $node->id) }}">守护进程设置</a></li>
                <li><a href="{{ route('admin.nodes.view.allocation', $node->id) }}">资源分配</a></li>
                <li><a href="{{ route('admin.nodes.view.servers', $node->id) }}">服务器</a></li>
            </ul>
        </div>
    </div>
</div>
<form action="{{ route('admin.nodes.view.settings', $node->id) }}" method="POST">
    <div class="row">
        <div class="col-sm-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">节点设置</h3>
                </div>
                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="name" class="control-label">节点名称</label>
                        <div>
                            <input type="text" autocomplete="off" name="name" class="form-control" value="{{ old('name', $node->name) }}" />
                            <p class="text-muted"><small>字符限制: <code>a-zA-Z0-9_.-</code> 和 <code>[空格]</code> (最少 1, 最多 100 字符).</small></p>
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <label for="description" class="control-label">描述</label>
                        <div>
                            <textarea name="description" id="description" rows="4" class="form-control">{{ $node->description }}</textarea>
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <label for="name" class="control-label">地域</label>
                        <div>
                            <select name="location_id" class="form-control">
                                @foreach($locations as $location)
                                    <option value="{{ $location->id }}" {{ (old('location_id', $node->location_id) === $location->id) ? 'selected' : '' }}>{{ $location->long }} ({{ $location->short }})</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <label for="public" class="control-label">允许自动超额资源分配 <sup><a data-toggle="tooltip" data-placement="top" title="允许自动分配给该节点？">?</a></sup></label>
                        <div>
                            <input type="radio" name="public" value="1" {{ (old('public', $node->public)) ? 'checked' : '' }} id="public_1" checked> <label for="public_1" style="padding-left:5px;">是</label><br />
                            <input type="radio" name="public" value="0" {{ (old('public', $node->public)) ? '' : 'checked' }} id="public_0"> <label for="public_0" style="padding-left:5px;">否</label>
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <label for="fqdn" class="control-label">域名</label>
                        <div>
                            <input type="text" autocomplete="off" name="fqdn" class="form-control" value="{{ old('fqdn', $node->fqdn) }}" />
                        </div>
                        <p class="text-muted"><small>请输入节点域名 (例如 <code>node.example.com</code>) 用来连接至守护进程. 仅当您没有为此节点使用 SSL 时才可以使用 IP 地址.
                                <a tabindex="0" data-toggle="popover" data-trigger="focus" title="为什么需要(FQDN)域名？" data-content="为了保护您的服务器与此节点之间的通信，我们使用 SSL。我们无法为 IP 地址生成 SSL 证书，因此您需要提供(FQDN)域名。">为什么？</a>
                            </small></p>
                    </div>
                    <div class="form-group col-xs-12">
                        <label class="form-label"><span class="label label-warning"><i class="fa fa-power-off"></i></span>与面板前端以 SSL 通信</label>
                        <div>
                            <div class="radio radio-success radio-inline">
                                <input type="radio" id="pSSLTrue" value="https" name="scheme" {{ (old('scheme', $node->scheme) === 'https') ? 'checked' : '' }}>
                                <label for="pSSLTrue"> 使用 SSL 通信</label>
                            </div>
                            <div class="radio radio-danger radio-inline">
                                <input type="radio" id="pSSLFalse" value="http" name="scheme" {{ (old('scheme', $node->scheme) !== 'https') ? 'checked' : '' }}>
                                <label for="pSSLFalse"> 使用 HTTP 通信 (无 SSL)</label>
                            </div>
                        </div>
                        <p class="text-muted small">在大多数情况下，您应该选择使用 SSL 连接。如果使用 IP 地址或者您根本不想使用 SSL，请选择 HTTP 连接.</p>
                    </div>
                    <div class="form-group col-xs-12">
                        <label class="form-label"><span class="label label-warning"><i class="fa fa-power-off"></i></span> 通过代理</label>
                        <div>
                            <div class="radio radio-success radio-inline">
                                <input type="radio" id="pProxyFalse" value="0" name="behind_proxy" {{ (old('behind_proxy', $node->behind_proxy) == false) ? 'checked' : '' }}>
                                <label for="pProxyFalse"> 不通过代理 </label>
                            </div>
                            <div class="radio radio-info radio-inline">
                                <input type="radio" id="pProxyTrue" value="1" name="behind_proxy" {{ (old('behind_proxy', $node->behind_proxy) == true) ? 'checked' : '' }}>
                                <label for="pProxyTrue"> 通过代理 </label>
                            </div>
                        </div>
                        <p class="text-muted small">如果您在 Cloudflare 等代理CDN运行守护程序，请选择此选项以使守护程序在启动时跳过查找证书。</p>
                    </div>
                    <div class="form-group col-xs-12">
                        <label class="form-label"><span class="label label-warning"><i class="fa fa-wrench"></i></span> 维护模式</label>
                        <div>
                            <div class="radio radio-success radio-inline">
                                <input type="radio" id="pMaintenanceFalse" value="0" name="maintenance_mode" {{ (old('behind_proxy', $node->maintenance_mode) == false) ? 'checked' : '' }}>
                                <label for="pMaintenanceFalse"> 关闭</label>
                            </div>
                            <div class="radio radio-warning radio-inline">
                                <input type="radio" id="pMaintenanceTrue" value="1" name="maintenance_mode" {{ (old('behind_proxy', $node->maintenance_mode) == true) ? 'checked' : '' }}>
                                <label for="pMaintenanceTrue"> 开启</label>
                            </div>
                        </div>
                        <p class="text-muted small">如果节点被标记为“维护中”，用户将无法访问该节点上的服务器.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">资源分配限制</h3>
                </div>
                <div class="box-body row">
                    <div class="col-xs-12">
                        <div class="row">
                            <div class="form-group col-xs-6">
                                <label for="memory" class="control-label">总运行内存</label>
                                <div class="input-group">
                                    <input type="text" name="memory" class="form-control" data-multiplicator="true" value="{{ old('memory', $node->memory) }}"/>
                                    <span class="input-group-addon">MB</span>
                                </div>
                            </div>
                            <div class="form-group col-xs-6">
                                <label for="memory_overallocate" class="control-label">超额分配百分比</label>
                                <div class="input-group">
                                    <input type="text" name="memory_overallocate" class="form-control" value="{{ old('memory_overallocate', $node->memory_overallocate) }}"/>
                                    <span class="input-group-addon">%</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-muted small">输入此节点上可用于分配给服务器的内存总量。您还可以提供一个百分比，允许分配超过定义的内存.</p>
                    </div>
                    <div class="col-xs-12">
                        <div class="row">
                            <div class="form-group col-xs-6">
                                <label for="disk" class="control-label">总存储空间</label>
                                <div class="input-group">
                                    <input type="text" name="disk" class="form-control" data-multiplicator="true" value="{{ old('disk', $node->disk) }}"/>
                                    <span class="input-group-addon">MB</span>
                                </div>
                            </div>
                            <div class="form-group col-xs-6">
                                <label for="disk_overallocate" class="control-label">超额分配百分比</label>
                                <div class="input-group">
                                    <input type="text" name="disk_overallocate" class="form-control" value="{{ old('disk_overallocate', $node->disk_overallocate) }}"/>
                                    <span class="input-group-addon">%</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-muted small">输入此节点上可用于服务器分配存储空间总量。您还可以提供一个百分比来确定超出设置限制的存储空间量以允许.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">常规配置</h3>
                </div>
                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="disk_overallocate" class="control-label">最大网页文件上传大小</label>
                        <div class="input-group">
                            <input type="text" name="upload_size" class="form-control" value="{{ old('upload_size', $node->upload_size) }}"/>
                            <span class="input-group-addon">MB</span>
                        </div>
                        <p class="text-muted"><small>输入可以通过基于 Web 的文件管理器上传的文件的最大大小.</small></p>
                    </div>
                    <div class="col-xs-12">
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="daemonListen" class="control-label"><span class="label label-warning"><i class="fa fa-power-off"></i></span> 守护进程端口</label>
                                <div>
                                    <input type="text" name="daemonListen" class="form-control" value="{{ old('daemonListen', $node->daemonListen) }}"/>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="daemonSFTP" class="control-label"><span class="label label-warning"><i class="fa fa-power-off"></i></span> 守护进程 SFTP 端口</label>
                                <div>
                                    <input type="text" name="daemonSFTP" class="form-control" value="{{ old('daemonSFTP', $node->daemonSFTP) }}"/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <p class="text-muted"><small>守护进程运行自己的 SFTP 管理容器，不使用主物理服务器上的 SSHd 进程. <Strong>不要使用为物理服务器的 SSH 进程分配的相同端口.</strong></small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">部署</h3>
                </div>
                <div class="box-body row">
                    <div class="form-group col-xs-12">
                        <label for="deployable" class="control-label">适用于商店部署</label>
                        <div>
                            <div class="radio radio-success radio-inline">
                                <input type="radio" id="pDeployableTrue" value="1" name="deployable" {{ (old('deployable', $node->deployable)) ? 'checked' : '' }}>
                                <label for="pDeployableTrue"> 允许</label>
                            </div>
                            <div class="radio radio-danger radio-inline">
                                <input type="radio" id="pDeployableFalse" value="0" name="deployable" {{ (old('deployable', $node->deployable)) ? '' : 'checked' }}>
                                <label for="pDeployableFalse"> 不允许</label>
                            </div>
                        </div>
                        <p class="text-muted"><small>
                            此选项允许您通过 Jexactyl 商店的"服务器创建"页面来控制此节点是否可见.
                            如果设置为禁用，用户将无法在此节点上进行部署。
                        </small></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">保存设置</h3>
                </div>
                <div class="box-body row">
                    <div class="form-group col-sm-6">
                        <div>
                            <input type="checkbox" name="reset_secret" id="reset_secret" /> <label for="reset_secret" class="control-label">重置守护进程超级密钥</label>
                        </div>
                        <p class="text-muted"><small>重置守护程序超级密钥将使来自旧密钥的任何请求无效。此密钥用于守护程序上的所有敏感操作，包括服务器创建和删除。我们建议定期更改此密钥以确保安全.</small></p>
                    </div>
                </div>
                <div class="box-footer">
                    {!! method_field('PATCH') !!}
                    {!! csrf_field() !!}
                    <button type="submit" class="btn btn-primary pull-right">保存更改</button>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@section('footer-scripts')
    @parent
    <script>
    $('[data-toggle="popover"]').popover({
        placement: 'auto'
    });
    $('select[name="location_id"]').select2();
    </script>
@endsection
