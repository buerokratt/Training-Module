import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineEdit, MdPlayCircleFilled } from 'react-icons/md';
import ReactFlow, { addEdge, Background, Connection, MarkerType, Node, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { Box, Button, Collapsible, Icon, Track } from 'components';
import { Intent } from 'types/intent';
import { Responses } from 'types/response';
import './StoriesDetail.scss';

const GRID_UNIT = 16;

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
  const { data: intents } = useQuery<Intent[]>({
    queryKey: ['intents'],
  });
  const { data: responses } = useQuery<Responses>({
    queryKey: ['responses'],
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleNodeAdd = ({ label, className }: { label: string; className: string }) => {
    setNodes((prevNodes) => {
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
          type: 'default',
          position: { x: (prevNodes.length * 9) * GRID_UNIT, y: 4 * GRID_UNIT },
          data: {
            label,
          },
          className,
        },
      ];
    });
  };

  return (
    <Track gap={16} align='left' style={{ height: '100%' }}>
      <div style={{ flex: 1, maxWidth: 'calc(100% / 3)', height: '100%', overflow: 'auto' }}>
        <Track direction='vertical' gap={16} align='stretch'>
          {intents && (
            <Collapsible title={t('training.intents.title')} defaultOpen>
              <Track direction='vertical' align='stretch' gap={4}>
                {intents.map((intent) =>
                  <button key={intent.id} onClick={() => handleNodeAdd({ label: intent.intent, className: 'intent' })}>
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
                  <button key={`${responses[response].text}-${index}`}
                          onClick={() => handleNodeAdd({ label: response, className: 'response' })}>
                    <Box color='yellow'>
                      {response}
                    </Box>
                  </button>
                ))}
              </Track>
            </Collapsible>
          )}

          <Collapsible title={t('training.forms.title')} defaultOpen>

          </Collapsible>

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
            // fitView
            snapToGrid
            snapGrid={[GRID_UNIT, GRID_UNIT]}
            defaultViewport={{ x: 0, y: 0, zoom: 0 }}
            minZoom={1}
            maxZoom={1}
          >
            <Background color='#D2D3D8' gap={16} lineWidth={2} />
          </ReactFlow>
        </div>
        <div className='graph__footer'>
          <Track gap={16} justify='end'>
            <Button appearance='secondary'>{t('global.back')}</Button>
            <Button appearance='error'>{t('global.delete')}</Button>
            <Button>{t('global.save')}</Button>
          </Track>
        </div>
      </div>
    </Track>
  );
};

export default StoriesDetail;
