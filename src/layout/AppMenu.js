import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router'

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { locale, locales, push } = useRouter();
    const { t: translate } = useTranslation('common')

    const model = [
        {
            label: translate('admin.sidebar.vault_info'), icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: translate('admin.sidebar.evacuation_status_list'),
                    icon: 'pi pi-fw pi-sign-in',
                    to: '/admin/dashboard'
                },
                {
                    label: translate('admin.sidebar.list_of_evacuees'),
                    icon: 'pi pi-bookmark',
                    to: '/admin/evacuation'
                },
                {
                    label: translate('admin.sidebar.shortage_supplies_list'),
                    icon: 'pi pi-globe',
                    to: '/admin/shortage-supplies'
                },
                {
                    label: translate('admin.sidebar.stockpile_summary'),
                    icon: 'pi pi-copy',
                    to: '/auth/register'
                },
                {
                    label: translate('admin.sidebar.statistics'),
                    icon: 'pi pi-users',
                    to: '/pages/empty'
                }
            ]
        },
        {
            label: translate('admin.sidebar.operation_management'), icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: translate('admin.sidebar.qr_code_create'),
                    icon: 'pi pi-camera',
                    to: '/auth/login'
                },
                {
                    label: translate('admin.sidebar.staff_management'),
                    icon: 'pi pi-inbox',
                    to: '/auth/register'
                },
                {
                    label: translate('admin.sidebar.admin_management'),
                    icon: 'pi pi-save',
                    to: '/auth/register'
                }
            ]
        },
        {
            label: translate('admin.sidebar.setting'), icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: translate('admin.sidebar.places'),
                    icon: 'pi pi-sign-out',
                    to: '/auth/login'
                },
                {
                    label: translate('admin.sidebar.material'),
                    icon: 'pi pi-image',
                    to: '/auth/register'
                },
                {
                    label: translate('admin.sidebar.stockpile_master_management'),
                    icon: 'pi pi-images',
                    to: '/auth/register'
                }, {
                    label: translate('admin.sidebar.special_care_list'),
                    icon: 'pi pi-sitemap',
                    to: '/auth/register'
                }, {
                    label: translate('admin.sidebar.questionnaire'),
                    icon: 'pi pi-eject',
                    to: '/auth/register'
                }, {
                    label: translate('admin.sidebar.individual_questionnaire'),
                    icon: 'pi pi-tags',
                    to: '/auth/register'
                }, {
                    label: translate('admin.sidebar.setting_systems'),
                    icon: 'pi pi-star',
                    to: '/auth/register'
                },
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu font-18">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={i} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
