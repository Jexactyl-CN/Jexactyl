import tw from 'twin.macro';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';
import { megabytesToHuman } from '@/helpers';
import React, { useState, useEffect } from 'react';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import StoreContainer from '@/components/elements/StoreContainer';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';

const Wrapper = styled.div`
    ${tw`text-2xl flex flex-row justify-center items-center`};
`;

const OverviewContainer = () => {
    const [resources, setResources] = useState<Resources>();
    const username = useStoreState((state) => state.user.data!.username);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock title={'商店概览'}>
            <h1 className={'j-left text-5xl'}>👋 嘿, {username}!</h1>
            <h3 className={'j-left text-2xl mt-2 text-neutral-500'}>欢迎来到服务器商店。</h3>
            <StoreContainer className={'j-right lg:grid lg:grid-cols-3 my-10'}>
                <TitledGreyBox title={'总 CPU'} className={'mt-8 sm:mt-0'}>
                    <Wrapper>
                        <Icon.Cpu className={'mr-2'} /> {resources.cpu}%
                    </Wrapper>
                </TitledGreyBox>
                <TitledGreyBox title={'总 RAM'} className={'mt-8 sm:mt-0 sm:ml-8'}>
                    <Wrapper>
                        <Icon.PieChart className={'mr-2'} /> {megabytesToHuman(resources.memory)}
                    </Wrapper>
                </TitledGreyBox>
                <TitledGreyBox title={'总存储空间'} className={'mt-8 sm:mt-0 sm:ml-8'}>
                    <Wrapper>
                        <Icon.HardDrive className={'mr-2'} /> {megabytesToHuman(resources.disk)}
                    </Wrapper>
                </TitledGreyBox>
            </StoreContainer>
            <StoreContainer className={'j-left lg:grid lg:grid-cols-4 my-10'}>
                <TitledGreyBox title={'总实例槽位'} className={'mt-8 sm:mt-0'}>
                    <Wrapper>
                        <Icon.Server className={'mr-2'} /> {resources.slots}
                    </Wrapper>
                </TitledGreyBox>
                <TitledGreyBox title={'总端口数'} className={'mt-8 sm:mt-0 sm:ml-8'}>
                    <Wrapper>
                        <Icon.Share2 className={'mr-2'} /> {resources.ports}
                    </Wrapper>
                </TitledGreyBox>
                <TitledGreyBox title={'总备份数'} className={'mt-8 sm:mt-0 sm:ml-8'}>
                    <Wrapper>
                        <Icon.Archive className={'mr-2'} /> {resources.backups}
                    </Wrapper>
                </TitledGreyBox>
                <TitledGreyBox title={'总数据库数'} className={'mt-8 sm:mt-0 sm:ml-8'}>
                    <Wrapper>
                        <Icon.Database className={'mr-2'} /> {resources.databases}
                    </Wrapper>
                </TitledGreyBox>
            </StoreContainer>
            <div className={'text-center mr-10'}>
                <p className={'text-xl my-2 text-gray-400'}>您想要再创建一个服务器？</p>
                <Link to={'/store/create'}>
                    <Button className={'w-full lg:w-1/6'}>
                        <Icon.PlusCircle className={'mr-1'} />
                        创建
                    </Button>
                </Link>
            </div>
        </PageContentBlock>
    );
};

export default OverviewContainer;
