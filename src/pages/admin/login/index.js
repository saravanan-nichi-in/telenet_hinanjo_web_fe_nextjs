import React, { useContext } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Image from 'next/image'
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthenticationAuthorizationService } from '@/services';
import { MailFilled, LockFilled } from '@ant-design/icons';
import { getValueByKeyRecursively as translate } from '@/utils/functions'

const LoginPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const containerClassName = classNames('auth-surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
        checked: Yup.boolean(),
    });

    /* Services */
    const { login } = AuthenticationAuthorizationService;

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", password: "", checked: false }}
                onSubmit={(values) => {
                    login('admin', values);
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
                                <div className='py-4 px-4' style={{
                                    border: '5px solid rgb(100, 176, 242)',
                                    borderRadius: '0.25rem'
                                }}>
                                    <form onSubmit={handleSubmit}>
                                        <div class="flex justify-content-center w-100 mt-3">
                                            <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={35} widt={'true'} alt="logo" />
                                        </div>
                                        <br />
                                        <div class="flex justify-content-center w-100 mb-5">
                                            {translate(localeJson, 'admin_login_screen')}
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <label htmlFor="email" className="block mb-2">
                                                    {translate(localeJson, 'mail_address')}<span className='p-error'>*</span>
                                                </label>
                                                <div className="p-inputgroup">
                                                    <InputText
                                                        name='email'
                                                        placeholder={translate(localeJson, 'mail_address')}
                                                        className={`w-full ${errors.email && touched.email && 'p-invalid'}`}
                                                        inputClassName='md:w-20rem'
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                    />
                                                    <span className="p-inputgroup-addon">
                                                        <MailFilled />
                                                    </span>
                                                </div>
                                                <small className="p-error block">
                                                    {errors.email && touched.email && errors.email}
                                                </small>
                                            </div>
                                            <div className="field custom_inputText">
                                                <label htmlFor="password" className="block mb-2">
                                                    {translate(localeJson, 'password')}<span className='p-error'>*</span>
                                                </label>
                                                <div className="p-inputgroup">
                                                    <Password
                                                        name='password'
                                                        placeholder={translate(localeJson, 'password')}
                                                        // toggleMask
                                                        className={`w-full ${errors.password && touched.password && 'p-invalid'}`}
                                                        inputClassName='md:w-20rem'
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.password}
                                                    />
                                                    <span className="p-inputgroup-addon">
                                                        <LockFilled />
                                                    </span>
                                                </div>
                                                <small className="p-error block">
                                                    {errors.password && touched.password && errors.password}
                                                </small>
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button type='submit' label={translate(localeJson, 'login')} className="w-15rem radius-28" severity="primary"></Button>
                                            </div>
                                            <div className='flex justify-content-center'>
                                                <Button label={translate(localeJson, 'forgot_password_caption')} link></Button>
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
