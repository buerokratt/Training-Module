import React, {ChangeEvent, forwardRef, useId, useState} from 'react';

import './FormCheckboxes.scss';
import clsx from 'clsx';

export enum CheckboxType {
  DAYS,
}

type FormCheckboxesType = {
  label: string;
  name: string;
  hideLabel?: boolean;
  onValuesChange?: (values: Record<string, any>) => void;
  items: {
    label: string;
    value: string;
    checked: boolean | undefined;
  }[];
  [rest: string]: any;
  type?: CheckboxType;
}

const FormCheckboxes = forwardRef<HTMLInputElement, FormCheckboxesType>((
    {
      label,
      name,
      hideLabel,
      onValuesChange,
      items,
      type,
      ...rest },
    ref,
) => {
  const id = useId();
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>({});

  const handleValuesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [e.target.name]: [e.target.value],
    }));
    if (onValuesChange) onValuesChange(selectedValues);
  };

  return (
    <div className={clsx('checkboxes', type === CheckboxType.DAYS && 'checkboxes__days')} {...rest}>
      {label && !hideLabel && <label className='checkboxes__label'>{label}</label>}
      <div className='checkboxes__wrapper'>
        {items.map((item, index) => (
          <div key={`${item.value}-${index}`} className='checkboxes__item'>
            <input type='checkbox' name={name} ref={ref} id={`${id}-${item.value}`} checked={item.checked} value={item.value}
                   onChange={handleValuesChange} />
            <label htmlFor={`${id}-${item.value}`}>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
});

export default FormCheckboxes;
