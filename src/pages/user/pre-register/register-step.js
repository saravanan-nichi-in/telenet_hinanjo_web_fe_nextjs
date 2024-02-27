import React, { useState, useEffect, useContext } from 'react';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { MultiStepForm } from '@/components/multiForm';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, InputFloatLabel, ValidationError } from '@/components';

export default function TempRegisters() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { localeJson } = useContext(LayoutContext);

  const steps = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({
    step1: { field1: '' },
    step2: { field2: '' },
    step3: { field3: '' },
  });
  const totalSteps = 2;

  const next = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previous = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (values, setSubmitting) => {

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [`step${currentStep}`]: values,
    }));

    setSubmitting(false);

    if (currentStep < totalSteps) {
      next();
    }
  };

  const content = [<Formik
    key="step1"
    initialValues={formValues.step1}
    validationSchema={Yup.object({
      field1: Yup.string().required('Field 1 is required'),
    })}
    onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
  >
    {({ values, errors, touched, handleChange, handleBlur }) => (
      <Form >
        <div>
          <InputFloatLabel
            inputFloatLabelProps={{
              name: "field1",
              spanText: "*",
              spanClass: "p-error",
              value: values.field1,
              onChange: handleChange,
              onBlur: handleBlur,
              text: "text",
              inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
            }}
            parentClass={`${errors.field1 && touched.field1 && 'p-invalid pb-1'}`}
          />
          <ValidationError
            errorBlock={errors.field1 && touched.field1 && errors.field1}
          />
        </div>
        <Button
          buttonProps={{
            type: "submit",
            text: "Next",
          }}
          parentClass={"pt-3"}
        />
      </Form>
    )}
  </Formik>,
  // case 2:
  //   // ...
  <Formik
    key="step2"
    initialValues={formValues.step2}
    validationSchema={Yup.object({
      field2: Yup.string().required('Field 2 is required'),
    })}
    onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
  >
    {({ values, errors, touched, handleChange, handleBlur }) => (
      <Form >
        <div>
          <InputFloatLabel
            inputFloatLabelProps={{
              name: "field2",
              spanText: "*",
              spanClass: "p-error",
              value: values.field2,
              onChange: handleChange,
              onBlur: handleBlur,
              text: "text",
              inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
            }}
            parentClass={`${errors.field2 && touched.field2 && 'p-invalid pb-1'}`}
          />
          <ValidationError
            errorBlock={errors.field2 && touched.field2 && errors.field2}
          />
        </div>
        <Button
          buttonProps={{
            type: "submit",
            text: "Next",
          }}
          parentClass={"pt-3"}
        />
      </Form>
    )}
  </Formik>,
  <Formik
    key="step3"
    initialValues={formValues.step3}
    validationSchema={Yup.object({
      field3: Yup.string().required('Field 3 is required'),
    })}
    onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
  >
    {({ values, errors, touched, handleChange, handleBlur }) => (
      <Form >
        <div>
          <InputFloatLabel
            inputFloatLabelProps={{
              name: "field3",
              spanText: "*",
              spanClass: "p-error",
              value: values.field3,
              onChange: handleChange,
              onBlur: handleBlur,
              text: "text",
              inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
            }}
            parentClass={`${errors.field3 && touched.field3 && 'p-invalid pb-1'}`}
          />
          <ValidationError
            errorBlock={errors.field3 && touched.field3 && errors.field3}
          />
        </div>
        <Button
          buttonProps={{
            type: "submit",
            text: "Submit",
          }}
          parentClass={"pt-3"}
        />
      </Form>
    )}
  </Formik>
  ]

  return (
    <div>
      <div className="grid">
        <div className="col-12">
          <div className='card'>
            <h5 className='page-header1'>{translate(localeJson, 'admin_management')}</h5>
            <hr />
            <MultiStepForm
              items={steps}
              content={content}
              activeIndex={currentStep}
              setActiveIndex={setCurrentStep} />
          </div>
        </div>
      </div>
    </div>
  )
}
