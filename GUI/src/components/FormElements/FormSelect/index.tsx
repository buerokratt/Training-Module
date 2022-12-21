import { FC, SelectHTMLAttributes } from 'react';
import { useSelect } from 'downshift';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { MdArrowDropDown } from 'react-icons/md';

import { Icon } from 'components';
import './FormSelect.scss';


type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  hideLabel?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}

const FormSelect: FC<FormSelectProps> = ({ label, name, hideLabel, options, disabled, placeholder }) => {
  const { t } = useTranslation();
  const items = options.map((o) => o.value);
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items });

  const selectClasses = clsx(
    'select',
    disabled && 'select--disabled',
  );

  const placeholderValue = placeholder || t('global.choose');

  return (
    <div className={selectClasses}>
      {label && !hideLabel && <label htmlFor={name} className='select__label' {...getLabelProps()}>{label}</label>}
      <div className='select__wrapper'>
        <div className='select__trigger' {...getToggleButtonProps()}>
          {selectedItem ?? placeholderValue}
          <Icon label='Dropdown icon' size='medium' icon={<MdArrowDropDown color='#5D6071' />} />
        </div>
        <ul className='select__menu' {...getMenuProps()}>
          {isOpen && (
            items.map((item, index) => (
              <li className='select__option' key={`${item}${index}`} {...getItemProps({ item, index })}>
                {item}
              </li>
            ))
          )}
        </ul>
      </div>
      <div tabIndex={0} />
    </div>
  );
};

export default FormSelect;
