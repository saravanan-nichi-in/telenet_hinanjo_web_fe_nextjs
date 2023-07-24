import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Image from 'next/image'

const RegisterPage = () => {
    const [password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="card w-full surface-card py-6 px-6">
                    <div class="flex justify-content-center w-100 ">
                        <Image src={`/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`} width={150} height={35} widt={'true'} alt="logo" />
                    </div>
                    <br />
                    <div>
                        <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                            Email
                        </label>
                        <InputText inputid="email1" type="text" placeholder="Email address" className="w-full md:w-30rem mb-3" style={{ padding: '1rem' }} />

                        <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                            Password
                        </label>
                        <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-3" inputClassName="w-full p-3 md:w-30rem"></Password>

                        <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                            Confirm Password
                        </label>
                        <Password inputid="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Confirm Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                        <div className="flex align-items-center justify-content-between mb-0 mt-0 ">
                        </div>
                        <Button label="Register" className="w-full p-3 text-xl" onClick={() => router.push('/')}></Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

RegisterPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};
export default RegisterPage;
