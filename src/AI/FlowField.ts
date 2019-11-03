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
  static getCellAt(field: FlowFieldData, x: number, y: number) {
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

  /**
   * returns
   */
  static getCellNeighbors(field: FlowFieldData, node: { position: Vector }): Vector[] {
    const xMax = field.width;
    const yMax = field.height;
    const pos = node.position.values;
    let found: Vector[] = [];

    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x === 0 && y === 0) { continue; }
        if (pos[0] + x >= 0 && pos[0] + x <= xMax && pos[1] + y >= 0 && pos[1] + y <= yMax) {
          found.push(new Vector([node.position.values[0] + x, node.position.values[1] + y]));
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
      origin: new Vector([0, 0]),
    };
  }

  static async calculateCostField(field: FlowFieldData, terrain: TerrainDisplay, target: Vector) {
    //Generate an empty grid, set all places as weight null, which will stand for unvisited
    const dijkstraGrid = FlowField.reset1dArrayValues<number>([], field.width, field.height, null);

    const startPoint: DistNode = {
      distance: 0,
      index: FlowField.getIndexForPos(field, target.values[0], target.values[1]),
      position: new Vector(target),
    };

    //flood fill out from the end point
    dijkstraGrid[startPoint.index] = 0;

    const toVisit: DistNode[] = [startPoint];

    //for each node we need to visit, starting with the pathEnd
    for (let i = 0; i < toVisit.length; i++) {
      const neighbours = FlowField.getCellNeighbors(field, toVisit[i]);

      //for each neighbour of this node (only straight line neighbours, not diagonals)
      for (let j = 0; j < neighbours.length; j++) {
        const n = neighbours[j];
        // const terrainHeight = terrain.noise.perlin2(n.values[0] * terrain.chaos, n.values[1] * terrain.chaos);

        if (!terrain.isWalkableAt(n.values[0], n.values[1])) {
          continue;
        }

        const idx = FlowField.getIndexForPos(field, n.values[0], n.values[1]);

        //We will only ever visit every node once as we are always visiting nodes in the most efficient order
        if (dijkstraGrid[idx] === null) {
          const neighborNode: DistNode = {
            distance: toVisit[i].distance + 1,
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


  static async generate(terrain: TerrainDisplay, pointOfInterest: Vector): Promise<FlowFieldData> {
    // let idx;
    // let cells:Vector[] = [];

    const field = FlowField.createFlowField(terrain);
    const costs = await FlowField.calculateCostField(field, terrain, pointOfInterest);


    /**  TODO: Add the breadth-first algo which builds out flow field **/

    return {
      cellCosts: costs,
      flowCells: [],
      cellSize: CELL_SIZE,
      height: terrain.height,
      width: terrain.width,
      origin: pointOfInterest,
    };
  }
}