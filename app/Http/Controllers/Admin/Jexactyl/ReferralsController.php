<?php

namespace Pterodactyl\Http\Controllers\Admin\Jexactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Pterodactyl\Http\Requests\Admin\Jexactyl\ReferralsFormRequest;

class ReferralsController extends Controller
{
    /**
     * RegistrationController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the Jexactyl referrals interface.
     */
    public function index(): View
    {
        return view('admin.jexactyl.referrals', [
            'enabled' => $this->settings->get('jexactyl::referrals:enabled', false),
            'reward' => $this->settings->get('jexactyl::referrals:reward', 250),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     * @throws \Pterodactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(ReferralsFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('jexactyl::referrals:' . $key, $value);
        }

        $this->alert->success('推广系统已更新。')->flash();

        return redirect()->route('admin.jexactyl.referrals');
    }
}
