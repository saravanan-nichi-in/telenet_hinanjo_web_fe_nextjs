import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from 'next/image'
import { Dropdown } from 'antd';
import { useRouter } from 'next/router'
import { AuthenticationAuthorizationService } from '@/services';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import DateTimePicker from '@/components/date&time/dateTimePicker';
import { DropdownSelect } from '@/components';
import { DiAtom } from "react-icons/di";

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, onChangeLocale } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    const router = useRouter();

    /* Services */
    const { logout } = AuthenticationAuthorizationService;

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center px-2" onClick={() => onChangeLocale(option.name === "JP" ? "jp" : "en")}>
                    <img alt={option.name} src={option.image} className={`mr-3`} style={{ width: '18px' }} />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const items = [
        {
            label: (
                <div onClick={() => logout()}>
                    Logout
                </div>
            ),
            icon: <LogoutOutlined />,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: selectedCountryTemplate({
                name: 'EN',
                code: 'US',
                placeholder: '',
                image: "/layout/images/us.png"
            }),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: selectedCountryTemplate({
                name: 'JP',
                code: 'JP',
                placeholder: '',
                image: "/layout/images/jp.png"
            }),
            key: '2',
        },
    ];

    return (
        <div className="layout-topbar">
            <div class="logo-details">
                <div className='logo-view'>
                    <DiAtom size={35} className='logo-icon' />
                    {/* <span class="logo_name">避難所管理システム</span> */}
                </div>
                {/* <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button> */}
            </div>

            <div className='header-details'>
                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>
                <div className='header-details-first'>
                    避難所管理システム
                </div>
                <div className='header-details-second'>
                    <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                        <i className="pi pi-ellipsis-v" />
                    </button>
                    <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                        <DropdownSelect items={items} icon={"pi pi-cog"} spanText={"settings"} />
                    </div>
                </div>
            </div>
        </div>
    );
});
AppTopbar.displayName = "AppTopbar"
export default AppTopbar;
