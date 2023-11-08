import React from "react";
import { Dropdown } from 'antd';

export default function DropdownSelect(props) {
    const {
        parentClass,
        custom,
        parentStyle,
        items,
        icon,
        text
    } = props;

    return (
        <div className={`${parentClass}  ${custom || 'custom-select'}`} style={parentStyle}>
            <Dropdown
                overlay={items}
            >
                <button type="button" className="p-link layout-topbar-button ml-3">
                    <div className='header-dropdown-name'>
                        {text}
                    </div>
                    <i className={`${icon} ml-2`} />
                </button>
            </Dropdown>
        </div>
    )
}