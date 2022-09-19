import * as Icon from 'react-feather';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { number, object, string } from 'yup';
import { megabytesToHuman } from '@/helpers';
import Field from '@/components/elements/Field';
import Select from '@/components/elements/Select';
import { Egg, getEggs } from '@/api/store/getEggs';
import createServer from '@/api/store/createServer';
import Spinner from '@/components/elements/Spinner';
import { getNodes, Node } from '@/api/store/getNodes';
import { getNests, Nest } from '@/api/store/getNests';
import StoreError from '@/components/elements/StoreError';
import { Button } from '@/components/elements/button/index';
import InputSpinner from '@/components/elements/InputSpinner';
import React, { ChangeEvent, useEffect, useState } from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import StoreContainer from '@/components/elements/StoreContainer';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import {
    faArchive,
    faCube,
    faDatabase,
    faEgg,
    faHdd,
    faLayerGroup,
    faList,
    faMemory,
    faMicrochip,
    faNetworkWired,
    faStickyNote,
} from '@fortawesome/free-solid-svg-icons';

interface CreateValues {
    name: string;
    description: string | null;
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number | null;
    databases: number | null;

    egg: number;
    nest: number;
    node: number;
}

export default () => {
    const limit = useStoreState((state) => state.storefront.data!.limit);
    const user = useStoreState((state) => state.user.data!);
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState<Resources>();
    const [egg, setEgg] = useState<number>(0);
    const [eggs, setEggs] = useState<Egg[]>();
    const [nest, setNest] = useState<number>(0);
    const [nests, setNests] = useState<Nest[]>();
    const [node, setNode] = useState<number>(0);
    const [nodes, setNodes] = useState<Node[]>();

    useEffect(() => {
        getResources().then((resources) => setResources(resources));

        getNodes().then((nodes) => {
            setNode(nodes[0].id);
            setNodes(nodes);
        });

        getNests().then((nests) => {
            setNest(nests[0].id);
            setNests(nests);
        });

        getEggs().then((eggs) => {
            setEgg(eggs[0].id);
            setEggs(eggs);
        });
    }, []);

    const changeNest = (e: ChangeEvent<HTMLSelectElement>) => {
        setNest(parseInt(e.target.value));
        getEggs(parseInt(e.target.value)).then((eggs) => setEggs(eggs));
    };

    const submit = (values: CreateValues) => {
        setLoading(true);
        clearFlashes('store:create');

        createServer(values, egg, nest, node)
            .then(() => {
                setLoading(false);
                clearFlashes('store:create');
                // @ts-expect-error this is valid
                window.location = '/';
            })
            .catch((error) => {
                setLoading(false);
                clearAndAddHttpError({ key: 'store:create', error });
            })
            .then(() => {
                addFlash({
                    type: 'success',
                    key: 'store:create',
                    message: '您的服务器已部署完毕，正在安装中。',
                });
            });
    };

    if (!resources || !nests || !eggs) return <Spinner size={'large'} centered />;

    if (!nodes) {
        return (
            <StoreError
                message={'没有可用于部署的节点。稍后再试。'}
                admin={'确保您至少有一个可以部署的节点。'}
                link={'https://docs.jexactyl.com'}
            />
        );
    }

    return (
        <PageContentBlock title={'创建服务器'} showFlashKey={'store:create'}>
            <Formik
                onSubmit={submit}
                initialValues={{
                    name: `${user.username}'s server`,
                    description: '在这里写一个简短的描述。',
                    cpu: resources.cpu,
                    memory: resources.memory / 1024,
                    disk: resources.disk / 1024,
                    ports: resources.ports,
                    backups: resources.backups,
                    databases: resources.databases,
                    nest: 1,
                    egg: 1,
                    node: 1,
                }}
                validationSchema={object().shape({
                    name: string().required().min(3),
                    description: string().optional().min(3).max(191),
                    cpu: number().required().min(50).max(resources.cpu).max(limit.cpu),
                    memory: number()
                        .required()
                        .min(1)
                        .max(resources.memory / 1024)
                        .max(limit.memory / 1024),
                    disk: number()
                        .required()
                        .min(1)
                        .max(resources.disk / 1024)
                        .max(limit.disk / 1024),
                    ports: number().required().min(1).max(resources.ports).max(limit.port),
                    backups: number().optional().max(resources.backups).max(limit.backup),
                    databases: number().optional().max(resources.databases).max(limit.database),
                    nest: number().required().default(1),
                    egg: number().required().default(1),
                    node: number().required().min(1),
                })}
            >
                <Form>
                    <div className={'mb-10'}>
                        <Link to={'/store'}>
                            <Button.Text className={'w-full lg:w-1/6 m-2'}>
                                <Icon.ArrowLeft className={'mr-1'} />
                                回到商店
                            </Button.Text>
                        </Link>
                        <Link to={'/store/resources'}>
                            <Button className={'w-full lg:w-1/6 m-2'}>
                                <Icon.ShoppingCart className={'mr-2'} />
                                购买资源
                            </Button>
                        </Link>
                    </div>
                    <h1 className={'j-left text-5xl'}>基础信息</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>为新服务器设置基本信息。</h3>
                    <StoreContainer className={'lg:grid lg:grid-cols-2 my-10 gap-4'}>
                        <TitledGreyBox title={'服务器名称'} icon={faStickyNote} className={'mt-8 sm:mt-0'}>
                            <Field name={'name'} />
                            <p className={'mt-1 text-xs'}>为您的服务器分配一个名称以在面板中使用.</p>
                            <p className={'mt-1 text-xs text-gray-400'}>
                                字符限制: <code>a-z A-Z 0-9 _ - .</code> 和 <code>[空格]</code>.
                            </p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'服务器描述'} icon={faList} className={'mt-8 sm:mt-0'}>
                            <Field name={'description'} />
                            <p className={'mt-1 text-xs'}>为您的服务器设置描述。</p>
                            <p className={'mt-1 text-xs text-yellow-400'}>* 选填</p>
                        </TitledGreyBox>
                    </StoreContainer>
                    <h1 className={'j-left text-5xl'}>资源限制</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>为 CPU、内存等设置限制。</h3>
                    <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
                        <TitledGreyBox title={'服务器 CPU 限制'} icon={faMicrochip} className={'mt-8 sm:mt-0'}>
                            <Field name={'cpu'} />
                            <p className={'mt-1 text-xs'}>分配可用 CPU 的限制。</p>
                            <p className={'mt-1 text-xs text-gray-400'}>{resources.cpu}% 可用</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'服务器内存限制'} icon={faMemory} className={'mt-8 sm:mt-0'}>
                            <Field name={'memory'} />
                            <p className={'mt-1 text-xs'}>分配可用内存的限制。</p>
                            <p className={'mt-1 text-xs text-gray-400'}>
                                {megabytesToHuman(resources.memory)} 可用
                            </p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'服务器存储空间限制'} icon={faHdd} className={'mt-8 sm:mt-0'}>
                            <Field name={'disk'} />
                            <p className={'mt-1 text-xs'}>分配可用存储空间的限制。</p>
                            <p className={'mt-1 text-xs text-gray-400'}>{megabytesToHuman(resources.disk)} 可用</p>
                        </TitledGreyBox>
                    </StoreContainer>
                    <h1 className={'j-left text-5xl'}>高级资源限制</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>
                        将数据库、网络分配和端口添加到您的服务器。
                    </h3>
                    <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
                        <TitledGreyBox title={'网络分配'} icon={faNetworkWired} className={'mt-8 sm:mt-0'}>
                            <Field name={'ports'} />
                            <p className={'mt-1 text-xs'}>为您的服务器分配多个端口。</p>
                            <p className={'mt-1 text-xs text-gray-400'}>{resources.ports} 个可用</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'服务器备份'} icon={faArchive} className={'mt-8 sm:mt-0'}>
                            <Field name={'backups'} />
                            <p className={'mt-1 text-xs'}>为您的服务器分配多个备份。</p>
                            <p className={'mt-1 text-xs text-gray-400'}>{resources.backups} 个可用</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'服务器数据库'} icon={faDatabase} className={'mt-8 sm:mt-0'}>
                            <Field name={'databases'} />
                            <p className={'mt-1 text-xs'}>为您的服务器分配多个数据库。</p>
                            <p className={'mt-1 text-xs text-gray-400'}>{resources.databases} 个可用</p>
                        </TitledGreyBox>
                    </StoreContainer>
                    <h1 className={'j-left text-5xl'}>部署</h1>
                    <h3 className={'j-left text-2xl text-neutral-500'}>选择节点和服务器分发类型。</h3>
                    <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
                        <TitledGreyBox title={'可用节点'} icon={faLayerGroup} className={'mt-8 sm:mt-0'}>
                            <Select name={'node'} onChange={(e) => setNode(parseInt(e.target.value))}>
                                {nodes.map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.name} - {n.fqdn} | {100 - parseInt(((n?.used / n?.total) * 100).toFixed(0))}%
                                        剩余空间
                                    </option>
                                ))}
                            </Select>
                            <p className={'mt-1 text-xs text-gray-400'}>选择一个节点来部署您的服务器。</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'服务器预设组'} icon={faCube} className={'mt-8 sm:mt-0'}>
                            <Select name={'nest'} onChange={(nest) => changeNest(nest)}>
                                {nests.map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.name}
                                    </option>
                                ))}
                            </Select>
                            <p className={'mt-1 text-xs text-gray-400'}>选择服务器使用的预设组。</p>
                        </TitledGreyBox>
                        <TitledGreyBox title={'服务器预设'} icon={faEgg} className={'mt-8 sm:mt-0'}>
                            <Select name={'egg'} onChange={(e) => setEgg(parseInt(e.target.value))}>
                                {eggs.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.name}
                                    </option>
                                ))}
                            </Select>
                            <p className={'mt-1 text-xs text-gray-400'}>
                                选择你想在服务器上运行什么功能/游戏。
                            </p>
                        </TitledGreyBox>
                    </StoreContainer>
                    <InputSpinner visible={loading}>
                        <div className={'text-right'}>
                            <Button
                                type={'submit'}
                                className={'w-1/6 mb-4'}
                                size={Button.Sizes.Large}
                                disabled={loading}
                            >
                                <Icon.Server className={'mr-2'} /> 创建
                            </Button>
                        </div>
                    </InputSpinner>
                </Form>
            </Formik>
        </PageContentBlock>
    );
};
