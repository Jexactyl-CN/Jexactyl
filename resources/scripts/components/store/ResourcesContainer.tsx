import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import { useStoreState } from '@/state/hooks';
import { Button } from '@/components/elements/button';
import { Dialog } from '@/components/elements/dialog';
import purchaseResource from '@/api/store/purchaseResource';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import PurchaseBox from '@/components/elements/store/PurchaseBox';
import PageContentBlock from '@/components/elements/PageContentBlock';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('sm')`
      width: calc(50% - 1rem);
    `}

        ${breakpoint('md')`
      ${tw`w-auto flex-1`};
    `}
    }
`;

export default () => {
    const [open, setOpen] = useState(false);
    const [resource, setResource] = useState('');
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();
    const cost = useStoreState((state) => state.storefront.data!.cost);

    const purchase = (resource: string) => {
        clearFlashes('store:resources');

        purchaseResource(resource)
            .then(() => {
                setOpen(false);
                addFlash({
                    type: 'success',
                    key: 'store:resources',
                    message: '资源已成功添加至你的账户。',
                });
            })
            .catch((error) => clearAndAddHttpError({ key: 'store:resources', error }));
    };

    return (
        <PageContentBlock title={'商店商品'} showFlashKey={'store:resources'}>
            <SpinnerOverlay size={'large'} visible={open} />
            <Dialog.Confirm
                open={open}
                onClose={() => setOpen(false)}
                title={'确认资源选择'}
                confirm={'确认'}
                onConfirmed={() => purchase(resource)}
            >
                您确定要购买此资源吗？这将从您的帐户中扣除积分并添加资源，且无法退还。
            </Dialog.Confirm>
            <div className={'my-10'}>
                <Link to={'/store'}>
                    <Button.Text className={'w-full lg:w-1/6 m-2'}>
                        <Icon.ArrowLeft className={'mr-1'} />
                        返回商店
                    </Button.Text>
                </Link>
            </div>
            <h1 className={'j-left text-5xl'}>订购资源</h1>
            <h3 className={'j-left text-2xl text-neutral-500'}>购买更多资源以添加到您的服务器。</h3>
            <Container className={'j-up lg:grid lg:grid-cols-4 my-10 gap-8'}>
                <PurchaseBox
                    type={'CPU'}
                    amount={50}
                    suffix={'%'}
                    cost={cost.cpu}
                    setOpen={setOpen}
                    icon={<Icon.Cpu />}
                    setResource={setResource}
                    description={'购买 CPU 以提高服务器性能。'}
                />
                <PurchaseBox
                    type={'内存'}
                    amount={1}
                    suffix={'GB'}
                    cost={cost.memory}
                    setOpen={setOpen}
                    icon={<Icon.PieChart />}
                    setResource={setResource}
                    description={'购买内存以提高服务器性能。'}
                />
                <PurchaseBox
                    type={'存储空间'}
                    amount={1}
                    suffix={'GB'}
                    cost={cost.disk}
                    setOpen={setOpen}
                    icon={<Icon.HardDrive />}
                    setResource={setResource}
                    description={'购买存储空间以提高服务器容量。'}
                />
                <PurchaseBox
                    type={'实例槽位'}
                    amount={1}
                    cost={cost.slot}
                    setOpen={setOpen}
                    icon={<Icon.Server />}
                    setResource={setResource}
                    description={'购买服务器位以部署一个新服务器。'}
                />
            </Container>
            <Container className={'j-up lg:grid lg:grid-cols-4 my-10 gap-8'}>
                <PurchaseBox
                    type={'端口'}
                    amount={1}
                    cost={cost.port}
                    setOpen={setOpen}
                    icon={<Icon.Share2 />}
                    setResource={setResource}
                    description={'购买端口以连接到您的服务器。'}
                />
                <PurchaseBox
                    type={'备份'}
                    amount={1}
                    cost={cost.backup}
                    setOpen={setOpen}
                    icon={<Icon.Archive />}
                    setResource={setResource}
                    description={'购买备份槽位来保护你的数据。'}
                />
                <PurchaseBox
                    type={'数据库'}
                    amount={1}
                    cost={cost.database}
                    setOpen={setOpen}
                    icon={<Icon.Database />}
                    setResource={setResource}
                    description={'购买数据库以获取和设置数据。'}
                />
                <TitledGreyBox title={'如何使用资源'}>
                    <p className={'font-semibold'}>添加到现有服务器</p>
                    <p className={'text-xs text-gray-500'}>
                        如果您有一个已经部署的服务器，您可以通过转到“编辑”选项卡向它添加资源。
                    </p>
                    <p className={'font-semibold mt-1'}>添加到新服务器</p>
                    <p className={'text-xs text-gray-500'}>
                        您可以在服务器创建页面购买资源并将其添加到新服务器，您可以通过商店访问该页面。
                    </p>
                </TitledGreyBox>
            </Container>
            <div className={'flex justify-center items-center'}>
                <div className={'bg-auto bg-center bg-storeone p-4 m-4 rounded-lg'}>
                    <div className={'text-center bg-gray-900 bg-opacity-75 p-4'}>
                        <h1 className={'j-down text-4xl'}>准备好开始了吗？</h1>
                        <Link to={'/store/create'}>
                            <Button.Text className={'j-up w-full mt-4'}>创建服务器</Button.Text>
                        </Link>
                    </div>
                </div>
            </div>
        </PageContentBlock>
    );
};
