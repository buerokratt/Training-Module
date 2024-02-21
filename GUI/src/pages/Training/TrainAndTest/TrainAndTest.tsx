import {Box, Button, Card, FormInput, FormSelect, Switch} from 'components';
import {t} from 'i18next';
import styles from './TrainAndTest.module.scss';
import FormDaySelect, {DaysSelect} from 'components/FormElements/FormDaySelect/FormDaySelect';
import {AiOutlineExclamationCircle} from 'react-icons/ai';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {TrainConfigData, TrainConfigDataEditDTO} from "../../../types/trainSettings";
import {Controller, useForm} from "react-hook-form";
import {AxiosError} from "axios";
import {useToast} from "../../../hooks/useToast";
import {updateTrainSettings} from "../../../services/train-settings";
import React, {useEffect, useState} from "react";

type Props = {};

const TrainAndTest = (props: Props) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const {data: configData, refetch} = useQuery<TrainConfigData>({
        queryKey: ['training/train-settings'],
    });
    const [folds, setFolds] = useState<string>('0');
    const [scheduled, setScheduled] = useState<boolean>(false);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState<string>('12:00:00');
    const [days, setDays] = useState<DaysSelect[]>([]);

    const {register, control, handleSubmit, reset} = useForm<TrainConfigDataEditDTO>({
        mode: 'onChange',
        shouldUnregister: true,
    });

    useEffect(() => {
        if (configData) {
            console.log(String(configData[0].folds));
            console.log(configData[0])
            setFolds(String(configData[0].folds));
            setScheduled(configData[0].scheduled)
            reset(configData[0]);
        }
    }, [reset, configData]);

    const trainSettingsEditMutation = useMutation({
        mutationFn: (request: TrainConfigDataEditDTO) => updateTrainSettings(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['training/train-settings']);
            refetch();
            toast.open({
                type: 'success',
                title: t('global.notification'),
                message: 'Train settings changes saved',
            });
        },
        onError: (error: AxiosError) => {
            toast.open({
                type: 'error',
                title: t('global.notificationError'),
                message: error.message,
            });
        },
    });

    const handleTrainSettingsSave = handleSubmit((data) => {
        console.log(data)
        // trainSettingsEditMutation.mutate(data);
    });

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <h1>{t('training.trainNew.title')}</h1>
                <p className={styles.top__date}>
                    {t('training.trainNew.lastTrained', {
                        date: '12.10.2022',
                        time: '12:30:00',
                    })}
                </p>
                <Button appearance="primary">{t('training.trainNew.trainNow')}</Button>
            </div>
            {/*<Box*/}
            {/*    color="red"*/}
            {/*    style={{*/}
            {/*        width: '100%',*/}
            {/*        display: 'flex',*/}
            {/*        justifyContent: 'flex-start',*/}
            {/*        alignItems: 'center',*/}
            {/*        gap: 8,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <AiOutlineExclamationCircle/>*/}
            {/*    <p className={styles.warning}>*/}
            {/*        {t('training.trainNew.warning', {*/}
            {/*            date: '12.10.2022',*/}
            {/*            time: '12:30:00',*/}
            {/*        })}*/}
            {/*    </p>*/}
            {/*</Box>*/}
            <Card
                header={t('training.trainNew.trainingTitle')}
                style={{
                    width: '100%',
                }}
            >
                <div className={styles.card}>
                    <div className={`${styles.trainingInput} ${styles.input}`}>
                        <Controller name='folds' control={control} render={({ field }) =>
                            <FormInput
                                {...field}
                                value={folds}
                                label={t('training.trainNew.folds')}
                                type="number"
                                onChange={(e) => {
                                    setFolds(e.target.value);
                                    field.onChange(parseInt(e.target.value));
                                }}
                            />
                        } />
                    </div>
                    <div className={`${styles.trainingSwitch} ${styles.input}`}>
                        <Controller name='scheduled' control={control} render={({ field }) =>
                            <Switch
                                {...field}
                                checked={scheduled}
                                onCheckedChange={(e) => {
                                    setScheduled(e)
                                    field.onChange(e)} }
                                onLabel={t('global.yes') || ''}
                                offLabel={t('global.no') || ''}
                                label={t('training.trainNew.repeatTraining')}
                            />
                        } />
                    </div>
                </div>
            </Card>
            {scheduled && (
                <>
                    <Card
                        header={t('training.trainNew.planTitle')}
                        style={{
                            width: '100%',
                        }}
                    >
                        <div className={styles.card}>
                            <div className={`${styles.planDate} ${styles.input}`}>
                                <Controller name='date' control={control} render={({ field }) =>
                                    <FormInput
                                        {...field}
                                        value={date}
                                        label={t('training.trainNew.date')}
                                        type="date"
                                        onChange={(e) => {
                                            setDate(e.target.value);
                                            field.onChange(e.target.value);
                                        }}
                                    />
                                } />
                            </div>

                            <div className={`${styles.planDays} ${styles.input}`}>
                                <span>{t('training.trainNew.days')}</span>
                                {/*<FormDaySelect*/}
                                {/*    onCheckedChange={(days) => setData({ ...data, days })}*/}
                                {/*/>*/}
                                <Controller name='days' control={control} render={({ field }) =>
                                    <FormDaySelect
                                        {...field}
                                        onCheckedChange={(days) => {
                                            setDays(days);
                                            field.onChange(days);
                                        }}
                                    />
                                } />
                            </div>
                            <div className={`${styles.planTime} ${styles.input}`}>
                                <Controller name='time' control={control} render={({ field }) =>
                                    <FormInput
                                        {...field}
                                        value={time}
                                        label={t('training.trainNew.time')}
                                        type="time"
                                        step="1"
                                        onChange={(e) => {
                                            setTime(e.target.value);
                                            field.onChange(e.target.value);
                                        }}
                                    />
                                } />
                            </div>
                        </div>
                    </Card>
                </>
            )}
            <div className={styles.bottom}>
                <Button onClick={handleTrainSettingsSave} appearance="primary">{t('global.save')}</Button>
            </div>
        </div>
    );
};

export default TrainAndTest;
