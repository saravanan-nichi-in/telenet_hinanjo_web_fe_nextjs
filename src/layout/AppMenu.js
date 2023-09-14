import React, { useState, useContext, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { useRouter } from 'next/router';
import { getValueByKeyRecursively as translate } from '@/helper';
import _ from 'lodash';
import { MdDashboard } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { RiUserSharedFill, RiAdminFill } from "react-icons/ri";
import { FaQrcode, FaBox, FaUserPlus, FaUsers } from "react-icons/fa";
import { ImUser, ImUsers } from "react-icons/im";
import { IoMdToday } from "react-icons/io";
import { AiOutlineAreaChart, AiFillSetting } from "react-icons/ai";
import { MdPlace } from "react-icons/md";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

const AppMenu = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const [model, setModel] = useState([]);

    const adminModel = [
        {
            label: translate(localeJson, 'vault_info'), icon: <MdDashboard size={15} />,
            items: [
                {
                    label: translate(localeJson, 'evacuation_status_list'),
                    icon: <ImUsers size={15} />,
                    to: '/admin/dashboard',
                    active: router.pathname.startsWith('/admin/dashboard')
                },
                {
                    label: translate(localeJson, 'history_place'),
                    icon: <HiDocumentText size={15} />, 
                    to: '/admin/history/place',
                    active: router.pathname.startsWith('/admin/history/place')
                },
                {
                    label: translate(localeJson, 'list_of_evacuees'),
                    icon: <HiDocumentText size={15} />,
                    to: '/admin/evacuation',
                    active: router.pathname.startsWith('/admin/evacuation')
                },
                {
                    label: translate(localeJson, 'shortage_supplies_list'),
                    icon: <IoMdToday size={15} />,
                    to: '/admin/shortage-supplies',
                    active: router.pathname.startsWith('/admin/shortage-supplies')
                },
                {
                    label: translate(localeJson, 'stockpile_summary'),
                    icon: <IoMdToday size={15} />,
                    to: '/admin/stockpile/summary',
                    active: router.pathname.startsWith('/admin/stockpile/summary')
                },
                {
                    label: translate(localeJson, 'statistics'),
                    icon: <AiOutlineAreaChart size={15} />,
                    to: '/admin/statistics',
                    active: router.pathname.startsWith('/admin/statistics')
                }
            ]
        },
        {
            label: translate(localeJson, 'operation_management'), icon: <MdDashboard size={15} />,
            items: [
                {
                    label: translate(localeJson, 'qr_code_create'),
                    icon: <FaQrcode size={15} />,
                    to: '/admin/qrcode/csv/import',
                    active: router.pathname.startsWith('/admin/qrcode/csv/import')
                },
                {
                    label: translate(localeJson, 'staff_management'),
                    icon: <ImUser size={15} />,
                    to: '/admin/staff-management',                    
                    active: router.pathname.startsWith('/admin/staff-management')
                },
                {
                    label: translate(localeJson, 'admin_management'),
                    icon: <RiAdminFill size={15} />,
                    to: '/admin/admin-management',
                    active: router.pathname.startsWith('/admin/admin-management')
                }
            ]
        },
        {
            label: translate(localeJson, 'setting'), icon: <MdDashboard size={15} />,
            items: [
                {
                    label: translate(localeJson, 'places'),
                    icon: <MdPlace size={15} />,
                    to: '/admin/place',
                    active: router.pathname.startsWith('/admin/place')
                },
                {
                    label: translate(localeJson, 'material'),
                    icon: <BiSolidPurchaseTagAlt size={15} />,
                    to: '/admin/material'
                },
                {
                    label: translate(localeJson, 'stockpile_master_management'),
                    icon: <BiSolidPurchaseTagAlt size={15} />,
                    to: '/admin/stockpile/master'
                }, {
                    label: translate(localeJson, 'special_care_list'),
                    icon: <ImUser size={15} />,
                    to: '/admin/special/care'
                }, {
                    label: translate(localeJson, 'questionnaire'),
                    icon: <FaUserPlus size={15} />,
                    to: '/auth/register'
                }, {
                    label: translate(localeJson, 'individual_questionnaire'),
                    icon: <FaUsers size={15} />,
                    to: '/auth/register'
                }, {
                    label: translate(localeJson, 'setting_systems'),
                    icon: <AiFillSetting size={15} />,
                    to: '/auth/register'
                },
            ]
        },
    ];

    const staffModel = [
        {
            label: translate(localeJson, 'dashboard'), icon: <MdDashboard size={15} />,
            items: [
                {
                    label: translate(localeJson, 'dashboard'),
                    icon: <MdDashboard size={15} />,
                    to: '/staff/dashboard'
                },
            ]
        },
        {
            label: translate(localeJson, 'evacuee_information'), icon: <MdDashboard size={15} />,
            items: [
                {
                    label: translate(localeJson, 'list_of_evacuees'),
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/family'
                },
                {
                    label: translate(localeJson, 'temporary_registrants'),
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/temp/family'
                },
            ]
        },
        {
            label: translate(localeJson, 'stockpile_management'), icon: <MdDashboard size={15} />,
            items: [
                {
                    label: translate(localeJson, 'stockpile_list'),
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/stockpile/dashboard',
                },
                {
                    label: translate(localeJson, 'stockpile_history'),
                    icon: <HiDocumentText size={15} />,
                    to: '/staff/stockpile/history'
                },
            ]
        },
        {
            label: translate(localeJson, 'setting'), icon: <MdDashboard size={15} />,
            items: [
                {
                    label: translate(localeJson, 'necessary_supplies_registration'),
                    icon: <ImUser size={15} />,
                    to: '/staff/supplies'
                },
                {
                    label: translate(localeJson, 'manual_registration_of_evacuees'),
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
                    return !item.seperator ? <AppMenuitem item={item} root={true} active={item.active} index={i} key={i} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
