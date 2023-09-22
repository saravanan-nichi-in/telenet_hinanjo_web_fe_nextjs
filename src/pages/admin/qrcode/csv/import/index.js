import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { Formik } from 'formik';
import * as Yup from 'yup';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputFile, ValidationError } from '@/components';

export default function AdminQrCodeCreatePage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        file: Yup.mixed().required('CSVファイルを选択してください.'),
    })

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ file: null }}
                onSubmit={() => {
                    router.push("/admin/dashboard")
                }}
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
                                    <DividerComponent />
                                    <div >
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
                                    <div>
                                        <div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="pt-3 ">
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
                                                <div className='flex pt-3 pb-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <div >
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
                                        </div>
                                        <div>
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