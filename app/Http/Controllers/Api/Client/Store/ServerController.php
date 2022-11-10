<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Store;

use Pterodactyl\Models\Nest;
use Pterodactyl\Models\Node;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Services\Store\StoreCreationService;
use Pterodactyl\Transformers\Api\Client\Store\EggTransformer;
use Pterodactyl\Transformers\Api\Client\Store\NestTransformer;
use Pterodactyl\Transformers\Api\Client\Store\NodeTransformer;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Requests\Api\Client\Store\CreateServerRequest;
use Pterodactyl\Http\Requests\Api\Client\Store\GetStoreEggsRequest;
use Pterodactyl\Exceptions\Service\Deployment\NoViableNodeException;
use Pterodactyl\Http\Requests\Api\Client\Store\GetStoreNestsRequest;
use Pterodactyl\Http\Requests\Api\Client\Store\GetStoreNodesRequest;

class ServerController extends ClientApiController
{
    /**
     * ServerController constructor.
     */
    public function __construct(private StoreCreationService $creationService)
    {
        parent::__construct();
    }

    public function nodes(GetStoreNodesRequest $request): array
    {
        $nodes = Node::where('deployable', true)->get();

        return $this->fractal->collection($nodes)
            ->transformWith($this->getTransformer(NodeTransformer::class))
            ->toArray();
    }

    /**
     * Get all available nests for server deployment.
     */
    public function nests(GetStoreNestsRequest $request): array
    {
        $nests = Nest::where('private', false)->get();

        return $this->fractal->collection($nests)
            ->transformWith($this->getTransformer(NestTransformer::class))
            ->toArray();
    }

    /**
     * Get all available eggs for server deployment.
     */
    public function eggs(GetStoreEggsRequest $request): array
    {
        $id = $request->input('id') ?? Nest::first()->id;
        $eggs = Nest::query()->where('id', $id)->first()->eggs;

        return $this->fractal->collection($eggs)
            ->transformWith($this->getTransformer(EggTransformer::class))
            ->toArray();
    }

    /**
     * Stores a new server on the Panel.
     *
     * @throws DisplayException
     * @throws NoViableNodeException
     */
    public function store(CreateServerRequest $request): JsonResponse
    {
        $user = $request->user();
        $disk = $request->input('disk');
        $memory = $request->input('memory');
        $nest = Nest::find($request->input('nest'));

        if (!$user->verified) {
            throw new DisplayException('Server deployment is unavailable for unverified accounts.');
        }

        if ($nest->private) {
            throw new DisplayException('This nest is private and cannot be deployed to.');
        }

        try {
            $server = $this->creationService->handle($request);
        } catch (DisplayException $exception) {
            throw new DisplayException('Unable to create this server. Please contact an administrator.');
        }

        $user->update([
            'store_cpu' => $user->store_cpu - $request->input('cpu'),
            'store_memory' => $user->store_memory - $memory,
            'store_disk' => $user->store_disk - $disk,
            'store_slots' => $user->store_slots - 1,
            'store_ports' => $user->store_ports - $request->input('ports'),
            'store_backups' => $user->store_backups - $request->input('backups'),
            'store_databases' => $user->store_databases - $request->input('databases'),
        ]);

        return new JsonResponse(['id' => $server->uuidShort]);
    }
}
