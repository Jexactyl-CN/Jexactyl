import tw from 'twin.macro';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from '@/state/hooks';
import Code from '@/components/elements/Code';
import { ServerContext } from '@/state/server';
import Input from '@/components/elements/Input';
import renewServer from '@/api/server/renewServer';
import deleteServer from '@/api/server/deleteServer';
import { Button } from '@/components/elements/button';
import { Dialog } from '@/components/elements/dialog';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import PageContentBlock from '@/components/elements/PageContentBlock';

export default () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const [isSubmit, setSubmit] = useState(false);
    const [renewDialog, setRenewDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const store = useStoreState((state) => state.storefront.data!);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const serverName = ServerContext.useStoreState((state) => state.server.data!.name);
    const renewable = ServerContext.useStoreState((state) => state.server.data?.renewable);

    const doRenewal = () => {
        clearFlashes('server:renewal');
        setSubmit(true);

        renewServer(uuid)
            .then(() => {
                setSubmit(false);
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .catch((error) => {
                clearAndAddHttpError({ key: 'server:renewal', error });
                setSubmit(false);
            });
    };

    const doDeletion = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        clearFlashes('server:renewal');
        setSubmit(true);

        deleteServer(uuid, name)
            .then(() => {
                setSubmit(false);
                // @ts-expect-error this is valid
                window.location = '/store';
            })
            .catch((error) => {
                clearAndAddHttpError({ key: 'server:renewal', error });
                setSubmit(false);
            });
    };

    return (
        <>
            <Dialog.Confirm
                open={renewDialog}
                onClose={() => setRenewDialog(false)}
                title={'确认续费服务器'}
                confirm={'继续'}
                onConfirmed={() => doRenewal()}
            >
                <SpinnerOverlay visible={isSubmit} />
                您确定要花费 {store.renewals.cost} {store.currency} 来续费您的服务器实例吗？
            </Dialog.Confirm>
            <Dialog.Confirm
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                title={'确认删除服务器'}
                confirm={'继续'}
                onConfirmed={() => setConfirmDialog(true)}
            >
                <SpinnerOverlay visible={isSubmit} />
                此操作会将您的服务器实例以及所有文件和配置从系统中删除。
            </Dialog.Confirm>
            <form id={'delete-suspended-server-form'} onSubmit={doDeletion}>
                <Dialog
                    open={confirmDialog}
                    title={'服务器实例已停用'}
                    onClose={() => setConfirmDialog(false)}
                >
                    {name !== serverName && (
                        <>
                            <p className={'my-2 text-gray-400'}>
                                在下面输入 <Code>{serverName}</Code>。
                            </p>
                            <Input type={'text'} value={name} onChange={(n) => setName(n.target.value)} />
                        </>
                    )}
                    <p className={'my-2 text-gray-400'}>输入密码以继续删除服务器。</p>
                    <Input type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button
                        disabled={!password.length}
                        type={'submit'}
                        className={'mt-2'}
                        form={'delete-suspended-server-form'}
                    >
                        确认
                    </Button>
                </Dialog>
            </form>
            <PageContentBlock title={'Server Suspended'}>
                <FlashMessageRender byKey={'server:renewal'} css={tw`mb-1`} />
                <div css={tw`flex justify-center`}>
                    <div
                        css={tw`w-full sm:w-3/4 md:w-1/2 p-12 md:p-20 bg-neutral-900 rounded-lg shadow-lg text-center relative`}
                    >
                        <img src={ServerErrorSvg} css={tw`w-2/3 h-auto select-none mx-auto`} />
                        <h2 css={tw`mt-10 font-bold text-4xl`}>已停用</h2>
                        {renewable ? (
                            <>
                                <p css={tw`text-sm my-2`}>
                                    您的服务器因未按时更新而被暂停。&apos;续订&apos; 按钮以重新激活您的服务器实例。如果您想删除服务器实例，则资源将自动退回您的帐户中，以便您的下次重新部署新的服务器实例。
                                </p>
                                <Button
                                    className={'mx-2 my-1'}
                                    onClick={() => setRenewDialog(true)}
                                    disabled={isSubmit}
                                >
                                    立即续订
                                </Button>
                                <Button.Danger
                                    className={'mx-2 my-1'}
                                    onClick={() => setDeleteDialog(true)}
                                    disabled={isSubmit}
                                >
                                    删除服务器
                                </Button.Danger>
                            </>
                        ) : (
                            <>此服务器已停用，无法访问。</>
                        )}
                    </div>
                </div>
            </PageContentBlock>
        </>
    );
};
