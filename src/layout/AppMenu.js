import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { MdDashboard, MdManageAccounts, MdSettings, MdSpaceDashboard, MdAddCircle } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";
import { FaQrcode, FaUserPlus } from "react-icons/fa";
import { ImUser, ImUsers } from "react-icons/im";
import { IoMdToday } from "react-icons/io";
import { AiOutlineAreaChart, AiFillSetting } from "react-icons/ai";
import { MdPlace } from "react-icons/md";
import { BiSolidPurchaseTagAlt, BiQrScan, BiSolidAddToQueue, BiSolidTime } from "react-icons/bi";
import { RiHome5Fill, RiFileHistoryFill, RiFileSettingsFill } from "react-icons/ri";
import { IoMdListBox, IoIosPaper } from "react-icons/io";
import { PiUserListFill, PiHandTapFill } from "react-icons/pi";
import { FaPeopleGroup, FaUsersGear } from "react-icons/fa6";
import { HiArchiveBoxXMark, HiInformationCircle } from "react-icons/hi2";
import { FaBoxes, FaChartPie, FaUserTie } from "react-icons/fa"
import { BsHouseGearFill, BsPeopleFill, BsFillPersonPlusFill } from "react-icons/bs";
import { GiClothes } from "react-icons/gi";

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
            icon: <RiHome5Fill size={20} />,
            items: [
                {
                    label: translate(localeJson, 'vault_info'),
                    icon: <RiHome5Fill size={20} />,
                    items: [
                        {
                            label: translate(localeJson, 'evacuation_status_list'),
                            icon: <IoMdListBox size={20} />,
                            to: '/admin/dashboard',
                            active: router.pathname.startsWith('/admin/dashboard')
                        },
                        {
                            label: translate(localeJson, 'history_place'),
                            icon: <RiFileHistoryFill size={20} />,
                            to: '/admin/history/place',
                            active: router.pathname.startsWith('/admin/history/place'),
                        },
                        {
                            label: translate(localeJson, 'list_of_evacuees'),
                            icon: <PiUserListFill size={20} />,
                            to: '/admin/evacuation',
                            active: router.pathname.startsWith('/admin/evacuation')
                        },
                        {
                            label: translate(localeJson, 'external_evacuees_tally'),
                            icon: <FaPeopleGroup size={20} />,
                            to: '/admin/external/family',
                            active: router.pathname.startsWith('/admin/external/family')
                        },
                        {
                            label: translate(localeJson, 'shortage_supplies_list'),
                            icon: <HiArchiveBoxXMark size={20} />,
                            to: '/admin/shortage-supplies',
                            active: router.pathname.startsWith('/admin/shortage-supplies')
                        },
                        {
                            label: translate(localeJson, 'stockpile_summary'),
                            icon: <FaBoxes size={20} />,
                            to: '/admin/stockpile/summary',
                            active: router.pathname.startsWith('/admin/stockpile/summary')
                        },
                        {
                            label: translate(localeJson, 'statistics'),
                            icon: <FaChartPie size={20} />,
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
                            icon: <BiQrScan size={20} />,
                            to: '/admin/qrcode/csv/import',
                            active: router.pathname.startsWith('/admin/qrcode/csv/import')
                        },
                        {
                            label: translate(localeJson, 'staff_management'),
                            icon: <FaUsersGear size={20} />,
                            to: '/admin/staff-management',
                            active: router.pathname.startsWith('/admin/staff-management')
                        },
                        {
                            label: translate(localeJson, 'admin_management'),
                            icon: <FaUserTie size={20} />,
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
                        icon: <BsHouseGearFill size={20} />,
                        to: '/admin/place',
                        active: router.pathname.startsWith('/admin/place')
                    },
                    {
                        label: translate(localeJson, 'material'),
                        icon: <GiClothes size={20} />,
                        to: '/admin/material'
                    },
                    {
                        label: translate(localeJson, 'stockpile_master_management'),
                        icon: <FaBoxes size={20} />,
                        to: '/admin/stockpile/master'
                    }, {
                        label: translate(localeJson, 'special_care_list'),
                        icon: <PiHandTapFill size={20} />,
                        to: '/admin/special/care'
                    }, {
                        label: translate(localeJson, 'questionnaire'),
                        icon: <BiSolidAddToQueue size={20} />,
                        to: '/admin/questionnaire'
                    },
                    {
                        label: translate(localeJson, 'setting_systems'),
                        icon: <RiFileSettingsFill size={20} />,
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
            icon: <MdSpaceDashboard size={20} />,
            items: [
                {
                    label: translate(localeJson, 'staff_dashboard'),
                    icon: <MdSpaceDashboard size={20} />,
                    to: '/staff/dashboard',
                    active: router.pathname.startsWith('/staff/dashboard')
                },
            ]
        },
        {
            label: translate(localeJson, 'evacuee_information'),
            icon: <HiInformationCircle size={20} />,
            items: [
                {
                    label: translate(localeJson, 'evacuee_information'),
                    icon: <HiInformationCircle size={20} />,
                    items: [
                        {
                            label: translate(localeJson, 'list_of_evacuees'),
                            icon: <BsPeopleFill size={20} />,
                            to: '/staff/family',
                            active: router.pathname.startsWith('/staff/family')
                        },
                        {
                            label: translate(localeJson, 'temporary_registrants'),
                            icon: <BiSolidTime size={20} />,
                            to: '/staff/temporary/family',
                            active: router.pathname.startsWith('/staff/temporary/family')
                        },
                        {
                            label: translate(localeJson, 'external_evacuees_list'),
                            icon: <FaPeopleGroup size={20} />,
                            to: '/staff/external/family-list',
                            active: router.pathname.startsWith('/staff/external/family-list')
                        },
                    ]
                },
            ]
        },
        {
            label: translate(localeJson, 'staff_stockpile_management'),
            icon: <FaBoxes size={20} />,
            items: [
                {
                    label: translate(localeJson, 'staff_stockpile_management'),
                    icon: <FaBoxes size={20} />,
                    items: [
                        {
                            label: translate(localeJson, 'stockpile_list'),
                            icon: <IoIosPaper size={20} />,
                            to: '/staff/stockpile/dashboard',
                            active: router.pathname.startsWith('/staff/stockpile/dashboard')
                        },
                        {
                            label: translate(localeJson, 'stockpile_history'),
                            icon: <RiFileHistoryFill size={20} />,
                            to: '/staff/stockpile/history',
                            active: router.pathname.startsWith('/staff/stockpile/history')
                        }
                    ]
                },
            ]
        },
        {
            label: translate(localeJson, 'setting'),
            icon: <MdSettings size={20} />,
            items: [
                {
                    label: translate(localeJson, 'setting'),
                    icon: <MdSettings size={20} />,
                    items: [
                        {
                            label: translate(localeJson, 'necessary_supplies_registration'),
                            icon: <MdAddCircle size={20} />,
                            to: '/staff/supplies',
                            active: router.pathname.startsWith('/staff/supplies')
                        },
                        {
                            label: translate(localeJson, 'manual_registration_of_evacuees'),
                            icon: <BsFillPersonPlusFill size={20} />,
                            to: '/staff/register/check-in',
                            active: router.pathname.startsWith('/staff/register/check-in')
                        },
                    ]
                },
            ]
        },
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
