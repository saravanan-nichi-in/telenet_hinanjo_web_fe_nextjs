import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router'
import { Formik } from "formik";
import * as Yup from "yup";

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalLabel, ValidationError } from '@/components';
import { SelectFloatLabel } from '@/components/dropdown';
import { MailSettingsOption1 ,MailSettingsOption2} from '@/utils/constant';
import { TextAreaFloatLabel } from '@/components/input';

export default function AdminHistoryPlacePage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const [selected1, setSelected1] = useState(MailSettingsOption1[4]);  
    const [selected2, setSelected2] = useState(MailSettingsOption2[0]);  


    const validateMultipleEmails = (value, localeJson) => {
        const emails = value.split(',').map(email => email.trim());
      
        for (const email of emails) {
          if (!Yup.string().email().isValidSync(email)) {
            return false;
          }
        }
      
        return true; // Return true if all emails are valid
      };
      
      const schema = Yup.object().shape({
        email: Yup.string()
          .required(translate(localeJson, 'notification_email_id_required'))
          .test('is-email', translate(localeJson, 'format_notification'), value => {
            // Check if it's a single valid email or a list of valid emails separated by commas
            return Yup.string().email().isValidSync(value) || validateMultipleEmails(value, localeJson);
          }),
      });  

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "" }}
                onSubmit={() => {
                    router.push("/admin/history/place")
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
                    <div className="grid">
                        <div className="col-12">
                            <div className='card'>
                                <div className='w-full flex flex-wrap sm:flex-no-wrap align-items-center justify-content-between gap-2'>
                                    <div className='flex justify-content-center align-items-center gap-2'>
                                        <h5 className='page_header'>{translate(localeJson, 'mail_setting')}</h5>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div >
                                                {/* <div className='mt-5 mb-3 flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow align-items-center justify-content-end gap-2 mobile-input ' > */}
                                                <div className='mt-5 mb-5 custom-align-label'>
                                                    <TextAreaFloatLabel textAreaFloatLabelProps={{
                                                        textAreaClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                                                        row: 5,
                                                        cols: 30,
                                                        name:'email',
                                                        text: translate(localeJson, 'notification_email_id'),
                                                        spanClass: "p-error",
                                                        spanText: "*",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.email && touched.email && 'p-invalid w-full lg:w-25rem md:w-23rem sm:w-21rem '}`} />
                                                    <ValidationError parentClass={"ml-2"} errorBlock={errors.email && touched.email && errors.email} />

                                                </div>
                                                <div className='mt-5'>
                                                    <SelectFloatLabel selectFloatLabelProps={{
                                                        inputId: "shelterCity",
                                                        selectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                        value: selected1,
                                                        options: MailSettingsOption1,
                                                        optionLabel: "name",
                                                        onChange: (e) => setSelected1(e.value),
                                                        text: translate(localeJson, "transmission_interval"),

                                                    }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
                                                </div>
                                                <div className='mt-6'>
                                                    <SelectFloatLabel selectFloatLabelProps={{
                                                        inputId: "shelterCity",
                                                        selectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                        value: selected2,
                                                        options: MailSettingsOption2,
                                                        optionLabel: "name",
                                                        onChange: (e) => setSelected2(e.value),
                                                        text: translate(localeJson, "output_target_area"),

                                                    }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
                                                </div>
                                                <div className='mt-3 ml-2 w-full lg:w-25rem md:w-23rem sm:w-21rem '>   
                                                    <NormalLabel  text={translate(localeJson, 'history_mail_message')}/>
                                                </div>
                                                <div className='flex-button ' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <div>
                                                        <Button buttonProps={{
                                                            buttonClass: "text-600 border-500 historyPlaceEnail_button",
                                                            bg: "bg-white",
                                                            type: "button",
                                                            hoverBg: "hover:surface-500 hover:text-white",
                                                            text: translate(localeJson, 'cancel'),
                                                            rounded: "true",
                                                            severity: "primary"
                                                        }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px"}} />
                                                    </div>
                                                    <div >
                                                        <Button buttonProps={{
                                                            buttonClass: "historyPlaceEnail_button",
                                                            type: 'submit',
                                                            text: translate(localeJson, 'registration'),
                                                            rounded: "true",
                                                            severity: "primary"
                                                        }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                                    </div>
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