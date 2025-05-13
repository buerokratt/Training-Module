import {FC, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';

import {Button, Dialog, Track} from 'components';
import {Intent} from 'types/intent';
import Select from 'react-select';
import './MoveExampleModal.scss';

type MoveExampleForm = {
    intent: string;
    example: string;
}

type MoveExampleModalProps = {
    example: string;
    onSubmitExample: (data: MoveExampleForm) => void;
    onClose: () => void;
}

const MoveExampleModal: FC<MoveExampleModalProps> = ({onSubmitExample, onClose, example}) => {
    const {t} = useTranslation();
    const [selectedIntent, setSelectedIntent] = useState<string>('');
    const {data: intents} = useQuery<Intent[]>({
        queryKey: ['intent-and-id'],
    });
    const {control, handleSubmit} = useForm<MoveExampleForm>({
        mode: 'onChange',
    });

    const processedIntents = intents?.map((intent) => ({
        ...intent,
        displayLabel: intent.intent?.trim().replace(/_/g, ' ') ?? '',
    }));

    const handleNewExample = handleSubmit((data) => {
        onSubmitExample({intent: selectedIntent, example: example});
    });

    return (
        <Dialog
            title={t('training.intents.newIntentLocation')}
            onClose={onClose}
            footer={
                <>
                    <Button appearance='secondary' onClick={onClose}>
                        {t('global.cancel')}
                    </Button>
                    <Button onClick={handleNewExample} disabled={!selectedIntent}>
                        {t('global.save')}
                    </Button>
                </>
            }
        >
            <Track direction="vertical" gap={16} align="left">
                {processedIntents && (
                    <Controller
                        disabled={true}
                        name="intent"
                        control={control}
                        render={({field}) => (
                            <div className="multiSelect">
                                <label className="multiSelect__label">{t('training.mba.intent')}</label>
                                <div className="multiSelect__wrapper">
                                    <Select
                                        options={processedIntents.map((intent) => ({
                                            label: intent.displayLabel,
                                            value: String(intent.id)
                                        }))}
                                        placeholder={t('global.choose')}
                                        onChange={(selected) => {
                                            setSelectedIntent(selected?.value ?? '');
                                            field.onChange(selected);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    />
                )}
            </Track>
        </Dialog>
    );
};

export default MoveExampleModal;
