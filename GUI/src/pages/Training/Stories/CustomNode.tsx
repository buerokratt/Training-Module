import { FC } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { MdOutlineDelete } from 'react-icons/md';

import { Button, Icon, Track } from 'components';
import IntentNode from './IntentNode';
import ResponseNode from './ResponseNode';
import FormNode from './FormNode';
import SlotNode from './SlotNode';

type NodeDataProps = {
  data: {
    label: string;
    onDelete: (id: string) => void;
    type: string;
  }
}

const CustomNode: FC<NodeProps & NodeDataProps> = (props) => {
  const { t } = useTranslation();
  const { data, isConnectable, id } = props;

  return (
    <>
      <div className='react-flow__node-delete'>
        <Button appearance='icon' aria-label={t('global.delete') || ''} onClick={() => data.onDelete(id)}>
          <Icon icon={<MdOutlineDelete fontSize={24} />} size='medium' />
        </Button>
      </div>

      <Handle
        type='target'
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <Track direction='vertical' gap={4} align='left'>
        {data.type === 'intentNode' && <IntentNode data={data} />}
        {data.type === 'responseNode' && <ResponseNode data={data} />}
        {data.type === 'formNode' && <FormNode data={data} />}
        {data.type === 'slotNode' && <SlotNode data={data} />}
      </Track>

      <Handle
        type='source'
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default CustomNode;
