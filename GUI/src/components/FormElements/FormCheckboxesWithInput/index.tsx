import React, {ChangeEvent, forwardRef, useEffect, useId, useState} from 'react';

import './FormCheckboxesWithInput.scss';
import clsx from 'clsx';

export enum CheckboxType {
    DAYS,
}

type FormCheckboxesType = {
    label: string;
    globalFilter?: string;
    name: string;
    hideLabel?: boolean;
    setGlobalFilter?: React.Dispatch<React.SetStateAction<string | undefined>>;
    onValuesChange?: (values: Record<string, any>) => void;
    items: {
        label: string;
        value: string;
        checked: boolean | undefined;
    }[];
    [rest: string]: any;
    type?: CheckboxType;
}

const FormCheckboxesWithInput = forwardRef<HTMLInputElement, FormCheckboxesType>((
    {
        label,
        globalFilter,
        setGlobalFilter,
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
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        if (setFilteredItems) {
            const filtered = items.filter((item) =>
                item.label.toLowerCase().includes(globalFilter?.toLowerCase() || '')
            );
            setFilteredItems(filtered);
        }
    }, [globalFilter, items]);

    const handleValuesChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedValues((prevState) => ({
            ...prevState,
            [e.target.name]: [e.target.value],
        }));
        if (onValuesChange) onValuesChange(selectedValues);
    };

    return (
        <div className={clsx('checkboxes', type === CheckboxType.DAYS && 'checkboxes__days')}  role='group' {...rest}>
            {label && !hideLabel && <label className='checkboxes__label'>{label}</label>}
            <div className='checkboxes__wrapper'>
                {filteredItems.map((item, index) => (
                    <div key={`${item.value}-${index}`} className='checkboxes__item'>
                        <input
                            type='checkbox'
                            name={name}
                            ref={ref}
                            id={`${rest.id}-${item.value}`}
                            checked={item.checked}
                            value={item.value}
                            onChange={handleValuesChange}
                        />
                        <label htmlFor={`${rest.id}-${item.value}`}>{item.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default FormCheckboxesWithInput;
