import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useStore from '../../store/store';
import { MainNavigation } from '@buerokratt-ria/menu';
import { Header } from "@buerokratt-ria/header"
import './Layout.scss';
import {useQuery} from "@tanstack/react-query";
import {useToast} from "../../hooks/useToast";

const Layout: FC = () => {   const CACHE_NAME = 'mainmenu-cache';

    const [mainMenuItems, setMainMenuItems] = useState([])

    useQuery({
        queryKey: [import.meta.env.REACT_APP_MENU_URL + import.meta.env.REACT_APP_MENU_PATH],
        onSuccess: (res: any) => {
            try {
                setMainMenuItems(res);
                localStorage.setItem(CACHE_NAME, JSON.stringify(res));
            } catch (e) {
                console.log(e);
            }
        },
        onError: () => {
            setMainMenuItems(getCache());
        }
  });

    function getCache(): any {
        const cache = localStorage.getItem(CACHE_NAME) ?? '{}';
        return JSON.parse(cache);
    }

    return (
        <div className="layout">
            <MainNavigation serviceId={import.meta.env.REACT_APP_SERVICE_ID.split(',')} items={mainMenuItems}/>
            <div className="layout__wrapper">
                <Header
                    toastContext={useToast()}
                    user={useStore.getState().userInfo}
                />
                <main className="layout__main">
                    <Outlet />
                </main>
            </div>
        </div>
    )};

export default Layout;
