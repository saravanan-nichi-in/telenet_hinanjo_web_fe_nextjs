import React, { forwardRef, useContext, useImperativeHandle, useRef,useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { DiAtom } from "react-icons/di";

import { LayoutContext } from './context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper';
import { AuthenticationAuthorizationService } from '@/services';
import { DropdownSelect, LanguageDropdown } from '@/components';
import { MdOutlineResetTv } from 'react-icons/md';
import { ChangePasswordModal } from '@/components/modal';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutState, onMenuToggle, showProfileSidebar, onChangeLocale } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const { localeJson } = useContext(LayoutContext);

    /* Services */
    const { logout } = AuthenticationAuthorizationService;

     const onResetSuccess = (values) => {
        if (AuthenticationAuthorizationService.adminValue) {
            localStorage.setItem('admin', JSON.stringify(values.data));
            dispatch(setAdminValue({
                admin: values.data
            }));
            admin.next(values.data); 
            router.push("/admin/dashboard");
        }
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const onChangePasswordClose = () => {
        setChangePasswordOpen(!changePasswordOpen);
    };

    const onRegister = (values) => {
       
        setChangePasswordOpen(false);
        console.log(values);
    };

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
                    <a >{translate(localeJson,'change_password')}</a>
                </div>
            ),
            icon: <MdOutlineResetTv style={{fontSize:"14px"}}/>,
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
             close={onChangePasswordClose}
             register={onRegister}
             onResetSuccess={onResetSuccess}
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
                    避難所管理システム
                </div>
                <div className='header-details-second'>
                    <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                        <i className="pi pi-ellipsis-v" />
                    </button>
                    <div ref={topbarmenuRef} >
                        <DropdownSelect items={items} icon={"pi pi-cog"} spanText={"Settings"} />
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
});
AppTopbar.displayName = "AppTopbar"
export default AppTopbar;
