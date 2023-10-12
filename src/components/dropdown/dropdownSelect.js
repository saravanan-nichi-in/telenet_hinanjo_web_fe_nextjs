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
        spanText,
        text
    } = props;

    return (
        <div className={`${parentClass}  ${custom || 'custom-select'}`} style={parentStyle}>
            <Dropdown
                title={"title"}

                menu={{
                    items,
                }}
                trigger={['click']}
            >
                <button type="button" className="p-link layout-topbar-button ml-3">
                    <div className='header-details-first'>

                        {text}
                    </div>
                    <i className={`${icon} ml-1`}>{antdIcon}</i>
                    <span style={{ color: "black" }}>{spanText}</span>
                </button>
            </Dropdown>
        </div>
    )
}