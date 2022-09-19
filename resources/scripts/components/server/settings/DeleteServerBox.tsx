import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import Code from '@/components/elements/Code';
import { ServerContext } from '@/state/server';
import Input from '@/components/elements/Input';
import deleteServer from '@/api/server/deleteServer';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';

export default () => {
    const [name, setName] = useState('');
    const [warn, setWarn] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const serverName = ServerContext.useStoreState((state) => state.server.data!.name);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        clearFlashes('settings');

        deleteServer(uuid, name)
            .then(() => {
                setConfirm(false);
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: '您的服务器实例已被删除。',
                });
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .catch((error) => clearAndAddHttpError({ key: 'settings', error }));
    };

    return (
        <TitledGreyBox title={'删除服务器实例'} className={'relative mb-12'}>
            <Dialog.Confirm
                open={warn}
                title={'确认删除服务器实例'}
                confirm={'是，删除服务器实例'}
                onClose={() => setWarn(false)}
                onConfirmed={() => {
                    setConfirm(true);
                    setWarn(false);
                }}
            >
                您的服务器将被删除, 所有文件都将被清除，且服务器资源将退回至您的账户。你确定继续吗?
            </Dialog.Confirm>
            <form id={'delete-server-form'} onSubmit={submit}>
                <Dialog
                    open={confirm}
                    title={'Password confirmation required'}
                    onClose={() => {
                        setConfirm(false);
                        setName('');
                    }}
                >
                    {name !== serverName && (
                        <>
                            <p className={'my-2 text-gray-400'}>
                                Type <Code>{serverName}</Code> below.
                            </p>
                            <Input type={'text'} value={name} onChange={(n) => setName(n.target.value)} />
                        </>
                    )}
                    <Button
                        disabled={name !== serverName}
                        type={'submit'}
                        className={'mt-2'}
                        form={'delete-server-form'}
                    >
                        是，删除服务器
                    </Button>
                </Dialog>
            </form>
            <p className={'text-sm'}>
                删除您的服务器将关闭所有服务器进程，将资源退回到您的帐户并删除所有与实例关联的文件、备份、数据库和设置。{' '}
                <strong className={'font-medium'}>
                    如果您继续执行此操作，所有数据将永久丢失。
                </strong>
            </p>
            <div className={'mt-6 font-medium text-right'}>
                <Button.Danger variant={Button.Variants.Secondary} onClick={() => setWarn(true)}>
                    删除服务器实例
                </Button.Danger>
            </div>
        </TitledGreyBox>
    );
};
