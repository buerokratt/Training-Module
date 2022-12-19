import { FC, SelectHTMLAttributes } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import clsx from 'clsx';
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
  const selectClasses = clsx(
    'select',
    disabled && 'select--disabled',
  );

  return (
    <div className={selectClasses}>
      {label && !hideLabel && <label htmlFor={name} className='select__label'>{label}</label>}
      <RadixSelect.Root>
        <RadixSelect.Trigger className='select__trigger'>
          <RadixSelect.Value className='select__value' placeholder={placeholder} />
          <RadixSelect.Icon className='select__icon' asChild>
            <Icon label='Dropdown icon' icon={<MdArrowDropDown color='#5D6071' />} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content className='select__dropdown'>
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item value={option.value} className='select__option'>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
};

export default FormSelect;
