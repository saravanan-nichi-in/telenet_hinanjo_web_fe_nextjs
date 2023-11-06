import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { MdOutlineResetTv } from 'react-icons/md';

import { LayoutContext } from './context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper';
import { AuthenticationAuthorizationService } from '@/services';
import { DropdownSelect, ImageComponent } from '@/components';
import { ChangePasswordModal } from '@/components/modal';
import { useAppSelector } from "@/redux/hooks";

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, onMenuToggle, showProfileSidebar, onChangeLocale } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const { localeJson, locale } = useContext(LayoutContext);
    const url = window.location.pathname;
    const [userName, setUserName] = useState(null);
    const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);
    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center" onClick={() => onChangeLocale(option.name === "JP" ? "jp" : "en")}>
                    <img alt={option.name} src={option.image} className={`mr-1`} style={{ width: '14px' }} />
                    <div className='pl-1'>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    // Dynamic menu setting for top bar
    const settingView = (
        <Menu>
            {url.startsWith('/user') ? (
                <>
                    <Menu.Item key="jp">
                        {selectedCountryTemplate({
                            name: 'JP',
                            code: 'JP',
                            placeholder: '',
                            image: "/layout/images/jp.png"
                        })}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="en">
                        {selectedCountryTemplate({
                            name: 'EN',
                            code: 'US',
                            placeholder: '',
                            image: "/layout/images/us.png"
                        })}
                    </Menu.Item>
                </>
            ) : (
                <Menu.SubMenu key="language" title={translate(localeJson, 'language')}>
                    <Menu.Item key="jp">
                        {selectedCountryTemplate({
                            name: 'JP',
                            code: 'JP',
                            placeholder: '',
                            image: "/layout/images/jp.png"
                        })}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="en">
                        {selectedCountryTemplate({
                            name: 'EN',
                            code: 'US',
                            placeholder: '',
                            image: "/layout/images/us.png"
                        })}
                    </Menu.Item>
                </Menu.SubMenu>
            )}
            {url.startsWith('/admin') && (
                <>
                    <Menu.Divider />
                    <Menu.Item key="change-password" icon={<MdOutlineResetTv style={{ fontSize: "14px" }} />} onClick={() => setChangePasswordOpen(true)}>
                        <div>
                            {translate(localeJson, 'change_password')}
                        </div>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => logout()}>
                        <div>
                            {translate(localeJson, 'logout')}
                        </div>
                    </Menu.Item>
                </>

            )}
            {url.startsWith('/staff') && (
                <>

                    <Menu.Divider />
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => logout()}>
                        <div>
                            {translate(localeJson, 'logout')}
                        </div>
                    </Menu.Item>
                </>
            )}
        </Menu>
    );

    useEffect(() => {
        const adminData = JSON.parse(localStorage.getItem('admin'));
        const staffData = JSON.parse(localStorage.getItem('staff'));
        if (url.startsWith('/admin')) {
            setUserName(adminData?.user?.name);
        } else {
            setUserName(staffData?.user?.name);
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

    return (
        <React.Fragment>
            <ChangePasswordModal
                open={changePasswordOpen}
                close={() => setChangePasswordOpen(false)}
                onChangePasswordSuccess={onChangePasswordSuccess}
            />
            <div className="layout-topbar">
                {layoutConfig.menuMode === 'static' && (
                    <div className="logo-details">
                        <div className='logo-view'>
                            <ImageComponent imageProps={{
                                src: settings_data.image_logo_path ? settings_data.image_logo_path : `/layout/images/telnetLogo-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'dark'}.svg`,
                                width: 280,
                                height: 45,
                                alt: "logo"
                            }} />
                        </div>
                    </div>
                )}
                <div className='header-details' style={{
                    width: layoutConfig.menuMode === 'overlay' && "100%"
                }}>
                    {layoutConfig.menuMode === 'static' && (
                        <div className='hamburger'>
                            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                                <i className="pi pi-bars" />
                            </button>
                        </div>
                    )}
                    <div className='header-details-first'>
                        {
                            locale == "ja" ? settings_data?.system_name_ja : settings_data?.system_name_en
                        }
                    </div>
                    <div className='header-details-second'>
                        <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                            <i className="pi pi-ellipsis-v" />
                        </button>
                        <div ref={topbarmenuRef} >
                            <DropdownSelect
                                icon={"pi pi-cog"}
                                text={layoutConfig.menuMode === 'overlay' ? "" : userName}
                                items={settingView}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
});
AppTopbar.displayName = "AppTopbar"
export default AppTopbar;
