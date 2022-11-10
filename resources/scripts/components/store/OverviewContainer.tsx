import React from 'react';
import { useStoreState } from 'easy-peasy';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import ResourceBar from '@/components/elements/store/ResourceBar';
import StoreBanner from '@/components/elements/store/StoreBanner';
import PageContentBlock from '@/components/elements/PageContentBlock';

export default () => {
    const { width } = useWindowDimensions();
    const username = useStoreState((state) => state.user.data!.username);

    return (
        <PageContentBlock title={'商店概览'}>
            <div className={'flex flex-row items-center justify-between mt-10'}>
                {width >= 1280 && (
                    <div>
                        <h1 className={'j-left text-6xl'}>嘿, {username}!</h1>
                        <h3 className={'j-left text-2xl mt-2 text-neutral-500'}>👋 欢迎来到服务器商店。</h3>
                    </div>
                )}
                <ResourceBar className={'w-full lg:w-3/4'} />
            </div>
            <div className={'lg:grid lg:grid-cols-3 gap-8 my-10'}>
                <StoreBanner
                    title={'想创建一个服务器？'}
                    className={'bg-storeone'}
                    action={'创建'}
                    link={'create'}
                />
                <StoreBanner
                    title={'需要更多资源吗?'}
                    className={'bg-storetwo'}
                    action={'购买资源'}
                    link={'resources'}
                />
                <StoreBanner
                    title={'积分用完了？'}
                    className={'bg-storethree'}
                    action={'购买积分'}
                    link={'credits'}
                />
            </div>
        </PageContentBlock>
    );
};
