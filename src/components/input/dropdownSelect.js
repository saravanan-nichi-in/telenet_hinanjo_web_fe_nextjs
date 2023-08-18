import React from "react";
import { Dropdown } from 'antd';
export default function DropdownSelect(props) {
    const { items, icon, antdIcon, spanText } = props && props

    return (
        <div>
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