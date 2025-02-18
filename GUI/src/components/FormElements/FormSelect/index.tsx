import React, { FC, ReactNode, SelectHTMLAttributes, useEffect, useId, useState, forwardRef } from 'react';
import { useSelect } from 'downshift';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { MdArrowDropDown } from 'react-icons/md';

import { Icon } from 'components';
import './FormSelect.scss';

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode;
  name: string;
  hideLabel?: boolean;
  placeholder?: string;
  fitContent?: boolean;
  options: {
    label: string;
    value: string;
  }[];
  onSelectionChange?: (selection: { label: string; value: string } | null) => void;
};

const itemToString = (item: { label: string; value: string } | null) => {
  return item ? item.value : '';
};

const FormSelect: FC<FormSelectProps> = forwardRef<HTMLDivElement, FormSelectProps>(
  (
    { label, hideLabel, options, disabled, placeholder, defaultValue, onSelectionChange, value, fitContent, ...rest },
    ref
  ) => {
    const id = useId();
    const { t } = useTranslation();
    const defaultSelected = options.find((o) => o.value === defaultValue) || null;
    const [selectedItem, setSelectedItem] = useState<{ label: string; value: string } | null>(defaultSelected);

    useEffect(() => {
      setSelectedItem(options.find((o) => o.value === value) || null);
    }, [value, options]);

    const { isOpen, getToggleButtonProps, getLabelProps, getMenuProps, highlightedIndex, getItemProps } = useSelect({
      id,
      items: options,
      itemToString,
      selectedItem,
      onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
        setSelectedItem(newSelectedItem ?? null);
        if (onSelectionChange) onSelectionChange(newSelectedItem ?? null);
      },
    });

    const selectClasses = clsx('select', disabled && 'select--disabled');

    const triggerClasses = clsx('select__trigger', fitContent && 'select__trigger-fit-content');

    const placeholderValue = placeholder || t('global.choose');

    return (
      <div className={selectClasses} style={rest.style} ref={ref}>
        {label && !hideLabel && (
          <label htmlFor={id} className="select__label" {...getLabelProps()}>
            {label}
          </label>
        )}
        <div className="select__wrapper">
          <div className={triggerClasses} {...getToggleButtonProps()}>
            <p style={{ overflow: 'hidden' }}>{selectedItem?.label ?? placeholderValue}</p>
            <Icon label="Dropdown icon" size="medium" icon={<MdArrowDropDown color="#5D6071" />} />
          </div>
          {/* nowheel and nodrag allow proper scrolling when rendered inside a React Flow node  */}
          <ul className="select__menu nowheel nodrag" {...getMenuProps()}>
            {isOpen &&
              options.map((item, index) => (
                <li
                  className={clsx('select__option', { 'select__option--selected': highlightedIndex === index })}
                  key={`${item.value}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.label}
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
);

export default FormSelect;
