import React from "react";
import { Dropdown } from 'antd';

export default function     DropdownSelect(props) {
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
                title={"title"}
                menu={{
                    items,
                }}
                trigger={['click']}
                pl
            >
                <button type="button" className="p-link layout-topbar-button mt-1">
                    <i className={icon}>{antdIcon}</i>
                    <span style={{color:"black"}}>{spanText}</span>
                </button>
            </Dropdown>
        </div>
    )
}