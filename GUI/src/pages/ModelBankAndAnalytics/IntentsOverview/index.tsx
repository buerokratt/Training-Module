import {FC, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@tanstack/react-query';
import {MdOutlineSettingsInputAntenna} from 'react-icons/md';

import {Card, DataTable, FormInput, FormSelect, Icon, Track} from 'components';
import {IntentsReport} from 'types/intentsReport';
import {Model} from 'types/model';
import { getColumns } from './columns';
import withAuthorization, { ROLES } from 'hoc/with-authorization';

const IntentsOverview: FC = () => {
    const {t} = useTranslation();
    const [filter, setFilter] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');

    const {data: models} = useQuery<Model[]>({
        queryKey: ['models'],
    });

    const [modelInUse, setModelInUse] = useState(false);
    const [trainedDate, setTrainedDate] = useState('')
    const [accuracyValue, setAccuracyValue] = useState(0);

    const {data: intentsReport, refetch} = useQuery<IntentsReport>({
        queryKey: [`model/get-report-by-name?fileName=${selectedModelId}`],
        enabled: false,
    });
    const nonIntents = ['accuracy','macro avg','weighted avg', 'micro avg'];

    useEffect(() => {
        if (!models) return;
        let deployed = models.find((model) => model.state === 'DEPLOYED');
        if (!deployed)
            deployed = models.find((model) => model.state === 'READY');
        if (!deployed)
            deployed = models?.[0];
        setSelectedModelId(deployed?.id || 0);
    }, [models])

    const modelsOptions = useMemo(() => {
        if (!models) return [];
        return models.map((model) => ({label: model.name, value: String(model.id)}));
    }, [models])

    useEffect(() => {
        if (!selectedModelId) return;
        refetch();
        setStatesById(selectedModelId);
    }, [selectedModelId])

    useEffect(() => {
        if (intentsReport?.intent_evaluation?.report) {
            setAccuracyValue(intentsReport?.intent_evaluation?.report['accuracy']);
        }
    }, [intentsReport]);

    const formattedIntentsReport = useMemo(
        () => intentsReport
            ? Object.keys(intentsReport.intent_evaluation.report).map((intent) => ({intent, ...intentsReport.intent_evaluation.report[intent]}))
            : [],
        [intentsReport],
    );

    const intentsReportColumns = useMemo(() => getColumns({ accuracyValue, nonIntents}), [accuracyValue]);

    const setStatesById = (modelId: string) => {
        if (!models) {
            return;
        }
        const selectedModel = models.find((m) => m.name === modelId)
        setModelInUse(selectedModel?.state.toUpperCase() === 'DEPLOYED');
        const date = selectedModel?.lastTrained.split('T')[0] ?? '';
        const [year, month, day] = date.split("-");
        setTrainedDate(`${day}.${month}.${year}`)
    }


    return (
        <>
            <h1>{t('training.mba.intentsOverview')}</h1>

            <Card>
                <Track gap={16}>
                    {models && (
                        <FormSelect
                            label={t('training.mba.modelOverview')}
                            name='model'
                            fitContent
                            options={modelsOptions}
                            value={String(selectedModelId)}
                            onSelectionChange={(model) => {
                                refetch();
                                setSelectedModelId(model?.value ?? '')
                                setStatesById(model?.value ?? '')
                            }
                            }
                        />
                    )}
                    {modelInUse && <Track gap={8} style={{whiteSpace: 'nowrap', color: '#308653'}}>
                        <Icon icon={<MdOutlineSettingsInputAntenna/>} size='medium'/>
                        <p>{t('training.mba.modelInUse')}</p>
                    </Track>}
                    {trainedDate && <p style={{color: '#4D4F5D', whiteSpace: 'nowrap'}}>
                        {t('training.mba.trained')}: {trainedDate}
                    </p>}
                </Track>
            </Card>

            <Card header={
                <FormInput
                    label={t('global.search')}
                    hideLabel
                    name='search'
                    placeholder={t('global.search') + '...'}
                    onChange={(e) => setFilter(e.target.value)}
                />
            }>
                <DataTable
                    data={formattedIntentsReport}
                    columns={intentsReportColumns}
                    globalFilter={filter}
                    setGlobalFilter={setFilter}
                />
            </Card>
        </>
    );
};

export default withAuthorization(IntentsOverview, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
