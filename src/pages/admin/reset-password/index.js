import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import Image from 'next/image'
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthenticationAuthorizationService } from '@/services';
import { LockFilled } from '@ant-design/icons';
import { getValueByKeyRecursively as translate } from '@/utils/functions'
import { Password } from 'primereact/password';

const ResetPasswordPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const containerClassName = classNames('auth_surface_ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], translate(localeJson, 'confirm_password_notMatch'))
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
    });

    /* Services */
    const { login } = AuthenticationAuthorizationService;

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ password: "", confirmPassword: '' }}
                onSubmit={(values) => {
                    console.log(values);
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
                                        <div class="flex justify-content-center w-100 mt-3">
                                            <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={35} widt={'true'} alt="logo" />
                                        </div>
                                        <br />
                                        <div class="flex justify-content-center w-100 mb-5">
                                            {translate(localeJson, 'password_reset')}
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <label htmlFor="password" className="block mb-2">
                                                    {translate(localeJson, 'new_password')}<span className='p-error'>*</span>
                                                </label>
                                                <div className="p-inputgroup">
                                                    <Password
                                                        name='password'
                                                        placeholder={translate(localeJson, 'new_password')}
                                                        className={`w-full ${errors.password && touched.password && 'p-invalid'}`}
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
                                            <div className="field custom_inputText">
                                                <label htmlFor="confirmPassword" className="block mb-2">
                                                    {translate(localeJson, 'new_password_confirm')}<span className='p-error'>*</span>
                                                </label>
                                                <div className="p-inputgroup">
                                                    <Password
                                                        name='confirmPassword'
                                                        placeholder={translate(localeJson, 'new_password_confirm')}
                                                        className={`w-full ${errors.confirmPassword && touched.confirmPassword && 'p-invalid'}`}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.confirmPassword}
                                                    />
                                                    <span className="p-inputgroup-addon">
                                                        <LockFilled />
                                                    </span>
                                                </div>
                                                <small className="p-error block">
                                                    {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                                                </small>
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button type='submit' label={translate(localeJson, 'save')} className="custom_radiusBtn" severity="primary"></Button>
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

ResetPasswordPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};
export default ResetPasswordPage;
