import React from 'react';
import * as Yup from 'yup';
import tw from 'twin.macro';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import Field from '@/components/elements/Field';
import { Form, Formik, FormikHelpers } from 'formik';
import { Button } from '@/components/elements/button/index';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';

interface Values {
    email: string;
    password: string;
}

const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required('您必须提供您当前的帐户密码。'),
});

export default () => {
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const updateEmail = useStoreActions((state: Actions<ApplicationStore>) => state.user.updateUserEmail);

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = (values: Values, { resetForm, setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:email');

        updateEmail({ ...values })
            .then(() =>
                addFlash({
                    type: 'success',
                    key: 'account:email',
                    message: '您的首选电子邮箱地址已更新。',
                })
            )
            .catch((error) =>
                addFlash({
                    type: 'error',
                    key: 'account:email',
                    title: '错误',
                    message: httpErrorToHuman(error),
                })
            )
            .then(() => {
                resetForm();
                setSubmitting(false);
            });
    };

    return (
        <Formik onSubmit={submit} validationSchema={schema} initialValues={{ email: user!.email, password: '' }}>
            {({ isSubmitting, isValid }) => (
                <React.Fragment>
                    <SpinnerOverlay size={'large'} visible={isSubmitting} />
                    <Form css={tw`m-0`}>
                        <Field id={'current_email'} type={'email'} name={'email'} label={'邮箱'} />
                        <div css={tw`mt-6`}>
                            <Field
                                id={'confirm_password'}
                                type={'password'}
                                name={'password'}
                                label={'确认密码'}
                            />
                        </div>
                        <div css={tw`mt-6`}>
                            <Button disabled={isSubmitting || !isValid}>更新邮箱地址</Button>
                        </div>
                    </Form>
                </React.Fragment>
            )}
        </Formik>
    );
};
