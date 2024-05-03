import React, {ChangeEvent, forwardRef, useEffect, useState} from 'react';
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
    selectedElements: {slot_name: string, question: string}[]
    setGlobalFilter?: React.Dispatch<React.SetStateAction<string | undefined>>;
    onValuesChange?: (values: { slot_name: string; question: string }[]) => void;
    items: {
        label: string;
        text: string;
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
        const [selectedValues, setSelectedValues] = useState<{ slot_name: string; question: string }[]>( selectedElements ?? []);
        const [filteredItems, setFilteredItems] = useState(items);

        useEffect(() => {
            if (setFilteredItems) {
                const filtered = items.filter((item) =>
                    item.label.toLowerCase().includes(globalFilter?.toLowerCase() ?? ''),
                );
                setFilteredItems(filtered);
            }
        }, [globalFilter, items]);

        useEffect(() => {
            if(selectedElements) {
                setSelectedValues(selectedElements);
            }
        }, [selectedElements]);


        const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
            items.map((element) => {
                if(element.label === e.target.value) {
                  element.checked = !element.checked;
                  return element.checked;
                }
                return element;
            })

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
            const slotName = e.target.getAttribute('data-slot-name') ?? '';

            setSelectedValues((prevState) =>
                prevState.map((item) => (item.slot_name === slotName ? { ...item, question: value } : item)),
            );
        };

        useEffect(() => {
            if (onValuesChange) {
                onValuesChange(selectedValues);
            }
        }, [selectedValues, onValuesChange]);

        const inputClasses = clsx(
            'input'
        );

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
                                checked={selectedValues?.some((selectedItem) => selectedItem.slot_name === item.value) || item.checked}
                                value={item.value}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={`${rest.id}-${item.value}`}>{item.label}</label>
                            {displayInput && selectedValues?.some((selectedItem) => selectedItem.slot_name === item.value) && (
                                <div className={'input'} style={{width: '100%', paddingTop: '7px'}}>
                                        <p style={{minWidth: '100px', paddingLeft: '17px'}}>utter_ask</p>
                                        <input
                                            type='text'
                                            className={inputClasses}
                                            data-slot-name={item.value}
                                            pattern={'^#([a-fA-F0-9]{3}){1,2}$'}
                                            defaultValue = {
                                                selectedValues.find((selectedItem) => selectedItem.slot_name === item.value)?.question || item.text || ''
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
