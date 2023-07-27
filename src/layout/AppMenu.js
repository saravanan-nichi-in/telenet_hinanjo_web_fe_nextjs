import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    
    const model = [
        {   
            label: '避難所情報', icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: '避難者状況一覧',
                    icon: 'pi pi-fw pi-sign-in',
                    to: '/admin/dashboard'
                },
                {   
                    label: '避難者一覧',
                    icon: 'pi pi-bookmark',
                    to: '/admin/evacuation'
                },
                {   
                    label: '不足物資一覧',
                    icon: 'pi pi-globe',
                    to: '/admin/shortage-supplies'
                },
                {   
                    label: '備蓄品集計',
                    icon: 'pi pi-copy',
                    to: '/auth/register'
                },
                {   
                    label: '統計',
                    icon: 'pi pi-users',
                    to: '/pages/empty'
                }
            ] },
        {   
            label: '運用管理', icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: 'QRコード作成',
                    icon: 'pi pi-camera',
                    to: '/auth/login'
                },
                {   
                    label: 'スタッフ管理',
                    icon: 'pi pi-inbox',
                    to: '/auth/register'
                },
                {   
                    label: '管理者管理',
                    icon: 'pi pi-save',
                    to: '/auth/register'
                }
            ] },
        {   
            label: '設定', icon: 'pi pi-fw pi-home',
            items: [
                {
                    label: '避難所マスタ管理',
                    icon: 'pi pi-sign-out',
                    to: '/auth/login'
                },
                {   
                    label: '物資マスタ管理',
                    icon: 'pi pi-image',
                    to: '/auth/register'
                },
                {   
                    label: '不足物資一覧',
                    icon: 'pi pi-images',
                    to: '/auth/register'
                },{   
                    label: '要配慮者事項',
                    icon: 'pi pi-sitemap',
                    to: '/auth/register'
                },{   
                    label: '個別項目追加表示(世带全体)',
                    icon: 'pi pi-eject',
                    to: '/auth/register'
                },{   
                    label: '個別項目追加表示(個人ごと)',
                    icon: 'pi pi-tags',
                    to: '/auth/register'
                },{   
                    label: '環境設定',
                    icon: 'pi pi-star',
                    to: '/auth/register'
                },
            ] },
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
