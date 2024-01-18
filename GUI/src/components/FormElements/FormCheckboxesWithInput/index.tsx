import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';
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
    displayInput: boolean;
    setGlobalFilter?: React.Dispatch<React.SetStateAction<string | undefined>>;
    onValuesChange?: (values: { slot_name: string; question: string }[]) => void;
    items: {
        label: string;
        value: string;
        checked: boolean | undefined;
    }[];
    [rest: string]: any;
    type?: CheckboxType;
};

const FormCheckboxesWithInput = forwardRef<HTMLInputElement, FormCheckboxesType>(
    (
        {
            label,
            globalFilter,
            setGlobalFilter,
            name,
            displayInput,
            selectedElements,
            hideLabel,
            onValuesChange,
            items,
            type,
            ...rest
        },
        ref,
    ) => {
        const [selectedValues, setSelectedValues] = useState<{ slot_name: string; question: string }[]>([]);
        const [filteredItems, setFilteredItems] = useState(items);

        useEffect(() => {
            if (setFilteredItems) {
                const filtered = items.filter((item) =>
                    item.label.toLowerCase().includes(globalFilter?.toLowerCase() || ''),
                );
                setFilteredItems(filtered);
            }
        }, [globalFilter, items]);

        const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { checked, value } = e.target;
            if (checked) {
                setSelectedValues((prevState) => [...prevState, { slot_name: value, question: '' }]);
            } else {
                setSelectedValues((prevState) =>
                    prevState.filter((item) => item.slot_name !== value),
                );
            }
        };

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            const slotName = e.target.getAttribute('data-slot-name') || '';

            setSelectedValues((prevState) =>
                prevState.map((item) => (item.slot_name === slotName ? { ...item, question: value } : item)),
            );
        };

        useEffect(() => {
            if (onValuesChange) {
                onValuesChange(selectedValues);
            }
        }, [selectedValues, onValuesChange]);

        return (
            <div className={clsx('checkboxes', type === CheckboxType.DAYS && 'checkboxes__days')} role='group' {...rest}>
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
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={`${rest.id}-${item.value}`}>{item.label}</label>
                            {displayInput && item.checked && (
                                <div className='input__wrapper'>
                                    <label>Question </label>
                                    <input
                                        type='text'
                                        className={'input'}
                                        placeholder='Enter question'
                                        data-slot-name={item.value}
                                        pattern={'^#([a-fA-F0-9]{3}){1,2}$'}
                                        value={
                                            selectedValues.find((selectedItem) => selectedItem.slot_name === item.value)?.question || ''
                                        }
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    },
);

export default FormCheckboxesWithInput;