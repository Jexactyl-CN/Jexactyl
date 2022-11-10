<?php

namespace Pterodactyl\Http\Controllers\Admin\Jexactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\View\Factory as ViewFactory;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Requests\Admin\Jexactyl\AdvancedFormRequest;

class AdvancedController extends Controller
{
    /**
     * AdvancedController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private ConfigRepository $config,
        private Kernel $kernel,
        private SettingsRepositoryInterface $settings,
        private ViewFactory $view
    ) {
    }

    /**
     * Render advanced Panel settings UI.
     */
    public function index(): View
    {
        $warning = false;

        if (
            $this->config->get('recaptcha._shipped_secret_key') == $this->config->get('recaptcha.secret_key')
            || $this->config->get('recaptcha._shipped_website_key') == $this->config->get('recaptcha.website_key')
        ) {
            $warning = true;
        }

        return $this->view->make('admin.jexactyl.advanced', [
            'warning' => $warning,
            'logo' => $this->settings->get('settings::app:logo', 'https://avatars.githubusercontent.com/u/91636558'),
        ]);
    }

    /**
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     * @throws \Pterodactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(AdvancedFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('settings::' . $key, $value);
        }

        $this->kernel->call('queue:restart');
        $this->alert->success('高级设置已成功更新，工作队列已重新启动以应用这些更改。')->flash();

        return redirect()->route('admin.jexactyl.advanced');
    }
}
