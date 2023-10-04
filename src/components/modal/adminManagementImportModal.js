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
        file: Yup.mixed().required('CSVファイルを选択してください.'),
    })

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ file: null }}
                onSubmit={() => {
                    router.push("#")
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
                                <div className={`text-center modal-content`}>
                                    <InputFile inputFileProps={{
                                        inputFileStyle: { fontSize: "12px" },
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