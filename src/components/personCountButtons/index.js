import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const PersonCountButton = ({ names, onSelectionChange, isModal, id, SNames, customClassName, customParentClassName }) => {
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    setSelectedName(SNames)
  }, [])

  const handleButtonClick = (name) => {
    setSelectedName(name);
    // Notify the parent component about the selected name
    onSelectionChange(name, id);
  };

  return (
    <>
      <div className={`flex flex-wrap pt-0 pb-0${isModal ? 'col-12 w-full lg:w-25rem md:w-23rem sm:w-21rem p-0' : ''}${customParentClassName}`}>
        {names.map((name, index) => (
          <div key={index} className={`p-0 ${selectedName === name ? 'update-button' : 'edit-button'}`}>
            <Button
              className={` mt-3 ${selectedName === name ? 'update-button' : 'edit-button'}  ${customClassName}`}
              style={{
                borderColor: '#106540',
                height: "40px",
                width: "71px",
                paddingLeft: "26px"
              }}
              onClick={() => handleButtonClick(name)}
              type='button'
            >
              {name}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default PersonCountButton;
