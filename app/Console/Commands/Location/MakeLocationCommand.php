<?php

namespace Pterodactyl\Console\Commands\Location;

use Illuminate\Console\Command;
use Pterodactyl\Services\Locations\LocationCreationService;

class MakeLocationCommand extends Command
{
    protected $signature = 'p:location:make
                            {--short= : 此地域的标识码名称（例如 us1）。}
                            {--long= : 此地域的描述。}';

    protected $description = '通过 CLI 在系统上创建一个新地域。';

    /**
     * Create a new command instance.
     */
    public function __construct(private LocationCreationService $creationService)
    {
        parent::__construct();
    }

    /**
     * Handle the command execution process.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     */
    public function handle()
    {
        $short = $this->option('short') ?? $this->ask(trans('command/messages.location.ask_short'));
        $long = $this->option('long') ?? $this->ask(trans('command/messages.location.ask_long'));

        $location = $this->creationService->handle(compact('short', 'long'));
        $this->line(trans('command/messages.location.created', [
            'name' => $location->short,
            'id' => $location->id,
        ]));
    }
}
