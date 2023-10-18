import React, { useContext, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { getValueByKeyRecursively as translate, zipDownloadWithURL } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFile, ValidationError, CommonDialog } from '@/components';
import { QRCodeCreateServices } from '@/services';

export default function AdminQrCodeCreatePage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const fileInputRef = useRef(null);
    const [initialValues, setInitialValues] = useState({
        file: null
    })
    const schema = Yup.object().shape({
        file: Yup.mixed()
            .required(translate(localeJson, 'file_csv_required'))
            .test('is-csv', translate(localeJson, 'select_csv_format'), (value) => {
                if (!value) return true; // If no file is selected, the validation passes.
                const allowedExtensions = ['csv']; // Define the allowed file extensions (in this case, just 'csv').
                const fileExtension = value.split('.').pop(); // Get the file extension from the file name.
                // Check if the file extension is in the list of allowed extensions.
                return allowedExtensions.includes(fileExtension.toLowerCase());
            }),
    });
    const [importFileData, setImportFileData] = useState("");
    const [qrCodeCreateDialogVisible, setQrCodeCreateDialogVisible] = useState(false);

    /* Services */
    const { callExport, callImport, callDelete, callZipDownload } = QRCodeCreateServices;

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, []);

    /**
     * Import file
     * @param {*} e 
     */
    const onImportFile = (e) => {
        if (e.currentTarget.files[0]) {
            const payload = new FormData();
            payload.append('csv_file', e.currentTarget.files[0]);
            setImportFileData(payload);
        }
    }

    /**
     * Form on submit
     * @param {*} values 
     */
    const handleFormSubmit = async (values, { resetForm, setFieldValue }) => {
        if (importFileData) {
            setLoader(true);
            await callImport(importFileData, onImportSuccess);
            // Reset the form after submission
            resetForm({ values: initialValues });
        }
    }

    /**
     * Import on success callback function
     * @param {*} response 
     */
    const onImportSuccess = (response) => {
        if (response) {
            setQrCodeCreateDialogVisible(true);
        }
        setImportFileData("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setLoader(false);
    }

    /**
     * Close functionality
     * @param {*} response 
    */
    const onDeleteSuccess = (response) => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setLoader(false);
    };

    /**
     * Download functionality
    */
    const onZipDownloadSuccess = async (response) => {
        if (response && response.data.data.file) {
            await zipDownloadWithURL(response.data.data.file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setLoader(false);
    };

    return (
        <>
            {/* QR code create success modal */}
            <CommonDialog
                open={qrCodeCreateDialogVisible}
                dialogBodyClassName="p-3"
                header={translate(localeJson, 'qr_code_create')}
                content={translate(localeJson, 'create_qr_codes_successfully')}
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "text-600",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, "delete"),
                            onClick: () => {
                                setQrCodeCreateDialogVisible(false);
                                setLoader(true);
                                callDelete(onDeleteSuccess)
                            },
                        },
                        parentClass: "inline"
                    },
                    {
                        buttonProps: {
                            buttonClass: "",
                            type: "submit",
                            text: translate(localeJson, "download"),
                            severity: "danger",
                            onClick: () => {
                                setQrCodeCreateDialogVisible(false);
                                setLoader(true);
                                callZipDownload(onZipDownloadSuccess)
                            },
                        },
                        parentClass: "inline"
                    }
                ]}
                close={() => {
                    setImportFileData("");
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                    setQrCodeCreateDialogVisible(false);
                }}
            />
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
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
                                        <form onSubmit={handleSubmit}>
                                            <div>
                                                <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                                    <Button buttonProps={{
                                                        type: 'button',
                                                        text: translate(localeJson, 'download_sample_csv'),
                                                        onClick: () => callExport(),
                                                        link: "true",
                                                        style: { whiteSpace: 'nowrap', padding: 0 }
                                                    }} />
                                                </div>
                                            </div>
                                            <div>
                                                <InputFile inputFileProps={{
                                                    name: 'file',
                                                    inputFileStyle: { fontSize: "12px" },
                                                    onChange: (e) => {
                                                        handleChange(e);
                                                        onImportFile(e);
                                                    },
                                                    value: values.file,
                                                    accept: '.csv',
                                                    ref: fileInputRef
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
                                                        text: translate(localeJson, 'import'),
                                                        rounded: "true",
                                                        severity: "primary",
                                                    }} />
                                                </div>
                                            </div>
                                        </form>
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
