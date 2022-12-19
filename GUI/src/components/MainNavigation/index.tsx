import { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { MdClose, MdKeyboardArrowDown } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';

import { Icon } from 'components';
import type { MainNavigation as MainNavigationType, MenuItem } from 'types/mainNavigation';

import './MainNavigation.scss';

const MainNavigation: FC = () => {
  const { t } = useTranslation();
  const { data: menuItems } = useQuery<MainNavigationType>(['main-navigation']);
  const location = useLocation();

  const handleNavToggle = (event: MouseEvent) => {
    const isExpanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  };

  const renderMenuTree = (menuItems: MenuItem[]) => {
    return menuItems.map((menuItem) => (
      <li key={menuItem.label}>
        {!!menuItem.children ? (
          <>
            <button
              className='nav__toggle'
              aria-expanded={menuItem.path && location.pathname.includes(menuItem.path) ? 'true' : 'false'}
              onClick={handleNavToggle}
            >
              <span>{menuItem.label}</span>
              <Icon icon={<MdKeyboardArrowDown />} />
            </button>
            <ul
              className='nav__submenu'>
              {renderMenuTree(menuItem.children)}
            </ul>
          </>
        ) : (
          <NavLink to={menuItem.path || '#'}>{menuItem.label}</NavLink>
        )}
      </li>),
    );
  };

  if (!menuItems) return null;

  return (
    <nav className='nav'>
      <button className='nav__menu-toggle'>
        <Icon icon={<MdClose />} />
        {t('mainMenu.closeMenu')}
      </button>
      <ul className='nav__menu'>
        {renderMenuTree(menuItems.data)}
      </ul>
    </nav>
  );
};

export default MainNavigation;
