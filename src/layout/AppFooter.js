import React,{useContext} from 'react';

import { LayoutContext } from './context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper';

const AppFooter = () => {
    const { localeJson } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <div>
                © 2023 {translate(localeJson, 'evacuation_shelter_management_system')}
            </div>
        </div>
    );
};

export default AppFooter;