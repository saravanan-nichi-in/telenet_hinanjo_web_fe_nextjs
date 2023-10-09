import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ProgressBar } from 'primereact/progressbar';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputFile, ValidationError } from '@/components';

export default function AdminQrCodeCreatePage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState('');
    const [zipFile, setZipFile] = useState(false);
    const schema = Yup.object().shape({
        file: Yup.mixed()
            .required('CSVファイルを選択してください.')
            .test('is-csv', 'ファイルはCSV形式である必要があります.', (value) => {
                if (!value) return true; // If no file is selected, the validation passes.

                const allowedExtensions = ['csv']; // Define the allowed file extensions (in this case, just 'csv').
                const fileExtension = value.name.split('.').pop(); // Get the file extension from the file name.

                // Check if the file extension is in the list of allowed extensions.
                return allowedExtensions.includes(fileExtension.toLowerCase());
            }),
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, []);

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
                                <div className=''>
                                    <h5 className='page-header1'>{translate(localeJson, 'qr_code_create')}</h5>
                                </div>
                                <hr />
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
                                                        }} />
                                                    </div>
                                                </div>
                                                <div>
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
                                                <div className='flex my-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <div>
                                                        <Button buttonProps={{
                                                            buttonClass: "evacuation_button_height",
                                                            type: 'submit',
                                                            text: "検索",
                                                            rounded: "true",
                                                            severity: "primary"
                                                        }} />
                                                    </div>
                                                </div>
                                            </form>
                                        ) : null}
                                    </div>
                                    <div>
                                        {successMessage && (
                                            <div>
                                                <p>{successMessage}</p>
                                                <ProgressBar className='mb-3' value={100} />
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
                                                            }} parentClass={"inline"} parentStyle={{ paddingRight: "10px" }} />
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
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    )
}
