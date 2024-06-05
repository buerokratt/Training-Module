import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import {Tooltip} from 'components';
import i18n from "../../../../i18n";
import { truncateNumber } from "utils/truncateNumber";
import { IntentReport } from "types/intentsReport";

interface GetColumnsConfig {
  accuracyValue: number,
  nonIntents: string[],
}

export const getColumns = ({
  accuracyValue,
  nonIntents,
}: GetColumnsConfig) => {
  const columnHelper = createColumnHelper<IntentReport>();

  return [
    columnHelper.accessor('intent', {
        header: i18n.t('training.mba.intent') || '',
    }),
    columnHelper.display({
        id: 'detail',
        cell: (props) => (
          <div>
              {!nonIntents.includes(props.row.original.intent) && <Link
                  to={props.row.original.intent.startsWith('common')
                      ? `/training/common-intents?intent=${props.row.original.intent}#tabs`
                      : `/training/intents?intent=${props.row.original.intent}#tabs`
                  }
                  style={{color: '#005AA3'}}>
                  {i18n.t('training.mba.gotoExample')}
              </Link>}
          </div>
      ),
    }),
    columnHelper.accessor('support', {
        header: i18n.t('training.mba.examples') || '',
        cell: (props) => (
            <ColumnContainer original={props.row.original}>{props.getValue() && truncateNumber(props.getValue())}</ColumnContainer>
        ),
    }),
    columnHelper.accessor('precision', {
        header: i18n.t('training.mba.precision') || '',
        cell: (props) => (
            <ColumnContainer original={props.row.original}>{
              props.row.original.intent === 'accuracy' 
              ? truncateNumber(accuracyValue)
              : props.getValue() &&  truncateNumber(props.getValue()) 
              }</ColumnContainer>
        ),
    }),
    columnHelper.accessor('recall', {
        header: i18n.t('training.mba.recall') || '',
        cell: (props) => (
            <ColumnContainer original={props.row.original}>{props.getValue()?.toPrecision(2)}</ColumnContainer>
        ),
    }),
    columnHelper.accessor('f1-score', {
        header: () => (
            <Tooltip content={i18n.t('training.mba.f1Tooltip')}>
                <span>{i18n.t('training.mba.f1') || ''}</span>
            </Tooltip>
        ),
        cell: (props) => (
            <ColumnContainer original={props.row.original}>{props.getValue() && truncateNumber(props.getValue())}</ColumnContainer>
        ),
    }),
    columnHelper.display({
        id: 'suggestion',
        header: i18n.t('training.mba.suggestion') || '',
        cell: (props) => (
            <ColumnContainer original={props.row.original}>
                {props.row.original.support < 30 ? i18n.t('training.mba.addExamples') : <>&nbsp;</>}
            </ColumnContainer>
        ),
    })];
}

const ColumnContainer = ({ original, children }: { original: IntentReport, children: React.ReactNode}) => {
  let bgColor;
  if(original['f1-score'] >= 0.8)
    bgColor =  '#D9E9DF';
  else if (original['f1-score'] <= 0.3)
    bgColor = '#F7DBDB';

  return (
    <div style={{
      margin: '-12px -24px -12px -16px',
      padding: '12px 24px 12px 16px',
      backgroundColor: bgColor,
  }}>
    {children}
    </div>
  )
}
