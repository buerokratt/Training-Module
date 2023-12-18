import { MarkerType, Node } from "reactflow";

export const GRID_UNIT = 16;

export const generateNewEdge = (_nodes: Node[], _edges: any[]) => ({
  id: `edge-${_edges.length}`,
  source: _nodes[_nodes.length - 1].id,
  target: String(_nodes.length + 1),
  markerEnd: {
    type: MarkerType.ArrowClosed,
  }
})

export type GenerateNewNodeConfig = {
  label: string | JSX.Element;
  type?: string;
  className: string;
  checkpoint?: boolean;
  payload?: any;
  handleNodeDelete?: (id: string) => void;
  handleNodePayloadChange?: (id: string, payload: any) => void;
  nodes: Node[];
  nodeType?: string;
}

export const generateNewNode = ({
    label,
    type,
    className,
    checkpoint,
    payload,
    handleNodeDelete,
    handleNodePayloadChange,
    nodes,
    nodeType = 'customNode',
  }: GenerateNewNodeConfig, ) => {
    const prevNode = nodes[nodes.length - 1];

    let height = 0;
    if(!prevNode.height && prevNode.data.type == 'intentNode'){
      height = (prevNode.data.payload?.entities?.length || 4) * 2 * GRID_UNIT;
    }
    else if(!prevNode.height && prevNode.data.type == 'conditionNode'){
      height = (prevNode.data.payload?.conditions?.length || 8) * 2 * GRID_UNIT;
    }
    const newNodeY = (prevNode.position.y + (prevNode.height || height)) + (6 * GRID_UNIT);

    return {
      id: String(nodes.length + 1),
      position: { x: (12 * GRID_UNIT) - 160 + 32, y: newNodeY },
      type: nodeType,
      data: {
        id: String(nodes.length + 1),
        label,
        onDelete: handleNodeDelete,
        type,
        checkpoint,
        onPayloadChange: handleNodePayloadChange,
        payload: payload || {},
      },
      className,
    }
}
