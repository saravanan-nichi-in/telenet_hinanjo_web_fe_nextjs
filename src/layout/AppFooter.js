import React,{useContext} from 'react';

import { LayoutContext } from './context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper';
import { useAppSelector } from "@/redux/hooks";

const AppFooter = () => {
    const { localeJson } = useContext(LayoutContext);
    const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);

    return (
        <div className="layout-footer">
            <div>
               {settings_data.footer}
            </div>
        </div>
    );
};

export default AppFooter;