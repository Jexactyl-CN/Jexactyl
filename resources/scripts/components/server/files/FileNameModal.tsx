import React from 'react';
import { join } from 'path';
import tw from 'twin.macro';
import { object, string } from 'yup';
import { ServerContext } from '@/state/server';
import Field from '@/components/elements/Field';
import { Form, Formik, FormikHelpers } from 'formik';
import { Button } from '@/components/elements/button/index';
import Modal, { RequiredModalProps } from '@/components/elements/Modal';

type Props = RequiredModalProps & {
    onFileNamed: (name: string) => void;
};

interface Values {
    fileName: string;
}

export default ({ onFileNamed, onDismissed, ...props }: Props) => {
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        onFileNamed(join(directory, values.fileName));
        setSubmitting(false);
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{ fileName: '' }}
            validationSchema={object().shape({
                fileName: string().required().min(1),
            })}
        >
            {({ resetForm }) => (
                <Modal
                    onDismissed={() => {
                        resetForm();
                        onDismissed();
                    }}
                    {...props}
                >
                    <Form>
                        <Field
                            id={'fileName'}
                            name={'fileName'}
                            label={'文件名'}
                            description={'请输入此文件的文件名.'}
                            autoFocus
                        />
                        <div css={tw`mt-6 text-right`}>
                            <Button>创建文件</Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </Formik>
    );
};
