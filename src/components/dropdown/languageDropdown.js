import React, { useState, useContext } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { LayoutContext } from '@/layout/context/layoutcontext';

const LanguageDropdown = (props) => {
    const { parentClass, parentStyle, style, disabled, readOnly,...restProps } = props;
    const { onChangeLocale } = useContext(LayoutContext);

    const languageOptions = [
        {
            value: 'JP',
            code: 'JP',
            placeholder: '',
            image: "/layout/images/jp.png",
            name: 'Japanese'
        },
        {
            value: 'EN',
            code: 'US',
            placeholder: '',
            image: "/layout/images/us.png",
            name: 'English'
        },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState('JP');

    const handleLanguageChange = (event) => {
        const newLanguage = event.value;
        setSelectedLanguage(newLanguage);
        onChangeLocale(newLanguage === "JP" ? "jp" : "en");
    };

    const customOptionTemplate = (option) => {
        return (
            <div className="dropdown-option">
                <img src={option.image} alt={`${option.value} Logo`} />
            </div>
        );
    };

    const getSelectedOption = () => {
        return languageOptions.find(option => option.value === selectedLanguage);
    };

    const customValueTemplate = () => {
        const selectedOption = getSelectedOption();
        return (
            <div className="selected-value">
                {selectedOption && <img src={selectedOption.image} alt={`${selectedOption.label} Logo`} />}
            </div>
        );
    };

    const selectedOption = languageOptions.find(option => option.value === selectedLanguage);

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <Dropdown
                value={selectedOption}
                options={languageOptions}
                onChange={handleLanguageChange}
                optionLabel="name"
                style={style}
                disabled={disabled}
                readOnly={readOnly}
                valueTemplate={customValueTemplate}
                itemTemplate={customOptionTemplate}
                placeholder="Select a language"
                className='border-none'
                {...restProps}
            />
        </div>
    );
};
export default LanguageDropdown;