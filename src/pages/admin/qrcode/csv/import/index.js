import React, { useContext, useState, useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { getValueByKeyRecursively as translate, zipDownloadWithURL } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFile, ValidationError, CommonDialog, CustomHeader, AdminManagementDeleteModal } from '@/components';
import { QRCodeCreateServices } from '@/services';

export default function AdminQrCodeCreatePage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const fileInputRef = useRef(null);
    const [initialValues, setInitialValues] = useState({
        file: null
    })
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteObj, setDeleteObj] = useState(null);
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

    const openDeleteDialog = (rowdata) => {
        setDeleteOpen(true);
    }

    const onDeleteClose = (status = '') => {
        if (status == 'confirm') {
            setLoader(true);
            callDelete(onDeleteSuccess)
            
        }
        setDeleteOpen(false);
    };

    return (
        <>
            {/* QR code create success modal */}
            <CommonDialog
                open={qrCodeCreateDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'qr_code_create')}
                content={translate(localeJson, 'create_qr_codes_successfully')}
                position={"center"}
                footerParentClassName={"text-center pt-5"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "text-600 w-full",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, "delete"),
                            onClick: () => {
                                setQrCodeCreateDialogVisible(false);
                                openDeleteDialog([]);
                            },
                        },
                        parentClass: "block"
                    },
                    {
                        buttonProps: {
                            buttonClass: "mt-2 w-full",
                            type: "submit",
                            text: translate(localeJson, "download"),
                            severity: "danger",
                            onClick: () => {
                                setQrCodeCreateDialogVisible(false);
                                setLoader(true);
                                callZipDownload(onZipDownloadSuccess)
                            },
                        },
                        parentClass: "block"
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
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
                refreshList={()=>{}}
                deleteObj={deleteObj}
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
                                    <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "qr_code_create")} />
                                </div>
                                <div>
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div>
                                                <div className='flex pb-2' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                                    <Button buttonProps={{
                                                        type: 'button',
                                                        rounded: "true",
                                                        export:true,
                                                        text: translate(localeJson, 'download_sample_csv'),
                                                        onClick: () => callExport(),
                                                    }} parentClass={"export-button"} />
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
                                                    ref: fileInputRef,
                                                    placeholder: translate(localeJson, 'default_csv_file_placeholder')
                                                }} parentClass={`w-full bg-white ${errors.file && touched.file && 'p-invalid '}`} />
                                                <div className=''>
                                                    <ValidationError errorBlock={errors.file && touched.file && errors.file} />
                                                </div>
                                            </div>
                                            <div className='flex my-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                <div>
                                                    <Button buttonProps={{
                                                        buttonClass: "evacuation_button_height import-button",
                                                        type: 'submit',
                                                        import:true,
                                                        text: translate(localeJson, 'import'),
                                                        rounded: "true",
                                                    }} parentClass={"import-button"} />
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
