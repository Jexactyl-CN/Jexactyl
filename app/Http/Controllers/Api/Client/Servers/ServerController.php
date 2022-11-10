<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use Illuminate\Http\Response;
use Pterodactyl\Models\Server;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Services\Servers\ServerDeletionService;
use Pterodactyl\Transformers\Api\Client\ServerTransformer;
use Pterodactyl\Services\Servers\GetUserPermissionsService;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Requests\Api\Client\Servers\GetServerRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\DeleteServerRequest;
use Pterodactyl\Http\Requests\Api\Client\Servers\UpdateBackgroundRequest;

class ServerController extends ClientApiController
{
    /**
     * ServerController constructor.
     */
    public function __construct(private GetUserPermissionsService $permissionsService, private ServerDeletionService $deletionService)
    {
        parent::__construct();
    }

    /**
     * Transform an individual server into a response that can be consumed by a
     * client using the API.
     */
    public function index(GetServerRequest $request, Server $server): array
    {
        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->addMeta([
                'is_server_owner' => $request->user()->id === $server->owner_id,
                'user_permissions' => $this->permissionsService->handle($server, $request->user()),
            ])
            ->toArray();
    }

    /**
     * Updates the background image for a server.
     */
    public function updateBackground(UpdateBackgroundRequest $request, Server $server): JsonResponse
    {
        $url = $request->input('bg');
        $server->update(['bg' => $url]);

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Deletes the requested server via the API and
     * returns the resources to the authenticated user.
     *
     * @throws DisplayException
     */
    public function delete(DeleteServerRequest $request, Server $server): JsonResponse
    {
        $user = $request->user();

        if ($user->id != $server->owner_id) {
            throw new DisplayException('您无权执行此操作。');
        }

        if ($this->settings->get('jexactyl::renewal:deletion') != 'true') {
            throw new DisplayException('该功能已被管理员锁定。');
        }

        try {
            $this->deletionService->returnResources(true)->handle($server);
        } catch (DisplayException $ex) {
            throw new DisplayException('无法从系统中删除服务器。');
        }

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
