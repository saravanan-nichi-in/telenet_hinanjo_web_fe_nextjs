import React, { useState, useContext, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { useRouter } from 'next/router';
import { getValueByKeyRecursively as translate } from '@/utils/functions';
import _ from 'lodash';
import { MdDashboard, MdManageAccounts } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { RiUserSharedFill } from "react-icons/ri";

const AppMenu = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const [model, setModel] = useState([]);

    const adminModel = [
        {
            label: translate(localeJson, 'vault_info'), icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: translate(localeJson, 'evacuation_status_list'),
                    icon: 'pi pi-fw pi-sign-in',
                    to: '/admin/dashboard'
                },
                {
                    label: translate(localeJson, 'list_of_evacuees'),
                    icon: 'pi pi-bookmark',
                    to: '/admin/evacuation'
                },
                {
                    label: translate(localeJson, 'shortage_supplies_list'),
                    icon: 'pi pi-globe',
                    to: '/admin/shortage-supplies'
                },
                {
                    label: translate(localeJson, 'stockpile_summary'),
                    icon: 'pi pi-copy',
                    to: '/admin/stockpile/summary'
                },
                {
                    label: translate(localeJson, 'statistics'),
                    icon: 'pi pi-users',
                    to: '/admin/statistics'
                }
            ]
        },
        {
            label: translate(localeJson, 'operation_management'), icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: translate(localeJson, 'qr_code_create'),
                    icon: 'pi pi-camera',
                    to: '/pages/empty'
                },
                {
                    label: translate(localeJson, 'staff_management'),
                    icon: 'pi pi-inbox',
                    to: '/auth/register'
                },
                {
                    label: translate(localeJson, 'admin_management'),
                    icon: 'pi pi-save',
                    to: '/auth/register'
                }
            ]
        },
        {
            label: translate(localeJson, 'setting'), icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: translate(localeJson, 'places'),
                    icon: 'pi pi-sign-out',
                    to: '/auth/register'
                },
                {
                    label: translate(localeJson, 'material'),
                    icon: 'pi pi-image',
                    to: '/auth/register'
                },
                {
                    label: translate(localeJson, 'stockpile_master_management'),
                    icon: 'pi pi-images',
                    to: '/auth/register'
                }, {
                    label: translate(localeJson, 'special_care_list'),
                    icon: 'pi pi-sitemap',
                    to: '/auth/register'
                }, {
                    label: translate(localeJson, 'questionnaire'),
                    icon: 'pi pi-eject',
                    to: '/auth/register'
                }, {
                    label: translate(localeJson, 'individual_questionnaire'),
                    icon: 'pi pi-tags',
                    to: '/auth/register'
                }, {
                    label: translate(localeJson, 'setting_systems'),
                    icon: 'pi pi-star',
                    to: '/auth/register'
                },
            ]
        },
    ];

    const staffModel = [
        {
            label: translate(localeJson, 'vault_info'), icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: "ダッシュボード",
                    icon: <MdDashboard size={15} />,
                    to: '/staff/dashboard'
                },
            ]
        },
        {
            label: '避難者情報', icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: "避難者一覧",
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/family'
                },
                {
                    label: "仮登録者一覧",
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/temp/family'
                },
            ]
        },
        {
            label: '備蓄品管理', icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: "備蓄品一覧",
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/stockpile/dashboard'
                },
                {
                    label: "備蓄品履歴",
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/stockpile/history'
                },
            ]
        },
        {
            label: '設定', icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: "必要物資登録",
                    icon: <MdManageAccounts size={15} />,
                    to: '/staff/supplies'
                },
                {
                    label: "入所者数登録",
                    icon: <RiUserSharedFill size={15} />,
                    to: '/staff/register-checkin'
                },
            ]
        },
    ];
    

    useEffect(() => {
        /* Services */
        const publicPaths = ['/admin/login', '/staff/login', '/admin/forgot-password', '/staff/forgot-password', '/admin/reset-password', '/staff/reset-password'];
        const path = router.asPath.split('?')[0];
        if (path.startsWith('/admin') && !publicPaths.includes(path)) {
            setModel(adminModel);
        } else if (path.startsWith('/staff') && !publicPaths.includes(path)) {
            setModel(staffModel);
        }
    }, [localeJson])

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {!_.isEmpty(model) && model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={i} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
