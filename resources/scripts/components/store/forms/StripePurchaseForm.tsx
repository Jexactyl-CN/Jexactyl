import tw from 'twin.macro';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import stripe from '@/api/store/gateways/stripe';
import Select from '@/components/elements/Select';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

export default () => {
    const { clearAndAddHttpError } = useFlash();
    const [amount, setAmount] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const submit = () => {
        setSubmitting(true);

        stripe(amount)
            .then((url) => {
                setSubmitting(false);

                // @ts-expect-error this is valid
                window.location.href = url;
            })
            .catch((error) => {
                setSubmitting(false);

                clearAndAddHttpError({ key: 'store:stripe', error });
            });
    };

    return (
        <TitledGreyBox title={'通过 Stripe 购买'}>
            <Dialog open={submitting} hideCloseIcon onClose={() => undefined}>
                您现在被带到 Stripe 网关以完成此交易。
            </Dialog>
            <FlashMessageRender byKey={'store:stripe'} css={tw`mb-2`} />
            <Formik
                onSubmit={submit}
                initialValues={{
                    amount: 100,
                }}
            >
                <Form>
                    <SpinnerOverlay size={'large'} visible={submitting} />
                    <Select name={'amount'} disabled={submitting} onChange={(e) => setAmount(parseInt(e.target.value))}>
                        <option key={'stripe:placeholder'} hidden>
                            选择金额...
                        </option>
                        <option key={'stripe:buy:100'} value={100}>
                            购买 100 积分
                        </option>
                        <option key={'stripe:buy:200'} value={200}>
                            购买 200 积分
                        </option>
                        <option key={'stripe:buy:500'} value={500}>
                            购买 500 积分
                        </option>
                        <option key={'stripe:buy:1000'} value={1000}>
                            购买 1000 积分
                        </option>
                    </Select>
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} disabled={submitting}>
                            通过 Stripe 购买
                        </Button>
                    </div>
                </Form>
            </Formik>
        </TitledGreyBox>
    );
};
