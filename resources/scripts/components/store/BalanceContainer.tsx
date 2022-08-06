import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import StoreError from '@/components/store/error/StoreError';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import StripePurchaseForm from '@/components/store/forms/StripePurchaseForm';
import PaypalPurchaseForm from '@/components/store/forms/PaypalPurchaseForm';

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
    const [resources, setResources] = useState<Resources>();
    const store = useStoreState((state) => state.storefront.data!);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources) return <StoreError />;

    return (
        <PageContentBlock title={'账户余额'}>
            <h1 className={'j-left text-5xl'}>账户余额</h1>
            <h3 className={'j-left text-2xl mt-2 text-neutral-500'}>通过我们提供的支付方式你轻松的购买积分</h3>
            <Container className={'j-up lg:grid lg:grid-cols-2 my-10'}>
                <ContentBox title={'账户余额'} showFlashes={'account:balance'} css={tw`sm:mt-0`}>
                    <h1 css={tw`text-7xl flex justify-center items-center`}>
                        {resources.balance} {store.currency}
                    </h1>
                </ContentBox>
                <ContentBox title={'购买积分'} showFlashes={'account:balance'} css={tw`mt-8 sm:mt-0 sm:ml-8`}>
                    {store.gateways?.paypal && <PaypalPurchaseForm />}
                    {store.gateways?.stripe && <StripePurchaseForm />}
                </ContentBox>
            </Container>
        </PageContentBlock>
    );
};
