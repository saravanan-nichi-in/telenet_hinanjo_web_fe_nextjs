import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Formik } from "formik";
import * as Yup from "yup";
import { MailFilled } from '@ant-design/icons';

import { LayoutContext } from '../../../layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { ImageComponent, InputLeftRightGroup, NormalLabel, ValidationError, Button } from '@/components';

const ForgotPasswordPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const containerClassName = classNames('auth_surface_ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "" }}
                onSubmit={(values) => {
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                }) => (
                    <div className={containerClassName}>
                        <div className="flex flex-column align-items-center justify-content-center">
                            <div className="card w-full surface-card py-2 px-2" >
                                <div className='auth_view py-4 px-4 auth_surface_ground_border'>
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex justify-content-center w-100 mt-3">
                                            <ImageComponent imageProps={{
                                                src: `/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`,
                                                width: 150,
                                                height: 35,
                                                alt: "logo"
                                            }} />
                                        </div>
                                        <br />
                                        <div className="flex justify-content-center w-100 mb-5">
                                            {translate(localeJson, 'password_reset')}
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <NormalLabel htmlFor="email"
                                                    labelClass={"block mb-2"}
                                                    text={translate(localeJson, 'mail_address')}
                                                    spanClass={"p-error"}
                                                    spanText={"*"} />
                                                <InputLeftRightGroup inputLrGroupProps={{
                                                    name: 'email',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    antdRightIcon: <MailFilled />,
                                                    placeholder: translate(localeJson, 'mail_address'),
                                                    value: values.email
                                                }}
                                                    parentClass={`w-full ${errors.email && touched.email && 'p-invalid'}`} />
                                                <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    text: translate(localeJson, 'send'),
                                                    buttonClass: "custom_radiusBtn",
                                                    severity: "primary"
                                                }} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};

ForgotPasswordPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default ForgotPasswordPage;