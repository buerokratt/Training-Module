import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineEdit, MdPlayCircleFilled, MdOutlineStop } from 'react-icons/md';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  MarkerType,
  Node,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { useNavigate, useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';

import { Box, Button, Collapsible, Icon, Track } from 'components';
import { Intent } from 'types/intent';
import { Responses } from 'types/response';
import { Story } from 'types/story';
import { Form } from 'types/form';
import CustomNode from './CustomNode';
import './StoriesDetail.scss';

const GRID_UNIT = 16;

const nodeTypes = {
  customNode: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: {
      x: 12 * GRID_UNIT,
      y: GRID_UNIT,
    },
    data: {
      label: <MdPlayCircleFilled />,
    },
    className: 'start',
    selectable: false,
    draggable: false,
  },
];

const StoriesDetail: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [editableTitle, setEditableTitle] = useState<string | null>(null);
  const { data: story } = useQuery<Story>({
    queryKey: [`stories/${id}`],
    enabled: !!id,
  });
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const { data: responses } = useQuery<Responses>({
    queryKey: ['responses'],
  });
  const { data: forms } = useQuery<Form[]>({
    queryKey: ['forms'],
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleNodeDelete = (id: string) => {
    setNodes((prevNodes) => {
      const deleteIndex = prevNodes.findIndex((n) => n.id === id);
      return prevNodes.slice(0, deleteIndex);
    });
  };

  const handleNodeAdd = ({ label, type, className }: { label: string; type: string, className: string }) => {
    setNodes((prevNodes) => {
      const prevNode = prevNodes[prevNodes.length - 1];
      if (prevNode.type === 'output') return prevNodes;
      const newNodeY = (prevNode.position.y + (prevNode.height || 0)) + (4 * GRID_UNIT);

      setEdges((prevEdges) => [...edges, {
        id: `edge-${prevEdges.length}`,
        source: prevNodes[prevNodes.length - 1].id,
        target: String(prevNodes.length + 1),
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }]);

      return [
        ...prevNodes,
        {
          id: String(prevNodes.length + 1),
          position: { x: (12 * GRID_UNIT) - 160 + 32, y: newNodeY },
          type: 'customNode',
          data: {
            label,
            onDelete: handleNodeDelete,
            type,
          },
          className,
        },
      ];
    });
  };

  const handleGraphSave = () => {
    setNodes((prevNodes) => {
      const prevNode = prevNodes[prevNodes.length - 1];
      if (prevNode.type === 'output') return prevNodes;
      const newNodeY = (prevNode.position.y + (prevNode.height || 0)) + (4 * GRID_UNIT);

      setEdges((prevEdges) => [...edges, {
        id: `edge-${prevEdges.length}`,
        source: prevNodes[prevNodes.length - 1].id,
        target: String(prevNodes.length + 1),
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }]);

      return [
        ...prevNodes,
        {
          id: String(prevNodes.length + 1),
          type: 'output',
          position: { x: 12 * GRID_UNIT, y: newNodeY },
          data: {
            label: <MdOutlineStop />,
          },
          className: 'end',
        },
      ];
    });
  };

  return (
    <Track gap={16} align='left' style={{ margin: '-16px' }}>
      <div style={{ flex: 1, maxWidth: 'calc(100% / 3)', padding: '16px 0 16px 16px' }}>
        <Track direction='vertical' gap={16} align='stretch'>
          {intents && (
            <Collapsible title={t('training.intents.title')} defaultOpen>
              <Track direction='vertical' align='stretch' gap={4}>
                {intents.map((intent) =>
                  <button
                    key={intent.id}
                    onClick={() => handleNodeAdd({
                      label: intent.intent,
                      type: 'intentNode',
                      className: 'intent',
                    })}
                  >
                    <Box color='blue'>
                      {intent.intent}
                    </Box>
                  </button>,
                )}
              </Track>
            </Collapsible>
          )}

          {responses && (
            <Collapsible title={t('training.responses.title')} defaultOpen>
              <Track direction='vertical' align='stretch' gap={4}>
                {Object.keys(responses).map((response, index) => (
                  <button
                    key={`${responses[response].text}-${index}`}
                    onClick={() => handleNodeAdd({
                      label: response,
                      type: 'responseNode',
                      className: 'response',
                    })}
                  >
                    <Box color='yellow'>
                      {response}
                    </Box>
                  </button>
                ))}
              </Track>
            </Collapsible>
          )}

          {forms && (
            <Collapsible title={t('training.forms.title')} defaultOpen>
              <Track direction='vertical' align='stretch' gap={4}>
                {forms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => handleNodeAdd({
                      label: form.form,
                      type: 'formNode',
                      className: 'form',
                    })}
                  >
                    <Box color='gray'>
                      {form.form}
                    </Box>
                  </button>
                ))}
              </Track>
            </Collapsible>
          )}

          <Collapsible title={t('training.actions.title')}>

          </Collapsible>
        </Track>
      </div>

      <div className='graph'>
        <div className='graph__header'>
          <Track gap={16}>
            <h2 className='h3'>Cursus Nibh Ullamcorper</h2>
            <Button appearance='text'>
              <Icon icon={<MdOutlineEdit />} />
              {t('global.edit')}
            </Button>
          </Track>
        </div>
        <div className='graph__body'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            snapToGrid
            snapGrid={[GRID_UNIT, GRID_UNIT]}
            defaultViewport={{ x: 0, y: 0, zoom: 0 }}
            minZoom={1}
            maxZoom={1}
            nodeTypes={nodeTypes}
          >
            <Background color='#D2D3D8' gap={16} lineWidth={2} />
          </ReactFlow>
        </div>
        <div className='graph__footer'>
          <Track gap={16} justify='end'>
            <Button appearance='secondary' onClick={() => navigate(-1)}>{t('global.back')}</Button>
            <Button appearance='error'>{t('global.delete')}</Button>
            <Button onClick={() => handleGraphSave()}>{t('global.save')}</Button>
          </Track>
        </div>
      </div>
    </Track>
  );
};

export default StoriesDetail;
