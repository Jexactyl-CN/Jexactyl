<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use Illuminate\Http\Response;
use Pterodactyl\Models\Server;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Services\Servers\ServerEditService;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Requests\Api\Client\Servers\EditServerRequest;

class EditController extends ClientApiController
{
    /**
     * PowerController constructor.
     */
    public function __construct(private ServerEditService $editService)
    {
        parent::__construct();
    }

    /**
     * Edit a server's resource limits.
     *
     * @throws DisplayException
     */
    public function index(EditServerRequest $request, Server $server): JsonResponse
    {
        if ($this->settings->get('jexactyl::renewal:editing') != 'true') {
            throw new DisplayException('服务器编辑当前处于禁用状态。');
        }

        if ($request->user()->id != $server->owner_id) {
            throw new DisplayException('你并不拥有这个服务器，所以你不能编辑资源。');
        }

        $this->editService->handle($request, $server);

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
