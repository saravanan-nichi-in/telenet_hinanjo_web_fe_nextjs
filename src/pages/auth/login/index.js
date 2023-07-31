import React, { useContext } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Image from 'next/image'
import { Formik } from "formik";
import { loginSchema } from '@/utils/schema';
import { AuthenticationAuthorizationService } from '@/services';

const LoginPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    /* Services */
    const { login } = AuthenticationAuthorizationService;

    return (
        <>
            <Formik
                validationSchema={loginSchema}
                initialValues={{ email: "", password: "", checked: false }}
                onSubmit={(values, { validate }) => {
                    login(values);
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
                            <div className="card w-full surface-card py-5 px-5" >
                                <form onSubmit={handleSubmit}>
                                    <div class="flex justify-content-center w-100 ">
                                        <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={35} widt={'true'} alt="logo" />
                                    </div>
                                    <br />
                                    <div>
                                        <div className="field">
                                            <label htmlFor="email" className="block mb-2">
                                                Email
                                            </label>
                                            <InputText
                                                name='email'
                                                placeholder="Email address"
                                                className="w-full"
                                                inputClassName='md:w-25rem'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.email}
                                            />
                                            <small className="p-error block">
                                                {errors.email && touched.email && errors.email}
                                            </small>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="password" className="block mb-2">
                                                Password
                                            </label>
                                            <Password
                                                name='password'
                                                placeholder="Password"
                                                toggleMask
                                                className="w-full"
                                                inputClassName='md:w-25rem'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password}
                                            />
                                            <small className="p-error block">
                                                {errors.password && touched.password && errors.password}
                                            </small>
                                        </div>
                                        <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                            <div className="flex align-items-center">
                                                <Checkbox name="checked" checked={values.checked} onChange={handleChange} className="mr-2"></Checkbox>
                                                <label htmlFor="checked">Remember me</label>
                                            </div>
                                            <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                                Forgot password?
                                            </a>
                                        </div>
                                        <Button type='submit' label="Sign In" className="w-full p-3 text-xl"></Button>
                                    </div>
                                </form>
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
