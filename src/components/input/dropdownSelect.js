import React from "react";
import { Dropdown } from 'antd';
export default function DropdownSelect(props) {
    const items = props.items

    return (
        <div>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}
            >
                <button type="button" className="p-link layout-topbar-button mt-1">
                    <i className={props.icon}></i>
                    <span>Settings</span>
                </button>
            </Dropdown>
        </div>
    )
}