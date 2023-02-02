import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { AxiosError } from 'axios';
import 'reactflow/dist/style.css';

import { Box, Button, Collapsible, Dialog, Icon, Track } from 'components';
import { Intent } from 'types/intent';
import { Responses } from 'types/response';
import { Story } from 'types/story';
import { Form } from 'types/form';
import { Slot } from 'types/slot';
import { deleteIntent } from 'services/intents';
import { useToast } from 'hooks/useToast';
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
      x: 14 * GRID_UNIT,
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

const StoriesDetail: FC<{ mode: 'new' | 'edit' }> = ({ mode }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [restartConfirmation, setRestartConfirmation] = useState(false);
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
  const { data: slots } = useQuery<Slot[]>({
    queryKey: ['slots'],
  });

  const deleteStoryMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteIntent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['stories']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: 'Intent deleted',
      });
      navigate(import.meta.env.BASE_URL + 'treening/treening/kasutuslood');
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
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

  const handleGraphReset = () => {
    setNodes(initialNodes);
    setRestartConfirmation(false);
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
            <Collapsible title={t('training.responses.title')}>
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
            <Collapsible title={t('training.forms.title')}>
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

          {slots && (
            <Collapsible title={t('training.slots.title')}>
              <Track direction='vertical' align='stretch' gap={4}>
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleNodeAdd({
                      label: slot.name,
                      type: 'slotNode',
                      className: 'slot',
                    })}
                  >
                    <Box color='dark-blue'>
                      {slot.name}
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
            <h2 className='h3'>{mode === 'new' ? t('global.title') : 'Cursus Nibh Ullamcorper'}</h2>
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
            <Button appearance='secondary' onClick={() => setRestartConfirmation(true)}>{t('global.reset')}</Button>
            {mode === 'edit' && (
              <Button appearance='error' onClick={() => setDeleteConfirmation(true)}>{t('global.delete')}</Button>
            )}
            <Button onClick={() => handleGraphSave()}>{t('global.save')}</Button>
          </Track>
        </div>
      </div>

      {id && deleteConfirmation && (
        <Dialog
          title={t('training.responses.deleteStory')}
          onClose={() => setDeleteConfirmation(false)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeleteConfirmation(false)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteStoryMutation.mutate({ id })}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}

      {restartConfirmation && (
        <Dialog
          title={t('global.reset')}
          onClose={() => setRestartConfirmation(false)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setRestartConfirmation(false)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={handleGraphReset}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}
    </Track>
  );
};

export default StoriesDetail;
