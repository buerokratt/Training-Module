import {FC, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {Controller, useForm, useWatch} from 'react-hook-form';

import './HistoricalChat.scss';

import {Button, Dialog, FormInput, Switch, Track} from 'components';
import {Message} from 'types/message';
import {Intent} from 'types/intent';
import Select from 'react-select';

type NewExampleForm = {
    example: string;
    intent: string;
    newIntent: boolean;
    intentName?: string;
}

type NewExampleModalProps = {
    message: Message;
    setMessage: (payload: Message | null) => void;
    onSubmitExample: (data: NewExampleForm) => void;
}

const NewExampleModal: FC<NewExampleModalProps> = ({message, setMessage, onSubmitExample}) => {
    const {t} = useTranslation();
    const [isNewIntent, setIsNewIntent] = useState<boolean>(false)
    const [selectedIntent, setSelectedIntent] = useState<string>('');
    const {data: intents} = useQuery<Intent[]>({
        queryKey: ['intent-and-id'],
    });
    const {register, control, handleSubmit} = useForm<NewExampleForm>({
        mode: 'onChange',
    });

    const requiredText = t('settings.users.required') ?? '*';


    const watchIntent = useWatch({
        control,
        name: 'newIntent',
    });

    const handleNewExample = handleSubmit((data) => {
        if (!isNewIntent) {
            data.intentName = selectedIntent;
        }
        onSubmitExample(data);
    });

    return (
        <Dialog
            title={t('training.mba.addExamples')}
            onClose={() => setMessage(null)}
            footer={
                <>
                    <Button appearance='secondary' onClick={() => setMessage(null)}>
                        {t('global.cancel')}
                    </Button>
                    <Button onClick={handleNewExample}>{t('global.save')}</Button>
                </>
            }
        >
            <Track direction='vertical' gap={16} align='left'>
                <FormInput {...register('example')} label={t('training.intents.example')}
                           defaultValue={message.content || ''}/>
                {intents && !isNewIntent && (
                    <Controller
                        control={control}
                        name="intent"
                        rules={{required: requiredText}}
                        render={({field: {onChange, onBlur, value, name, ref}}) => {
                            const options = intents.map((intent) => ({
                                label: intent.intent ?? '',
                                value: String(intent.id),
                            }));

                            const selectedOption = options.find((option) => option.value === value) || null;

                            return (
                                <div className="multiSelect">
                                    <label className="multiSelect__label">
                                        {t('training.mba.intent')}
                                    </label>
                                    <div className="multiSelect__wrapper">
                                        <Select
                                            inputId={name}
                                            name={name}
                                            ref={ref}
                                            onBlur={onBlur}
                                            options={options}
                                            value={selectedOption}
                                            isMulti={false}
                                            placeholder={t('global.choose')}
                                            maxMenuHeight={165}
                                            onChange={(selected) => {
                                                setSelectedIntent(selected?.value ?? '')
                                                onChange(selected?.value ?? '');
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    />
                )}
                <Controller
                    name='newIntent'
                    control={control}
                    render={({field}) => (
                        <Switch
                            {...field}
                            label={t('training.newIntent')}
                            onLabel={t('global.yes') || ''}
                            offLabel={t('global.no') || ''}
                            onCheckedChange={(checked) => {
                                setIsNewIntent(checked)
                                field.onChange(checked)
                            }}
                        />
                    )}
                />

                {watchIntent && (
                    <FormInput {...register('intentName')} label={t('training.intentName')}/>
                )}
            </Track>
        </Dialog>
    );
};

export default NewExampleModal;
