import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'UI Components',
            items: [
                { label: 'DND', icon: 'pi pi-fw pi-id-card', to: '/POC/DND' },
            ]
        },
        {
            label: 'POC',
            items: [
                { label: 'Perspective Image Cropping', icon: 'pi pi-fw pi-id-card', to: '/POC/CROP' },
            ]
        },
        {
            label: 'Functionality',
            items: [
                { label: 'Redux', icon: 'pi pi-fw pi-id-card', to: '/POC/Redux' },
            ]
        }, 
        {
            label: 'Pages',
            items: [
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        },
                        {   
                            label: 'Register',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/register'
                        }
                    ]
                },
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
