import React, { useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { Tooltip } from 'primereact/tooltip';

import { MenuContext } from './context/menucontext';
import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from './context/layoutcontext';

const AppMenuitem = (props) => {
    const { layoutConfig, layoutState, setLoader, localeJson } = useContext(LayoutContext);
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const router = useRouter();
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item.to && router.pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    const menuRef = useRef(null);

    useEffect(() => {
        if (item.to && router.pathname === item.to) {
            setActiveMenu(key);
        }

        const onRouteChange = (url) => {
            if (item.to && item.to === url) {
                setActiveMenu(key);
            }
        };

        router.events.on('routeChangeComplete', onRouteChange);

        return () => {
            router.events.off('routeChangeComplete', onRouteChange);
        };
    }, []);

    const itemClick = (event) => {
        // Avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        // Execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // Toggle active state
        if (item.items) {
            setActiveMenu(active ? props.parentKey : key);
        } else {
            // Set loader status on menu each click
            if (!active && !isActiveRoute) {
                setLoader(true);
            }
            setActiveMenu(key);
        }
    };

    const subMenu = item.items && item.visible !== false && (
        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item.label}>
            <ul>
                {item.items.map((child, i) => {
                    return (
                        <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />
                    )
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <React.Fragment>
            {layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static' && (
                <Tooltip target={menuRef.current} position="right" className="sidebar-custom-tooltip" />
            )}
            <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
                {/* {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.label}</div>} */}
                {(!item.to || item.items) && item.visible !== false ? (
                    <a ref={menuRef} data-pr-tooltip={item.label} href={item.url} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple', 'active-parent-menu')} target={item.target} tabIndex="0">
                        <span className={classNames('layout-menuitem-icon', item.icon)}>
                            {item.icon}
                        </span>
                        <span className="layout-menuitem-text">{item.label}</span>
                        {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                        <Ripple />
                    </a>
                ) : null}

                {item.to && !item.items && item.visible !== false ? (
                    <Link ref={menuRef} data-pr-tooltip={item.label} href={item.to} replace={item.replaceUrl} target={item.target} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute && item.label != translate(localeJson, 'staff_dashboard') }, { 'active-parent-menu': item.label == translate(localeJson, 'staff_dashboard') })} tabIndex={0}>
                        <span className={classNames('layout-menuitem-icon', item.icon)}>
                            {item.icon}
                        </span>
                        <span className="layout-menuitem-text">{item.label}</span>
                        {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                        <Ripple />
                    </Link>
                ) : null}

                {subMenu}
            </li>
        </React.Fragment>
    );
};

export default AppMenuitem;
