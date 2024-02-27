import React, { useState } from "react";
import { Steps } from "primereact/steps";
import { Card } from "primereact/card";

export const MultiStepForm = (props) => {
  // const{items,content}=props;
  const { items, content, activeIndex, setActiveIndex } = props;
  // const { values, errors, touched, handleChange, handleBlur, handleSubmit } = props.formik;

  // const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  const previous = () => {
    setActiveIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <div className="multistep-form">
      {/* <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false}/> */}
      <Card className="card p-0 pt-0">{content[activeIndex]}</Card>
    </div>
  );
};