import React, { forwardRef, useContext, useImperativeHandle, useRef, useState,useEffect } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { DiAtom } from "react-icons/di";

import { LayoutContext } from './context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper';
import { AuthenticationAuthorizationService } from '@/services';
import { DropdownSelect } from '@/components';
import { MdOutlineResetTv } from 'react-icons/md';
import { ChangePasswordModal } from '@/components/modal';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutState, onMenuToggle, showProfileSidebar, onChangeLocale } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const { localeJson } = useContext(LayoutContext);
    const [userName, setUserName] = useState(null);
    useEffect(() => {
        const adminData = JSON.parse(localStorage.getItem('admin')); // Assuming 'user' is the key in local storage
        if (adminData && adminData.user && adminData.user.name) {
            setUserName(adminData.user.name);
          }
      }, []);

    /* Services */
    const { logout } = AuthenticationAuthorizationService;

    /**
     * On password changed successfully
     * @param {*} response 
     */
    const onChangePasswordSuccess = (response) => {
        setChangePasswordOpen(false);
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center" onClick={() => onChangeLocale(option.name === "JP" ? "jp" : "en")}>
                    <img alt={option.name} src={option.image} className={`mr-1`} style={{ width: '14px' }} />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const items = [
        {
            label: selectedCountryTemplate({
                name: 'JP',
                code: 'JP',
                placeholder: '',
                image: "/layout/images/jp.png"
            }),
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
            label: (
                <div onClick={() => setChangePasswordOpen(true)}>
                    {translate(localeJson, 'change_password')}
                </div>
            ),
            icon: <MdOutlineResetTv onClick={() => setChangePasswordOpen(true)} style={{ fontSize: "14px" }} />,
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <div onClick={() => logout()}>
                    {translate(localeJson, 'logout')}
                </div>
            ),
            icon: <LogoutOutlined />,
            key: '3',
        },

    ];

    return (
        <React.Fragment>
            <ChangePasswordModal
                open={changePasswordOpen}
                close={() => setChangePasswordOpen(false)}
                onChangePasswordSuccess={onChangePasswordSuccess}
            />
            <div className="layout-topbar">
                <div className="logo-details">
                    <div className='logo-view'>
                        <DiAtom size={35} className='logo-icon' />
                    </div>
                </div>
                <div className='header-details'>
                    <div className='hamburger'>
                        <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                            <i className="pi pi-bars" />
                        </button>
                    </div>
                    <div className='header-details-first'>
                    {translate(localeJson, 'evacuation_shelter_management_system')}
                    </div>
                    <div className='header-details-second'>
                        <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                            <i className="pi pi-ellipsis-v" />
                        </button>
                        <div ref={topbarmenuRef} >
                            <DropdownSelect icon={"pi pi-chevron-down"} text={userName} items={items} spanText={"Settings"} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});
AppTopbar.displayName = "AppTopbar"
export default AppTopbar;
