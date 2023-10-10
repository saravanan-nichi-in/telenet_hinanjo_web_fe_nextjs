import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/router";

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFile } from "../upload";

export default function AdminManagementImportModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, register,modalHeaderText } = props && props;
    const router=useRouter();
    const header = (
        <div className="custom-modal">
            {modalHeaderText}
        </div>
    );
    const schema = Yup.object().shape({
        file: Yup.mixed()
            .required(translate(localeJson, 'file_csv_required'))
            .test('is-csv',translate(localeJson, 'select_csv_format'), (value) => {
                if (!value) return true; // If no file is selected, the validation passes.

                const allowedExtensions = ['csv']; // Define the allowed file extensions (in this case, just 'csv').
                const fileExtension = value.name.split('.').pop(); // Get the file extension from the file name.

                // Check if the file extension is in the list of allowed extensions.
                return allowedExtensions.includes(fileExtension.toLowerCase());
            }),
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ file: null }}
                onSubmit={(values) => {
                    props.importFile(values.file)
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    handleSubmit,
                }) => (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className="custom-modal"
                                header={header}
                                visible={open}
                                draggable={false}
                                onHide={() => close()}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            type: "submit",
                                            buttonClass: "w-8rem",
                                            text: translate(localeJson, 'import'),
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                                register({
                                                    file: values.file,
                                                });
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <InputFile inputFileProps={{
                                    
                                        onChange: (event) => {
                                            setFieldValue("file", event.currentTarget.files[0]);
                                        },
                                    }} parentClass={`w-full ${errors.file && touched.file && 'p-invalid '}`} />
                                    <div className='pt-1'>
                                        <ValidationError errorBlock={errors.file && touched.file && errors.file} />
                                    </div>
                                </div>
                            </Dialog>
                        </form>
                    </div>
                )}
            </Formik >
        </>
    );
}