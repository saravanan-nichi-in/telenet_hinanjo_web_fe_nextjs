import React from "react";
import { Dropdown } from 'antd';

export default function DropdownSelect(props) {
    const {
        parentClass,
        custom,
        parentStyle,
        items,
        icon,
        antdIcon,
        spanText
    } = props;

    return (
        <div className={`${parentClass}  ${custom || 'custom-select'}`} style={parentStyle}>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}
            >
                <button type="button" className="p-link layout-topbar-button mt-1">
                    <i className={icon}>{antdIcon}</i>
                    <span>{spanText}</span>
                </button>
            </Dropdown>
        </div>
    )
}