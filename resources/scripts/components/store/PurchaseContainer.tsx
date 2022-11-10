import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import styled from 'styled-components/macro';
import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button';
import ContentBox from '@/components/elements/ContentBox';
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
    const earn = useStoreState((state) => state.storefront.data!.earn);
    const paypal = useStoreState((state) => state.storefront.data!.gateways?.paypal);
    const stripe = useStoreState((state) => state.storefront.data!.gateways?.stripe);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock title={'账户余额'}>
            <div className={'my-10'}>
                <Link to={'/store'}>
                    <Button.Text className={'w-full lg:w-1/6 m-2'}>
                        <ArrowLeft className={'mr-1'} />
                        返回商店
                    </Button.Text>
                </Link>
            </div>
            <h1 className={'j-left text-5xl'}>账户余额</h1>
            <h3 className={'j-left text-2xl mt-2 text-neutral-500'}>通过我们提供的支付方式你轻松的购买积分</h3>
            <Container className={'j-up lg:grid lg:grid-cols-2 my-10'}>
                <ContentBox title={'账户余额'} showFlashes={'account:balance'} css={tw`sm:mt-0`}>
                    <h1 css={tw`text-7xl flex justify-center items-center`}>
                        {resources.balance} <span className={'text-base ml-4'}>积分</span>
                    </h1>
                </ContentBox>
                <ContentBox title={'购买积分'} showFlashes={'account:balance'} css={tw`mt-8 sm:mt-0 sm:ml-8`}>
                    {paypal && <PaypalPurchaseForm />}
                    {stripe && <StripePurchaseForm />}
                    {!paypal && !stripe && (
                        <p className={'text-gray-400 text-sm m-2'}>
                            如果此处并未出现网关，那是因为尚未配置它们。
                        </p>
                    )}
                </ContentBox>
            </Container>
            {earn.enabled && (
                <>
                    <h1 className={'j-left text-5xl'}>空闲积分收益</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>
                        查看每分钟挂机将获得多少积分。
                    </h3>
                    <Container className={'j-up lg:grid lg:grid-cols-2 my-10'}>
                        <ContentBox title={'赚取率'} showFlashes={'earn:rate'} css={tw`sm:mt-0`}>
                            <h1 css={tw`text-7xl flex justify-center items-center`}>
                                {earn.amount} <span className={'text-base ml-4'}>积分 / 分钟</span>
                            </h1>
                        </ContentBox>
                        <ContentBox title={'怎么赚积分'} showFlashes={'earn:how'} css={tw`mt-8 sm:mt-0 sm:ml-8`}>
                            <p>您可以通过打开此面板的任何页面来获得积分。</p>
                            <p css={tw`mt-1`}>
                                只要网站一直在浏览器中打开，每分钟都会向你的账户添加
                                <span css={tw`text-green-500`}>{earn.amount}&nbsp;</span>
                                积分。
                            </p>
                        </ContentBox>
                    </Container>
                </>
            )}
        </PageContentBlock>
    );
};
