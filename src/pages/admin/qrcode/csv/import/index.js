import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ProgressBar } from 'primereact/progressbar';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputFile, ValidationError } from '@/components';

export default function AdminQrCodeCreatePage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        file: Yup.mixed().required('CSVファイルを選択してください.'),
    })

    const [successMessage, setSuccessMessage] = useState('');
    const [zipFile, setZipFile] = useState(false);

    const handleFormSubmit = () => {
        // Perform form submission logic here
        // Once the form is successfully submitted, update the success message and setZipFile accordingly.
        setSuccessMessage('QRコードが正常に生成されました。');
        setZipFile(false); // You can set this to true if the user wants to zip the file.
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ file: null }}
                onSubmit={handleFormSubmit}
            >
                {({
                    errors,
                    touched,
                    setFieldValue,
                    handleSubmit,
                }) => (
                    <div className="grid">
                        <div className="col-12">
                            <div className='card'>
                                <section className='col-12'>
                                    <h5 className='page_header'>{translate(localeJson, 'admin_management')}</h5>
                                    <hr/>
                                    {/* <div>
                                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                            <Button buttonProps={{
                                                type: 'submit',
                                                buttonClass: "evacuation_button_height",
                                                text: "サンプルCSVのダウンロード",
                                                onClick: () => router.push('/admin/admin-management/create'),
                                                link: "true",
                                                style: { whiteSpace: 'nowrap' }
                                            }} parentClass={"mr-1 mt-1"} />
                                        </div>
                                    </div> */}
                                    <div>
                                        <div>
                                            {!successMessage ? ( // Conditionally render the form when successMessage is empty
                                                <form onSubmit={handleSubmit}>
                                                    <div>
                                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                            <Button buttonProps={{
                                                type: 'submit',
                                                buttonClass: "evacuation_button_height",
                                                text: "サンプルCSVのダウンロード",
                                                onClick: () => router.push('/admin/admin-management/create'),
                                                link: "true",
                                                style: { whiteSpace: 'nowrap' }
                                            }} parentClass={"mr-1 mt-1"} />
                                        </div>
                                    </div>
                                                    <div className="pt-3 ">
                                                        <InputFile inputFileProps={{
                                                            inputFileStyle: { fontSize: "12px" },
                                                            onChange: (event) => {
                                                                setFieldValue("file", event.currentTarget.files[0]);
                                                            },
                                                            accept: '.csv',
                                                        }} parentClass={`w-full ${errors.file && touched.file && 'p-invalid '}`} />
                                                        <div className='pt-1'>
                                                            <ValidationError errorBlock={errors.file && touched.file && errors.file} />
                                                        </div>
                                                    </div>
                                                    <div className='flex pt-3 pb-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                        <div>
                                                            <Button buttonProps={{
                                                                buttonClass: "evacuation_button_height",
                                                                type: 'submit',
                                                                text: "検索",
                                                                rounded: "true",
                                                                severity: "primary"
                                                            }} parentStyle={{ paddingLeft: "10px" }} />
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : null}
                                        </div>
                                        <div>
                                            {successMessage && (
                                                <div>
                                                    <p>{successMessage}</p>
                                                    <ProgressBar className='mb-3' value={100}/>
                                                    {!zipFile ? ( // Conditionally render buttons when zipFile is false
                                                        <>
                                                        <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "text-600 w-8rem",
                                            bg: "bg-white",
                                            hoverBg: "hover:surface-500 hover:text-white",
                                            text: translate(localeJson, 'cancel'),
                                            onClick: () => {
                                                setSuccessMessage('');
                                                setZipFile(false);
                                            },
                                        }} parentClass={"inline"} parentStyle={{paddingRight:"10px"}} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem",
                                            type: "submit",
                                            text: "Zip file",
                                            severity: "primary",
                                            onClick: () => setZipFile(true),
                                        }} parentClass={"inline"} />
                                    </div>
                                                        </>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    )
}
