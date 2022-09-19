import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { getResources } from '@/api/store/getResources';
import Translate from '@/components/elements/Translate';
import InformationBox from '@/components/elements/InformationBox';
import getLatestActivity, { Activity } from '@/api/account/getLatestActivity';
import { wrapProperties } from '@/components/elements/activity/ActivityLogEntry';
import { faCircle, faCoins, faExclamationCircle, faScroll, faUserLock } from '@fortawesome/free-solid-svg-icons';

export default () => {
    const [bal, setBal] = useState(0);
    const [activity, setActivity] = useState<Activity>();
    const properties = wrapProperties(activity?.properties);
    const user = useStoreState((state) => state.user.data!);
    const store = useStoreState((state) => state.storefront.data!);

    useEffect(() => {
        getResources().then((d) => setBal(d.balance));
        getLatestActivity().then((d) => setActivity(d));
    }, []);

    return (
        <>
            {store.earn.enabled ? (
                <InformationBox icon={faCircle} iconCss={'animate-pulse'}>
                    获取 <span className={'text-green-600'}>{store.earn.amount}</span> 积分 / 分钟.
                </InformationBox>
            ) : (
                <InformationBox icon={faExclamationCircle}>
                    积分获取目前<span className={'text-red-600'}>已禁用.</span>
                </InformationBox>
            )}
            <InformationBox icon={faCoins}>
                    您有 <span className={'text-green-600'}>{bal}</span> 个可用积分.
            </InformationBox>
            <InformationBox icon={faUserLock}>
                {user.useTotp ? (
                    <>
                        您的帐户<span className={'text-green-600'}>已启用动态口令认证</span>.
                    </>
                ) : (
                    <>
                        <span className={'text-yellow-600'}>启用动态口令认证</span> 以保护您的帐户.
                    </>
                )}
            </InformationBox>
            <InformationBox icon={faScroll}>
                {activity ? (
                    <>
                        <span className={'text-neutral-400'}>
                            <Translate ns={'activity'} values={properties} i18nKey={activity.event.replace(':', '.')} />
                        </span>
                        {' - '}
                        {formatDistanceToNowStrict(activity.timestamp, { addSuffix: true })}
                    </>
                ) : (
                    '无法获取最新的活动日志。'
                )}
            </InformationBox>
        </>
    );
};
