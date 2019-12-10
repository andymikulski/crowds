import Vector from "../etc/Vector2D";
import { TerrainDisplay } from "../Display/TerrainDisplay";
import { CELL_SIZE } from "../config";

type ArrayIndex = number;

export type FlowFieldData = {
  flowCells: Vector[];
  cellCosts: number[];

  width: number;
  height: number;
  cellSize: number;
  origin: Vector;
};


type DistNode = {
  position: Vector;
  index: ArrayIndex;
  distance: number;
}

export type FlowList = {
  list: Vector[];
  lastPos: Vector[];
}

export class FlowField {
  static getDirectionAt(field: FlowFieldData, x: number, y: number) {
    return field.flowCells[(y * field.width) + x];
  }
  static getCostAt(field: FlowFieldData, x: number, y: number) {
    return field.cellCosts[(y * field.width) + x];
  }

  static reset1dArrayValues<T>(arr: any[], width: number, height: number, value: T): T[] {
    arr = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        arr[(y * width) + x] = value;
      }
    }
    return arr;
  }

  static reset2dArrayValues<T>(arr: any[], width: number, height: number, value: T): T[] {
    for (let y = 0; y < height; y++) {
      arr[y] = [];
      for (let x = 0; x < width; x++) {
        arr[y][x] = value;
      }
    }
    return arr;
  }

  static getIndexForPos(field: FlowFieldData, x: number, y: number) {
    return (y * field.width) + x;
  }

  static getPosForIndex(field: FlowFieldData, index: number) {
    return Vector.get([index % field.width, Math.floor(index / field.width)]);
  }

  /**
   * returns
   */
  static getCellNeighborPositions(field: FlowFieldData, node: { position: Vector }): Vector[] {
    const xMax = field.width;
    const yMax = field.height;
    const pos = node.position.values;
    let found: Vector[] = [];

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        // something funky here
        if ((x === 0 && y === 0) || x === y ) { continue; }
        if (pos[0] + x >= 0 && pos[0] + x <= xMax && pos[1] + y >= 0 && pos[1] + y <= yMax) {
          found.push(Vector.get([pos[0] + x, pos[1] + y]));
        }
      }
    }

    return found;
  }

  static createFlowField(terrain: TerrainDisplay): FlowFieldData {
    return {
      cellCosts: [],
      cellSize: CELL_SIZE,
      flowCells: [],
      height: terrain.height,
      width: terrain.width,
      origin: Vector.get([0, 0]),
    };
  }

  static async calculateCostField(field: FlowFieldData, terrain: TerrainDisplay, target: Vector) {
    //Generate an empty grid, set all places as weight null, which will stand for unvisited
    const dijkstraGrid = FlowField.reset1dArrayValues<number>([], field.width, field.height, null);

    const startPoint: DistNode = {
      distance: 0,
      index: FlowField.getIndexForPos(field, target.values[0], target.values[1]),
      position: Vector.get(target),
    };

    //flood fill out from the end point
    dijkstraGrid[startPoint.index] = 0;

    const toVisit: DistNode[] = [startPoint];

    //for each node we need to visit, starting with the pathEnd
    // for (let i = 0; i < toVisit.length; i++) {
    while (toVisit.length > 0) {
      const current = toVisit.shift();
      const neighbors = FlowField.getCellNeighborPositions(field, current);

      //for each neighbour of this node
      for (let j = 0; j < neighbors.length; j++) {
        const n = neighbors[j];

        const walkabilityWeight = FlowField.getCellNeighborPositions(field, { position: n }).reduce((prev, curr) => {
          return (prev + 1 + terrain.valueAt(curr.values[0], curr.values[1])) / 2;
          // if (!terrain.isWalkableAt(curr.values[0], curr.values[1])) {
          //   return prev * 2;
          // } else {
          //   return prev;
          // }
        }, 1);

        const idx = FlowField.getIndexForPos(field, n.values[0], n.values[1]);
        if (terrain.isWalkableAt(n.values[0], n.values[1]) && dijkstraGrid[idx] === null) {
          // let thisCost = 1 + (terrain.valueAt(n.values[0], n.values[1]) > (terrain.walkableThreshold * 0.5) ? 100000 : 0);
          const neighborNode: DistNode = {
            distance: current.distance + 1, //  walkabilityWeight, // + terrain.valueAt(n.values[0], n.values[1]),
            index: idx,
            position: n,
          };
          dijkstraGrid[idx] = neighborNode.distance;
          toVisit.push(neighborNode);
        }
      }
    }

    return dijkstraGrid;
  }

  static async calculateFlows(field: FlowFieldData, terrain: TerrainDisplay, costs: number[]): Promise<Vector[]> {
    const flows = FlowField.reset1dArrayValues<Vector>([], field.width, field.height, null);

    // let flows: Vector[] = [];
    let position:Vector;
    let neighbors:Vector[];
    // console.log('costs', costs.length);
    // for (let i = 0; i < costs.length; i++) {
    for (let y = 0; y < field.height; y++) {
      for (let x = 0; x < field.width; x++) {
        position = Vector.get([x, y]);
        // console.log('here', i, position.toString());
        neighbors = FlowField.getCellNeighborPositions(field, { position });

        let lowestCost = Infinity;
        let lowestNeighbor = null;
        for (let j = 0; j < neighbors.length; j++) {
          // if (!terrain.isWalkableAt(neighbors[j].values[0], neighbors[j].values[1])) {
          //   continue;
          // }

          let neighborIdx = FlowField.getIndexForPos(field, neighbors[j].values[0], neighbors[j].values[1]);
          let neighborCost = costs[neighborIdx];
          if (neighborCost <= lowestCost) {
            lowestCost = neighborCost;
            lowestNeighbor = neighbors[j];
          }
        }

        let idx = FlowField.getIndexForPos(field, x, y);
        if (lowestNeighbor) {
          flows[idx] = Vector.get(lowestNeighbor).sub(position).normalize();
        } else {
          flows[idx] = null;
        }

        Vector.free(position);
      }
    }


    // }

    return flows;
  }

  static async generate(terrain: TerrainDisplay, pointOfInterest: Vector): Promise<FlowFieldData> {
    // let idx;
    // let cells:Vector[] = [];

    const field = FlowField.createFlowField(terrain);
    field.origin = pointOfInterest;

    const costs = await FlowField.calculateCostField(field, terrain, pointOfInterest);
    const flows = await FlowField.calculateFlows(field, terrain, costs);

    /**  TODO: Add the breadth-first algo which builds out flow field **/

    return {
      cellCosts: costs,
      flowCells: flows,
      cellSize: CELL_SIZE,
      height: terrain.height,
      width: terrain.width,
      origin: pointOfInterest,
    };
  }
}