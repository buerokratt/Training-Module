import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MdPlayCircleFilled, MdOutlineStop, MdOutlineSave, MdOutlineModeEditOutline } from 'react-icons/md';
import ReactFlow, { addEdge, Background, Connection, MiniMap, Node, useEdgesState, useNodesState } from 'reactflow';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import 'reactflow/dist/style.css';

import { Box, Button, Card, Collapsible, Dialog, FormInput, Icon, Track } from 'components';
import type { Response } from 'types/response';
import { Form } from 'types/form';
import { Slot } from 'types/slot';
import { useToast } from 'hooks/useToast';
import { addRule, deleteRule, editRule } from 'services/rules';
import CustomNode from './CustomNode';
import useDocumentEscapeListener from '../../../hooks/useDocumentEscapeListener';
import { generateRuleStepsFromNodes, generateNodesFromRuleActions, generateNodesFromRuleSteps } from 'services/rasa';
import { GRID_UNIT, generateNewEdge, generateNewNode } from 'services/nodes';
import LoadingDialog from '../../../components/LoadingDialog';
import { Rule, RuleDTO } from '../../../types/rule';
import withAuthorization, { ROLES } from 'hoc/with-authorization';
import './RulesDetail.scss';
import { useDebouncedFilter } from 'hooks/useDebouncedFilter';
import { getResponses } from 'services/responses';
import NodeList from 'pages/Training/Intents/NodeList';
import { getIntentIds } from 'services/intents';
import { IntentId } from 'types/intent';
import { getForms } from 'services/forms';

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

const RulesDetail: FC<{ mode: 'new' | 'edit' }> = ({ mode }) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [currentEntityId, setCurrentEntityId] = useState<string | undefined>(id);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [restartConfirmation, setRestartConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editableTitle, setEditableTitle] = useState<string | null>(null);
  const [currentEntity, setCurrentEntity] = useState<Rule | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<string>('rules');

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const { data: currentEntityData, refetch: refetchCurrentEntity } = useQuery<Rule>({
    queryKey: ['rule-by-name', currentEntityId],
    enabled: !!currentEntityId,
  });

  const { filter, setFilter } = useDebouncedFilter();
  // todo reset page size in hook!!!
  // todo add count for responses
  // todo ask freddy why only intents are open?
  // todo 'entities' request - from SlotsDetail? - seprate bug

  // todo totalCount type for ALL services

  // todo use domain-objects-with-pagination for forms and slots
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

    generateNodesFromRuleSteps(currentEntityData?.steps || currentEntity?.steps || []).forEach((x) => {
      edges.push(generateNewEdge(nodes, edges));
      nodes.push(generateNewNode({ ...x, nodes, handleNodeDelete, handleNodePayloadChange }));
    });

    if (
      currentEntityData &&
      ('conversation_start' in currentEntityData || 'wait_for_user_input' in currentEntityData)
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

  const addRuleMutation = useMutation({
    mutationFn: ({ data }: { data: RuleDTO }) => {
      return addRule(data);
    },
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['rules']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.ruleAdded'),
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

  const editRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RuleDTO }) => {
      return editRule(id, data);
    },
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['rules']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.ruleUpdated'),
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

  const deleteRuleMutation = useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteRule(id),
    onMutate: () => setRefreshing(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['rules']);
      toast.open({
        type: 'success',
        title: t('global.notification'),
        message: t('toast.ruleDeleted'),
      });
      navigate(`${import.meta.env.BASE_URL}/rules`);
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
    setDeleteId(id);
  };

  const handleNodeDeleteConfirmed = () => {
    setNodes((prevNodes) => {
      const deleteIndex = prevNodes.findIndex((n) => n.id === deleteId);
      return prevNodes.slice(0, deleteIndex);
    });
    setDeleteId('');
  };

  const handleNodeAdd = ({
    label,
    type,
    className,
    checkpoint,
    payload,
  }: {
    label: string;
    type: string;
    className: string;
    checkpoint?: boolean;
    payload?: any;
  }) => {
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
  };

  const title = currentEntityId || t('global.title');

  const handleGraphSave = async () => {
    const isRename = editableTitle && editableTitle !== id;
    if (!isRename) {
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
      rule: editableTitle || id || title,
      steps: generateRuleStepsFromNodes(nodes),
      ...(nodes.some((node) => node.data.label === 'conversation_start: true') && { conversation_start: true }),
      ...(nodes.some((node) => node.data.label === 'wait_for_user_input: false') && { wait_for_user_input: false }),
    };

    setRefreshing(true);
    if (mode === 'new') {
      addRuleMutation.mutate({ data, category });
    }
    if (mode === 'edit' && id) {
      editRuleMutation.mutate({ id, data, category });
    }
    await handleMutationLoadingAfterPopulateTable(data);

    if (isRename) {
      navigate(`${import.meta.env.BASE_URL}/rules/${editableTitle}`, {
        replace: true,
        state: {
          id: editableTitle,
          category: location.state?.category || category,
        },
      });
      setEditableTitle(null);
      setCurrentEntity({ steps: currentEntityData?.steps ?? [], id: editableTitle });
    }
  };

  const handleMutationLoadingAfterPopulateTable = async (data) => {
    let updatedData;

    if (!currentEntityId && editableTitle) {
      setCurrentEntityId(editableTitle);
      updatedData = await refetchCurrentEntity();
    }

    updatedData?.then((ruleObject) => {
      if (mode === 'new' && ruleObject.data != null && ruleObject.data.rule === editableTitle) {
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
        if (node.id !== id) {
          return node;
        }
        return { ...node, data: { ...node.data, payload } };
      });
    });
  };

  return (
    <Track gap={16} align="left" style={{ margin: '-16px' }}>
      <div style={{ flex: 1, maxWidth: 'calc(100% / 3)', padding: '16px 0 16px 16px' }}>
        <Track
          direction="vertical"
          gap={16}
          align="stretch"
          style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto', paddingBottom: '5vh' }}
        >
          <Card>
            <FormInput
              label={t('global.search')}
              name="search"
              placeholder={t('global.search') + '...'}
              hideLabel
              onChange={(e) => setFilter(e.target.value)}
            />
          </Card>
          {category === 'rules' && (
            <Collapsible title={t('training.conditions')}>
              <Track direction="vertical" align="stretch" gap={4}>
                <button
                  onClick={() =>
                    handleNodeAdd({
                      label: '',
                      type: 'conditionNode',
                      className: 'condition',
                    })
                  }
                >
                  <Box color="green">condition</Box>
                </button>
              </Track>
            </Collapsible>
          )}

          <NodeList<IntentId>
            queryKey={['intent-ids', filter]}
            fetchFn={getIntentIds}
            filter={filter}
            title={t('training.intents.title')}
            defaultOpen
            renderItem={(intent, ref) => (
              <button
                key={intent.id}
                onClick={() =>
                  handleNodeAdd({
                    label: intent.id,
                    type: 'intentNode',
                    className: 'intent',
                  })
                }
                ref={ref}
              >
                <Box color="blue">{intent.id}</Box>
              </button>
            )}
          />

          <NodeList<Response>
            queryKey={['responses', filter]}
            fetchFn={getResponses}
            filter={filter}
            title={t('training.responses.title')}
            renderItem={(response, ref) => (
              <button
                key={response.response}
                onClick={() =>
                  handleNodeAdd({
                    label: response.response,
                    type: 'responseNode',
                    className: 'response',
                  })
                }
                ref={ref}
              >
                <Box color="yellow">{response.response}</Box>
              </button>
            )}
          />

          <NodeList<string>
            queryKey={['forms', filter]}
            fetchFn={getForms}
            filter={filter}
            title={t('training.forms.title')}
            renderItem={(form, ref) => (
              <button
                key={form}
                onClick={() =>
                  handleNodeAdd({
                    label: form,
                    type: 'formNode',
                    className: 'form',
                  })
                }
                ref={ref}
              >
                <Box color="yellow">{form}</Box>
              </button>
            )}
          />

          {/* {forms && Array.isArray(forms) && (
            <Collapsible title={t('training.forms.title')}>
              <Track direction="vertical" align="stretch" gap={4}>
                {forms.map((form) => (
                  <button
                    key={form.form}
                    onClick={() =>
                      handleNodeAdd({
                        label: form.form,
                        type: 'formNode',
                        className: 'form',
                      })
                    }
                  >
                    <Box color="gray">{form.form}</Box>
                  </button>
                ))}
              </Track>
            </Collapsible>
          )} */}

          {slots && Array.isArray(slots) && (
            <Collapsible title={t('training.slots.title')}>
              <Track direction="vertical" align="stretch" gap={4}>
                {slots.map((slot) => (
                  <button
                    key={slot.name}
                    onClick={() =>
                      handleNodeAdd({
                        label: slot.name,
                        type: 'slotNode',
                        className: 'slot',
                      })
                    }
                  >
                    <Box color="dark-blue">{slot.name}</Box>
                  </button>
                ))}
              </Track>
            </Collapsible>
          )}

          <Collapsible title={t('training.actions.title')}>
            <Track direction="vertical" align="stretch" gap={4}>
              {category === 'rules' && (
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
                onClick={() =>
                  handleNodeAdd({
                    label: 'action_listen',
                    type: 'actionNode',
                    className: 'action',
                  })
                }
              >
                <Box color="orange">action_listen</Box>
              </button>
              <button
                onClick={() =>
                  handleNodeAdd({
                    label: 'action_restart',
                    type: 'actionNode',
                    className: 'action',
                  })
                }
              >
                <Box color="orange">action_restart</Box>
              </button>
              {category === 'rules' && (
                <button
                  onClick={() =>
                    handleNodeAdd({
                      label: 'wait_for_user_input: false',
                      type: 'actionNode',
                      className: 'action',
                    })
                  }
                >
                  <Box color="orange">wait_for_user_input</Box>
                </button>
              )}
            </Track>
          </Collapsible>
        </Track>
      </div>

      {refreshing && (
        <LoadingDialog title={t('global.updatingDataHead')}>
          <p>{t('global.updatingDataBody')}</p>
        </LoadingDialog>
      )}

      <div className="graph">
        <div className="graph__header">
          <Track gap={16}>
            {editableTitle !== null ? (
              <FormInput
                label="Rule title"
                name="ruleTitle"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                hideLabel
              />
            ) : (
              <h2 className="h3">{title}</h2>
            )}
            {editableTitle !== null ? (
              <Button appearance="text" onClick={handleGraphSave}>
                <Icon icon={<MdOutlineSave />} />
                {t('global.save')}
              </Button>
            ) : (
              <Button appearance="text" onClick={() => setEditableTitle(title)}>
                <Icon icon={<MdOutlineModeEditOutline />} />
                {t('global.edit')}
              </Button>
            )}
          </Track>
        </div>
        <div className="graph__body">
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
            <Background color="#D2D3D8" gap={16} lineWidth={2} />
          </ReactFlow>
        </div>
        <div className="graph__footer">
          <Track gap={16} justify="end">
            <Button appearance="secondary" onClick={() => navigate(-1)}>
              {t('global.back')}
            </Button>
            <Button appearance="secondary" onClick={() => setRestartConfirmation(true)}>
              {t('global.reset')}
            </Button>
            {mode === 'edit' && (
              <Button appearance="error" onClick={() => setDeleteConfirmation(true)}>
                {t('global.delete')}
              </Button>
            )}
            <Button onClick={handleGraphSave}>{t('global.save')}</Button>
          </Track>
        </div>
      </div>

      {deleteId && (
        <Dialog
          title={t('training.responses.deleteRule')}
          onClose={() => setDeleteId('')}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeleteId('')}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={handleNodeDeleteConfirmed}>
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
          title={t('training.responses.deleteRule')}
          onClose={() => setDeleteConfirmation(false)}
          footer={
            <>
              <Button appearance="secondary" onClick={() => setDeleteConfirmation(false)}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={() => deleteRuleMutation.mutate({ id })}>
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
              <Button appearance="secondary" onClick={() => setRestartConfirmation(false)}>
                {t('global.no')}
              </Button>
              <Button appearance="error" onClick={handleGraphReset}>
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

export default withAuthorization(RulesDetail, [
  ROLES.ROLE_ADMINISTRATOR,
  ROLES.ROLE_CHATBOT_TRAINER,
  ROLES.ROLE_SERVICE_MANAGER,
]);
