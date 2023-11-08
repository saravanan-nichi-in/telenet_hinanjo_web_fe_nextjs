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
    const { locale, localeJson, layoutConfig, onMenuToggle, showProfileSidebar, onChangeLocale } = useContext(LayoutContext);
    // Getting storage data with help of reducers
    const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [userName, setUserName] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const url = window.location.pathname;
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo'
    };
    const formattedDateTime = currentDateTime.toLocaleString('ja-JP', options);

    // Helper function country template
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

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // Update every minute

        return () => {
            clearInterval(intervalId);
        };
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
                            <button ref={menubuttonRef} type="button" className="p-link layout-topbar-button" onClick={onMenuToggle}>
                                <i className="pi pi-bars" />
                            </button>
                        </div>
                    )}
                    <div className='header-details-first-view'>
                        <div title={locale == "ja" ? settings_data?.system_name_ja : settings_data?.system_name_en} className='header-details-first'>
                            {locale == "ja" ? settings_data?.system_name_ja : settings_data?.system_name_en}
                        </div>
                        <div ref={topbarmenuRef} className='header-details-second'>
                            <div>
                                <div className='header-details-second-date-time-picker'>
                                    {formattedDateTime.replace(/(\d+)年(\d+)月(\d+)日,/, '$1年$2月$3日 ')}
                                </div>
                                <div title={formattedDateTime.replace(/(\d+)年(\d+)月(\d+)日,/, '$1年$2月$3日 ')}
                                    className='header-details-second-date-time-picker-icon'>
                                    <i className="pi pi-clock" />
                                </div>
                            </div>
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
