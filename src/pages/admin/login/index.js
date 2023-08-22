import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import Image from 'next/image'
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthenticationAuthorizationService } from '@/services';
import { MailFilled, LockFilled } from '@ant-design/icons';
import { getValueByKeyRecursively as translate } from '@/helper'
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/redux/hooks';
import { setAdminValue } from '@/redux/auth';
import InputLeftRightGroup from '@/components/input/inputLeftRightGroup';
import ValidationError from '@/components/error/validationError';

const LoginPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const containerClassName = classNames('auth_surface_ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    /* Services */
    const { login } = AuthenticationAuthorizationService;

    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
    });

    const onLoginSuccess = (values) => {
        if (AuthenticationAuthorizationService.adminValue) {
            localStorage.setItem('admin', JSON.stringify(values.data));
            dispatch(setAdminValue({
                admin: values.data
            }));
            router.push("/admin/dashboard");
        }
    };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", password: "" }}
                onSubmit={(values) => {
                    login('admin', values, onLoginSuccess);
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
                                            <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={35} widt={'true'} alt="logo" />
                                        </div>
                                        <br />
                                        <div className="flex justify-content-center w-100 mb-5">
                                            {translate(localeJson, 'admin_login_screen')}
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <label htmlFor="email" className="block mb-2">
                                                    {translate(localeJson, 'mail_address')}<span className='p-error'>*</span>
                                                </label>

                                                <InputLeftRightGroup inputLrGroupProps={{
                                                    name: 'email',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    antdRightIcon: <MailFilled />,
                                                    placeholder: translate(localeJson, 'mail_address'),
                                                }}
                                                    parentClass={`w-full ${errors.email && touched.email && 'p-invalid'}`} />
                                                <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                            </div>
                                            <div className="field custom_inputText">
                                                <label htmlFor="password" className="block mb-2">
                                                    {translate(localeJson, 'password')}<span className='p-error'>*</span>
                                                </label>
                                                <InputLeftRightGroup inputLrGroupProps={{
                                                    name: 'password',
                                                    type: "password",
                                                    value:values.password,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    antdRightIcon: <LockFilled />,
                                                    placeholder: translate(localeJson, 'password'),
                                                }}
                                                    parentClass={`w-full ${errors.password && touched.password && 'p-invalid'}`} />
                                                {/* <PasswordInput antdRightIcon={<LockFilled />} value={values.password} onBlur={handleBlur} className={`w-full ${errors.password && touched.password && 'p-invalid'}`} placeholder={translate(localeJson, 'password')} onChange={handleChange} /> */}
                                                <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button type='submit' label={translate(localeJson, 'login')} className="custom_radiusBtn" severity="primary"></Button>
                                            </div>
                                            <div className='flex justify-content-center'>
                                                <Button label={translate(localeJson, 'forgot_password_caption')} link onClick={() => router.push('/admin/forgot-password')}></Button>
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

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};
export default LoginPage;
