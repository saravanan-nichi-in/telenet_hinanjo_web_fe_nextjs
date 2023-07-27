import { useState } from 'react';

const useLocalization = (defaultLanguage, languages) => {
    const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

    const translate = (key) => {
        return languages[currentLanguage][key] || '';
    };

    const changeLanguage = (language) => {
        setCurrentLanguage(language);
    };

    return { translate, changeLanguage, currentLanguage };
};

export default useLocalization;