import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MdPlayCircleFilled,
  MdOutlineStop,
  MdOutlineSave,
  MdOutlineModeEditOutline,
} from 'react-icons/md';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import 'reactflow/dist/style.css';

import { Box, Button, Collapsible, Dialog, FormInput, Icon, Track } from 'components';
import { Responses } from 'types/response';
import { Story, StoryDTO } from 'types/story';
import { Form } from 'types/form';
import { Slot } from 'types/slot';
import { useToast } from 'hooks/useToast';
import { addStoryOrRule, deleteStoryOrRule, editStoryOrRule } from 'services/stories';
import CustomNode from './CustomNode';
import useDocumentEscapeListener from '../../../hooks/useDocumentEscapeListener';
import {
  generateStoryStepsFromNodes,
  generateNodesFromRuleActions,
  generateNodesFromStorySteps,
} from 'services/rasa';
import { GRID_UNIT, generateNewEdge, generateNewNode } from 'services/nodes';
import LoadingDialog from "../../../components/LoadingDialog";
import {Rule, RuleDTO} from "../../../types/rule";
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import './StoriesDetail.scss';

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
  const { id } = useParams<{ id: string }>()
  const [currentEntityId, setCurrentEntityId] = useState<string | undefined>(id);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [restartConfirmation, setRestartConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editableTitle, setEditableTitle] = useState<string | null>(null);
  const [currentEntity, setCurrentEntity] = useState<Story | Rule | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<string>('stories');

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const { data: currentEntityData, refetch: refetchCurrentEntity } = useQuery<Story | Rule>({
    queryKey: [category === 'rules' ? 'rule-by-name' : 'story-by-name', currentEntityId],
    enabled: !!currentEntityId,
  });

  const { data: intents } = useQuery<string[]>({
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

  useDocumentEscapeListener(() => setEditableTitle(null));

  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
      if (location.state.id) {
        setEditableTitle(location.state.id);
      }
    }

    setCurrentEntity(currentEntityData ?? null);

    let nodes = [...initialNodes];
    let edges: any[] = [];

    generateNodesFromStorySteps(currentEntityData?.steps || currentEntity?.steps || [])
        .forEach((x) => {
          edges.push(generateNewEdge(nodes, edges));
          nodes.push(generateNewNode({...x, nodes, handleNodeDelete, handleNodePayloadChange,}));
        });

    if (
      currentEntityData && (
        'conversation_start' in currentEntityData ||
          'wait_for_user_input' in currentEntityData
      )
    ) {
      generateNodesFromRuleActions(
        currentEntityData?.conversation_start ?? '',
        currentEntityData?.wait_for_user_input ?? ''
      ).forEach((x) => {
        edges.push(generateNewEdge(nodes, edges));
        nodes.push(
          generateNewNode({
            ...x,
            nodes,
            handleNodeDelete,
            handleNodePayloadChange,
          })
        );
      });
    }

    setNodes(nodes);
    setEdges(edges);

  }, [location.state, category, currentEntity, currentEntityData, setNodes, setEdges]);

  const addStoryMutation = useMutation({
    mutationFn: ({ data, category }: { data: StoryDTO | RuleDTO, category: string }) => {
      if (category === 'stories') {
        return addStoryOrRule(data as StoryDTO, category);
      } else {
        return addStoryOrRule(data as RuleDTO, category);
      }
    },
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['stories']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.storyAdded'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setRefreshing(false),
  });

  const editStoryMutation = useMutation({
    mutationFn: ({ id, data, category }: { id: string, data: StoryDTO | RuleDTO, category: string }) => {
      if (category === 'stories') {
        return editStoryOrRule(id, data as StoryDTO, category);
      } else {
        return editStoryOrRule(id, data as RuleDTO, category);
      }
    },
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['stories']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.storyUpdated'),
      });
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setRefreshing(false),
  });

  const deleteStoryMutation = useMutation({
    mutationFn: ({ id, category }: { id: string | number, category: string }) => deleteStoryOrRule(id, category),
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['stories']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.storyDeleted'),
      });
      navigate(`${import.meta.env.BASE_URL}/stories`);
    },
    onError: (error: AxiosError) => {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: error.message,
      });
    },
    onSettled: () => setRefreshing(false),
  });

  const handleNodeDelete = (id: string) => {
    setDeleteId(id)
  };

  const handleNodeDeleteConfirmed = () => {
    setNodes((prevNodes) => {
      const deleteIndex = prevNodes.findIndex((n) => n.id === deleteId);
      return prevNodes.slice(0, deleteIndex);
    });
    setDeleteId('');
  }

  const handleNodeAdd = (
    {
      label,
      type,
      className,
      checkpoint,
      payload,
    }: { label: string; type: string, className: string, checkpoint?: boolean, payload?: any }) => {
    setNodes((prevNodes) => {
      const prevNodeType = prevNodes[prevNodes.length - 1].type;
      if (prevNodeType === 'output') return prevNodes;

      setEdges((prevEdges) => [...edges, generateNewEdge(prevNodes, prevEdges)]);

      return [
        ...prevNodes,
        generateNewNode({
          label,
          type,
          className,
          checkpoint,
          payload,
          handleNodeDelete,
          handleNodePayloadChange,
          nodes: prevNodes,
        }),
      ];
    });
  };

  const addOutputNode = () => {
    setNodes((prevNodes) => {
      const prevNodeType = prevNodes[prevNodes.length - 1].type;
      if (prevNodeType === 'output') return prevNodes;

      setEdges((prevEdges) => [...edges, generateNewEdge(prevNodes, prevEdges)]);

      return [
        ...prevNodes,
        generateNewNode({
          nodeType: 'output',
          className: 'end',
          label: <MdOutlineStop />,
          nodes: prevNodes,
        }),
      ];
    });
  }

  const title = currentEntityId || t('global.title');

  const handleGraphSave = async () => {
    const isRename = editableTitle && editableTitle !== id;
    if(!isRename) {
      addOutputNode();
    }

    if ((!title || title === '') && (!editableTitle || editableTitle === '')) {
      toast.open({
        type: 'error',
        title: t('global.notificationError'),
        message: t('toast.titleCannotBeEmpty'),
      });
      return;
    }
    const data = {
      [category === 'stories' ? 'story' : 'rule']: editableTitle || id || title,
      steps: generateStoryStepsFromNodes(nodes),
      ...(nodes.some(
        (node) => node.data.label === 'conversation_start: true'
      ) && { conversation_start: true }),
      ...(nodes.some(
        (node) => node.data.label === 'wait_for_user_input: false'
      ) && { wait_for_user_input: false }),
    };

    setRefreshing(true);
    if (mode === 'new') {
      addStoryMutation.mutate({ data, category });
    }
    if (mode === 'edit' && id) {
      editStoryMutation.mutate({id, data, category});
    }
    await handleMutationLoadingAfterPopulateTable(data);

    if (isRename) {
      navigate(`${import.meta.env.BASE_URL}/stories/${editableTitle}`, {
        replace: true,
        state: {
          id: editableTitle,
          category: location.state?.category || category,
        },
      });
      setEditableTitle(null);
      setCurrentEntity({ steps: story?.steps, story: editableTitle });
    }
  };

  const handleMutationLoadingAfterPopulateTable = async (data) => {
    let updatedData;

    if (!currentEntityId && editableTitle) {
      setCurrentEntityId(editableTitle);
      updatedData = await refetchCurrentEntity();
    }

    updatedData?.then((storyOrRuleObject) => {
      if (mode === 'new' && (storyOrRuleObject.data != null && (storyOrRuleObject.data.story === editableTitle ||
                                                                storyOrRuleObject.data.rule === editableTitle))) {
        setRefreshing(false);
      } else {
        setTimeout(() => {
          handleMutationLoadingAfterPopulateTable(data);
        }, 1000);
      }
    });
  };

  const handleGraphReset = () => {
    setNodes(initialNodes);
    setRestartConfirmation(false);
  };

  const handleNodePayloadChange = (id: string, payload: any) => {
    setNodes((prevNodes) => { 
      return prevNodes.map((node) => {
        if(node.id !== id) {
          return node;
        }
        return {...node, data: { ...node.data, payload }};
      })
    });
  }

  return (
    <Track gap={16} align='left' style={{ margin: '-16px' }}>
      <div style={{ flex: 1, maxWidth: 'calc(100% / 3)', padding: '16px 0 16px 16px' }}>
        <Track
            direction="vertical"
            gap={16}
            align="stretch"
            style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto', paddingBottom: '5vh' }}
          >
          {category === 'rules' && (
              <Collapsible title={t('training.conditions')}>
                <Track direction='vertical' align='stretch' gap={4}>
                  <button
                      onClick={() => handleNodeAdd({
                        label: '',
                        type: 'conditionNode',
                        className: 'condition',
                      })}
                  >
                    <Box color='green'>condition</Box>
                  </button>
                </Track>
              </Collapsible>
          )}
          {intents && Array.isArray(intents) && (
            <Collapsible title={t('training.intents.title')} defaultOpen>
              <Track direction='vertical' align='stretch' gap={4}>
                {intents.map((intent) =>
                  <button
                    key={intent}
                    onClick={() => handleNodeAdd({
                      label: intent,
                      type: 'intentNode',
                      className: 'intent',
                    })}
                  >
                    <Box color='blue'>
                      {intent}
                    </Box>
                  </button>,
                )}
              </Track>
            </Collapsible>
          )}

          {responses && Array.isArray(responses) && (
            <Collapsible title={t('training.responses.title')}>
              <Track direction='vertical' align='stretch' gap={4}>
                {responses.map((response, index) => (
                  <button
                    key={response.name}
                    onClick={() => handleNodeAdd({
                      label: response.name,
                      type: 'responseNode',
                      className: 'response',
                    })}
                  >
                    <Box color='yellow'>
                      {response.name}
                    </Box>
                  </button>
                ))}
              </Track>
            </Collapsible>
          )}

          {forms && Array.isArray(forms) && (
            <Collapsible title={t('training.forms.title')}>
              <Track direction='vertical' align='stretch' gap={4}>
                {forms.map((form) => (
                  <button
                    key={form.form}
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

          {slots && Array.isArray(slots) && (
            <Collapsible title={t('training.slots.title')}>
              <Track direction='vertical' align='stretch' gap={4}>
                {slots.map((slot) => (
                  <button
                    key={slot.name}
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
            <Track direction='vertical' align='stretch' gap={4}>
              {category === 'stories' && (
                <button
                  onClick={() =>
                    handleNodeAdd({
                      label: 'Checkpoints:',
                      type: 'actionNode',
                      className: 'action',
                      checkpoint: true,
                    })
                  }
                >
                  <Box color="orange">checkpoints</Box>
                </button>
              )}
              {category === 'rules' && (
                <button
                  onClick={() =>
                    handleNodeAdd({
                      label: 'conversation_start: true',
                      type: 'actionNode',
                      className: 'action',
                    })
                  }
                >
                  <Box color="orange">conversation_start</Box>
                </button>
              )}
              <button
                onClick={() => handleNodeAdd({
                  label: 'action_listen',
                  type: 'actionNode',
                  className: 'action',
                })}
              >
                <Box color='orange'>action_listen</Box>
              </button>
              <button
                onClick={() => handleNodeAdd({
                  label: 'action_restart',
                  type: 'actionNode',
                  className: 'action',
                })}
              >
                <Box color='orange'>action_restart</Box>
              </button>
              {category === 'rules' && (
                <button
                  onClick={() => handleNodeAdd({
                    label: 'wait_for_user_input: false',
                    type: 'actionNode',
                    className: 'action',
                  })}
                >
                  <Box color='orange'>wait_for_user_input</Box>
                </button>
              )}
            </Track>
          </Collapsible>
        </Track>
      </div>

      {refreshing && (
          <LoadingDialog title={t('global.updatingDataHead')} >
            <p>{t('global.updatingDataBody')}</p>
          </LoadingDialog>
      )}

      <div className='graph'>
        <div className='graph__header'>
          <Track gap={16}>
            {editableTitle !== null ? (
                <FormInput
                    label='Story title'
                    name='storyTitle'
                    value={editableTitle}
                    onChange={(e) =>
                        setEditableTitle(e.target.value)
                    }
                    hideLabel
                />
            ) : (
                <h2 className='h3'>{title}</h2>
            )}
            {editableTitle !== null ? (
                <Button
                    appearance='text'
                    onClick={handleGraphSave}
                >
                  <Icon icon={<MdOutlineSave />} />
                  {t('global.save')}
                </Button>
            ) : (
                <Button
                    appearance='text'
                    onClick={() =>
                        setEditableTitle(title)
                    }
                >
                  <Icon icon={<MdOutlineModeEditOutline />} />
                  {t('global.edit')}
                </Button>
            )}
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
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            zoomOnDoubleClick
            panOnScroll
            nodeTypes={nodeTypes}
          >
            <MiniMap />
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
            <Button onClick={handleGraphSave}>{t('global.save')}</Button>
          </Track>
        </div>
      </div>

      {deleteId && (
        <Dialog
          title={t('training.responses.deleteStory')}
          onClose={() => setDeleteId('')}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeleteId('')}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={handleNodeDeleteConfirmed}
              >
                {t('global.yes')}
              </Button>
            </>
          }
        >
          <p>{t('global.removeValidation')}</p>
        </Dialog>
      )}

      {id && deleteConfirmation && (
        <Dialog
          title={t('training.responses.deleteStory')}
          onClose={() => setDeleteConfirmation(false)}
          footer={
            <>
              <Button appearance='secondary' onClick={() => setDeleteConfirmation(false)}>{t('global.no')}</Button>
              <Button
                appearance='error'
                onClick={() => deleteStoryMutation.mutate({ id, category })}
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

export default withAuthorization(StoriesDetail, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
