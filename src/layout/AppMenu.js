import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { MdDashboard, MdManageAccounts, MdSettings } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { RiUserSharedFill, RiAdminFill } from "react-icons/ri";
import { FaQrcode, FaUserPlus, FaUsers } from "react-icons/fa";
import { ImUser, ImUsers } from "react-icons/im";
import { IoMdToday } from "react-icons/io";
import { AiOutlineAreaChart, AiFillSetting } from "react-icons/ai";
import { MdPlace } from "react-icons/md";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { getValueByKeyRecursively as translate } from '@/helper';

const AppMenu = () => {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const url = window.location.pathname;
    // Admin side bar information
    const adminModel = [
        {
            label: translate(localeJson, 'vault_info'),
            icon: <MdDashboard size={20} />,
            items: [
                {
                    label: translate(localeJson, 'vault_info'),
                    icon: <MdDashboard size={20} />,
                    items: [
                        {
                            label: translate(localeJson, 'evacuation_status_list'),
                            icon: <ImUsers size={20} />,
                            to: '/admin/dashboard',
                            active: router.pathname.startsWith('/admin/dashboard')
                        },
                        {
                            label: translate(localeJson, 'history_place'),
                            icon: <HiDocumentText size={20} />,
                            to: '/admin/history/place',
                            active: router.pathname.startsWith('/admin/history/place'),
                        },
                        {
                            label: translate(localeJson, 'list_of_evacuees'),
                            icon: <HiDocumentText size={20} />,
                            to: '/admin/evacuation',
                            active: router.pathname.startsWith('/admin/evacuation')
                        },
                        {
                            label: translate(localeJson, 'external_evacuees_tally'),
                            icon: <HiDocumentText size={20} />,
                            to: '/admin/external/family',
                            active: router.pathname.startsWith('/admin/external/family')
                        },
                        {
                            label: translate(localeJson, 'shortage_supplies_list'),
                            icon: <IoMdToday size={20} />,
                            to: '/admin/shortage-supplies',
                            active: router.pathname.startsWith('/admin/shortage-supplies')
                        },
                        {
                            label: translate(localeJson, 'stockpile_summary'),
                            icon: <IoMdToday size={20} />,
                            to: '/admin/stockpile/summary',
                            active: router.pathname.startsWith('/admin/stockpile/summary')
                        },
                        {
                            label: translate(localeJson, 'statistics'),
                            icon: <AiOutlineAreaChart size={20} />,
                            to: '/admin/statistics',
                            active: router.pathname.startsWith('/admin/statistics')
                        }
                    ]
                },
            ]
        },
        {
            label: translate(localeJson, 'operation_management'),
            icon: <MdManageAccounts size={20} />,
            items: [
                {
                    label: translate(localeJson, 'operation_management'),
                    icon: <MdManageAccounts size={20} />,
                    items: [
                        {
                            label: translate(localeJson, 'qr_code_create'),
                            icon: <FaQrcode size={20} />,
                            to: '/admin/qrcode/csv/import',
                            active: router.pathname.startsWith('/admin/qrcode/csv/import')
                        },
                        {
                            label: translate(localeJson, 'staff_management'),
                            icon: <ImUser size={20} />,
                            to: '/admin/staff-management',
                            active: router.pathname.startsWith('/admin/staff-management')
                        },
                        {
                            label: translate(localeJson, 'admin_management'),
                            icon: <RiAdminFill size={20} />,
                            to: '/admin/admin-management',
                            active: router.pathname.startsWith('/admin/admin-management')
                        }
                    ]
                }
            ]
        },
        {
            label: translate(localeJson, 'setting'),
            icon: <MdSettings size={20} />,
            items: [
                {
                    label: translate(localeJson, 'setting'),
                    icon: <MdSettings size={20} />,
                    items: [{
                        label: translate(localeJson, 'places'),
                        icon: <MdPlace size={20} />,
                        to: '/admin/place',
                        active: router.pathname.startsWith('/admin/place')
                    },
                    {
                        label: translate(localeJson, 'material'),
                        icon: <BiSolidPurchaseTagAlt size={20} />,
                        to: '/admin/material'
                    },
                    {
                        label: translate(localeJson, 'stockpile_master_management'),
                        icon: <BiSolidPurchaseTagAlt size={20} />,
                        to: '/admin/stockpile/master'
                    }, {
                        label: translate(localeJson, 'special_care_list'),
                        icon: <ImUser size={20} />,
                        to: '/admin/special/care'
                    }, {
                        label: translate(localeJson, 'questionnaire'),
                        icon: <FaUserPlus size={20} />,
                        to: '/admin/questionnaire'
                    },
                    {
                        label: translate(localeJson, 'setting_systems'),
                        icon: <AiFillSetting size={20} />,
                        to: '/admin/setting'
                    },
                    ]
                }
            ]
        },
    ];
    // Staff side bar information
    const staffModel = [
        {
            label: translate(localeJson, 'staff_dashboard'),
            icon: <MdDashboard size={20} />,
            items: [
                {
                    label: translate(localeJson, 'staff_dashboard'),
                    icon: <MdDashboard size={20} />,
                    to: '/staff/dashboard',
                    active: router.pathname.startsWith('/staff/dashboard')
                },
            ]
        },
        // {
        //     label: translate(localeJson, 'evacuee_information'),
        //     icon: <MdDashboard size={20} />,
        //     items: [
        //         {
        //             label: translate(localeJson, 'evacuee_information'),
        //             icon: <MdDashboard size={20} />,
        //             items: [
        //                 {
        //                     label: translate(localeJson, 'list_of_evacuees'),
        //                     icon: <ImUsers size={20} />,
        //                     to: '/staff/family?hinan=1',
        //                     active: router.pathname.startsWith('/staff/family')
        //                 },
        //                 {
        //                     label: translate(localeJson, 'temporary_registrants'),
        //                     icon: <ImUsers size={20} />,
        //                     to: '/staff/temporary/family?hinan=1',
        //                     active: router.pathname.startsWith('/staff/temporary/family')
        //                 },
        //                 {
        //                     label: translate(localeJson, 'external_evacuees_list'),
        //                     icon: <ImUsers size={20} />,
        //                     to: '/staff/external/family-list?hinan=1',
        //                     active: router.pathname.startsWith('/staff/external/family-list')
        //                 },
        //             ]
        //         },
        //     ]
        // },
        // {
        //     label: translate(localeJson, 'staff_stockpile_management'),
        //     icon: <MdDashboard size={20} />,
        //     items: [
        //         {
        //             label: translate(localeJson, 'staff_stockpile_management'),
        //             icon: <MdDashboard size={20} />,
        //             items: [
        //                 {
        //                     label: translate(localeJson, 'stockpile_list'),
        //                     icon: <ImUsers size={20} />,
        //                     to: '/staff/stockpile/dashboard?hinan=1',
        //                     active: router.pathname.startsWith('/staff/stockpile/dashboard')
        //                 },
        //                 {
        //                     label: translate(localeJson, 'stockpile_history'),
        //                     icon: <ImUsers size={20} />,
        //                     to: '/staff/stockpile/history?hinan=1',
        //                     active: router.pathname.startsWith('/staff/stockpile/history')
        //                 }
        //             ]
        //         },
        //     ]
        // },
        // {
        //     label: translate(localeJson, 'setting'),
        //     icon: <MdDashboard size={20} />,
        //     items: [
        //         {
        //             label: translate(localeJson, 'setting'),
        //             icon: <MdDashboard size={20} />,
        //             items: [
        //                 {
        //                     label: translate(localeJson, 'necessary_supplies_registration'),
        //                     icon: <ImUsers size={20} />,
        //                     to: '/staff/supplies?hinan=1',
        //                     active: router.pathname.startsWith('/staff/supplies')
        //                 },
        //                 {
        //                     label: translate(localeJson, 'manual_registration_of_evacuees'),
        //                     icon: <ImUsers size={20} />,
        //                     to: '/staff/register/check-in?hinan=1',
        //                     active: router.pathname.startsWith('/staff/register/check-in')
        //                 },
        //             ]
        //         },
        //     ]
        // },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {url.startsWith('/admin') ? (
                    adminModel.map((item, i) => {
                        return !item.seperator ? <AppMenuitem item={item} root={true} active={item.active} index={i} key={i} /> : <li className="menu-separator"></li>;
                    })
                ) : (
                    staffModel.map((item, i) => {
                        return !item.seperator ? <AppMenuitem item={item} root={true} active={item.active} index={i} key={i} /> : <li className="menu-separator"></li>;
                    })
                )}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
