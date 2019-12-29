import LZString from 'lz-string';
import VecMath, {Vector} from "../etc/Vector2D";
import { TerrainDisplay } from "../Display/TerrainDisplay";
import { CELL_SIZE, TERRAIN_WALKABLE_THRESHOLD, TERRAIN_SEED, DISTANCE_FIELD_GRANULARITY, DISTANCE_FIELD_THRESHOLD, DISTANCE_WEIGHT } from "../config";
import { lerp } from '../etc/colorUtils';

type ArrayIndex = number;

export type FlowFieldData = {
  flowCells: Vector[];
  cellCosts: number[];
  distanceCells: number[];
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
    return field.flowCells[(y * field.width) + x] || [0,0];
  }
  static getCostAt(field: FlowFieldData, x: number, y: number) {
    return field.cellCosts[(y * field.width) + x];
  }

  static getDistanceFromNearestWall(field: FlowFieldData, x:number, y:number) {
    return field.distanceCells[(y * field.width) + x];
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

  static getPosForIndex(field: FlowFieldData, index: number):Vector {
    return [index % field.width, Math.floor(index / field.width)];
  }

  static immediateNeighbors(offset: number, x: number, y: number):Vector[] {
    return [
      [x - offset, y],
      [x + offset, y],
      [x, y - offset],
      [x, y + offset],
    ];
  }

  static octoNeighbors(offset: number, x: number, y: number):Vector[] {
    return [
      [x - offset, y],
      [x - offset, y - offset],
      [x, y - offset],
      [x + offset, y - offset],
      [x + offset, y],
      [x + offset, y + offset],
      [x, y + offset],
      [x - offset, y + offset],
    ];
  }

  private static checkPosBounds(field: FlowFieldData) {
    return (pos: number[]) => {
      return (
        pos[0] >= 0
        && pos[0] <= field.width
        && pos[1] >= 0
        && pos[1] <= field.height
      );
    }
  }

  static getCellNeighborPositions(field: FlowFieldData, position: Vector, useOcto: boolean = false, offset: number = 1): Vector[] {
    const posCheck = FlowField.checkPosBounds(field);
    return FlowField[useOcto ? 'octoNeighbors' : 'immediateNeighbors'](offset, position[0], position[1])
      .filter(posCheck)
  }

  static createFlowField(terrain: TerrainDisplay): FlowFieldData {
    return {
      cellCosts: [],
      cellSize: CELL_SIZE,
      distanceCells: [],
      flowCells: [],
      height: terrain.height,
      width: terrain.width,
      origin: [0, 0],
    };
  }

  static async calculateCostField(field: FlowFieldData, terrain: TerrainDisplay, distances:number[], target: Vector) {
    //Generate an empty grid, set all places as weight null, which will stand for unvisited
    const dijkstraGrid = FlowField.reset1dArrayValues<number>([], field.width, field.height, null);


    const startIdx = FlowField.getIndexForPos(field, target[0], target[1]);

    const startPoint: DistNode = {
      distance: distances[startIdx] ? Math.max(0, (1 - (distances[startIdx] / DISTANCE_FIELD_THRESHOLD))) * 5000 : 0,
      index: startIdx,
      position: target,
    };

    //flood fill out from the end point
    dijkstraGrid[startPoint.index] = 0;

    const toVisit: DistNode[] = [startPoint];

    //for each node we need to visit, starting with the pathEnd
    // for (let i = 0; i < toVisit.length; i++) {
    while (toVisit.length > 0) {
      const current = toVisit.shift();
      const neighbors = FlowField.getCellNeighborPositions(field, current.position);

      //for each neighbour of this node
      for (let j = 0; j < neighbors.length; j++) {
        const n = neighbors[j];

        const idx = FlowField.getIndexForPos(field, n[0], n[1]);
        if (dijkstraGrid[idx] === null && terrain.isWalkableAt(n[0], n[1])) {
          // const walkabilityWeight = FlowField.getCellNeighborPositions(field, n, true, 25)
          //   .reduce((prev, curr) => {
          //     if (!terrain.isWalkableAt(curr[0], curr[1])) {
          //       return prev + (10 * (terrain.valueAt(curr[0], curr[1]) - TERRAIN_WALKABLE_THRESHOLD));
          //     } else {
          //       return prev;
          //     }
          //   }, 0);

          // costs = costs.map((val, idx) => {
          //   return val + Math.max(0, (1-(distances[idx] / (DISTANCE_FIELD_THRESHOLD))) * val);
          // });

          let val = current.distance + 1;
          const add = DISTANCE_FIELD_THRESHOLD - distances[idx];
          val += add;
          // if(add < 0){
          //   console.log('here..', idx, distances[idx], DISTANCE_FIELD_THRESHOLD, add);
          //   debugger;
          // }
          // val += Math.min(1, Math.max(0, (1 - (distances[idx] / DISTANCE_FIELD_THRESHOLD)))) * (1000);

          // let thisCost = 1 + (terrain.isWalkableAt(n[0], n[1]) ? 0 : 1000);
          const neighborNode: DistNode = {
            distance: val, // current.distance + 1 + (1-(distances[idx] / DISTANCE_FIELD_THRESHOLD)),
            // current.distance + 1 + (1-(distances[idx] / DISTANCE_FIELD_THRESHOLD)),


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
    let position: Vector;
    let neighbors: Vector[];
    // console.log('costs', costs.length);
    // for (let i = 0; i < costs.length; i++) {
    for (let y = 0; y < field.height; y++) {
      for (let x = 0; x < field.width; x++) {
        position = [x, y];
        // console.log('here', i, position.toString());
        neighbors = FlowField.getCellNeighborPositions(field, position, true);

        let lowestCost = Infinity;
        let lowestNeighbor = null;
        for (let j = 0; j < neighbors.length; j++) {
          if (!terrain.isWalkableAt(neighbors[j][0], neighbors[j][1])) {
            continue;
          }

          let neighborIdx = FlowField.getIndexForPos(field, neighbors[j][0], neighbors[j][1]);
          let neighborCost = costs[neighborIdx];
          if (neighborCost < lowestCost) {
            lowestCost = neighborCost;
            lowestNeighbor = neighbors[j];
          }
        }

        let idx = FlowField.getIndexForPos(field, x, y);
        if (lowestNeighbor) {
          flows[idx] = VecMath.normalize(VecMath.sub(lowestNeighbor, position));
        } else {
          flows[idx] = null;
        }
      }
    }


    // }

    return flows;
  }

  static formatTime(timeSec: number) {
    // Hours, minutes and seconds
    var hrs = Math.floor(timeSec / 3600);
    var mins = Math.floor((timeSec % 3600) / 60);
    var secs = Math.floor(timeSec) % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  static async calculateDistanceField(field: FlowFieldData, terrain: TerrainDisplay): Promise<number[]> {
    return new Promise((res) => {

      const cachedData = localStorage.getItem(`${TERRAIN_SEED},${terrain.width},${terrain.height}`);

      if (cachedData) {
        try {
          const loadedDistances = JSON.parse(LZString.decompressFromBase64(cachedData));
          if (loadedDistances){
            res(loadedDistances);
            return;
          } else {
            console.log('No distance loaded, but key present. Contents: ' + cachedData.slice(0, 25) + (cachedData.length > 25 ? '...' : ''), loadedDistances);
          }
        } catch (err) {
          console.log('Error loading saved distances!', err);
        }
      }

      const distances = FlowField.reset1dArrayValues<number>([], field.width, field.height, 0);

      const threshold = DISTANCE_FIELD_THRESHOLD;

      // this is gonna take forever
      let totalTimeStart = Date.now();
      let timeStart = Date.now();
      for (let y = 0; y < field.height; y++) {
        for (let x = 0; x < field.width; x++) {

          let openList:Vector[] = [[x, y]];
          let nX: number;
          let nY: number;
          let dist = 0;
          let next: Vector;
          let foundTerrain = false;
          let tracked: any = {
            [`${openList[0].toString()}`]: true,
          };
          const currIdx = FlowField.getIndexForPos(field, x, y);

          while (!foundTerrain && openList.length) {
            next = openList.shift();
            nX = next[0];
            nY = next[1];
            dist = (((x - nX) * (x - nX)) + ((y - nY) * (y - nY)));

            if (dist > threshold || !terrain.isWalkableAt(nX, nY)) {
              dist = threshold;
              openList.length = 0;
              foundTerrain = true;
            } else {
              const neighbs = FlowField.getCellNeighborPositions(field, next, false, DISTANCE_FIELD_GRANULARITY)
                .filter(val => !tracked.hasOwnProperty(val.toString()));

              for(const idx in neighbs){
                tracked[neighbs[idx].toString()] = true;
              }

              Array.prototype.push.apply(openList, neighbs);
            }
          }

          distances[currIdx] = dist; // (distances[currIdx] || 0) + dist;
        }

        if (y % 5 === 0) {
          const delta = (Date.now() - timeStart) / 1000;
          const elapsed = (Date.now() - totalTimeStart) / 1000;
          const rowsPerSecond = 5 / delta;
          const remainingRows = field.height - (y + 1);
          const secRemain = remainingRows / rowsPerSecond;
          console.log(`${(((y + 1) / field.height) * 100).toFixed(2)}% - running for ${FlowField.formatTime(elapsed)} - ${FlowField.formatTime(secRemain)} left`)

          timeStart = Date.now();
        }
      }

      let smoothedDistances = FlowField.reset1dArrayValues<number>([], field.width, field.height, 0);

      const smoothRange = 4; // 25;
      const smoothTimes = 1;

      for(let iter = 0; iter < smoothTimes; iter++){
        // smooth them all. ugh
        for (let idx = 0; idx < distances.length; idx++) {
          let pos = FlowField.getPosForIndex(field, idx);
          let val = distances[idx];
          let neighIdx;
          // let neighCost;
          let neighb;

          for (let y = -smoothRange; y <= smoothRange; y++) {
            for (let x = -smoothRange; x <= smoothRange; x++) {
              // if (x === 0 && y === 0) { continue; }
              neighb = [pos[0] + x, pos[1] + y]

              if (neighb[0] < 0 || neighb[0] >= field.width || neighb[1] < 0 || neighb[1] >= field.height) {
                // val = (val + 0) / 2;
                // val = lerp(val, 0, 0.5);
                continue;
              } else {
                neighIdx = FlowField.getIndexForPos(field, neighb[0], neighb[1]);
                // val = lerp(val, distances[neighIdx], 0.5);
                val = (val + distances[neighIdx]) / 2;
              }
            }
          }

          smoothedDistances[idx] = val;
        }
      }



      localStorage.setItem(`${TERRAIN_SEED},${terrain.width},${terrain.height}`, LZString.compressToBase64(JSON.stringify(smoothedDistances)));
      res(smoothedDistances);
    });
  }


  static async generate(terrain: TerrainDisplay, pointOfInterest: Vector): Promise<FlowFieldData> {
    // let idx;
    // let cells:Vector[] = [];

    const field = FlowField.createFlowField(terrain);
    field.origin = pointOfInterest;


    console.time('distances');
    // const distances = await FlowField.calculateDistanceField(field, terrain);
    const distances = FlowField.reset1dArrayValues<number>([], field.width, field.height, 0);
    // const maxDist = distances.reduce((prev, curr) => {
    //   return prev > curr ? prev : curr;
    // }, -Infinity);
    // // console.log('max dist =', Math.sqrt(maxDist));

    console.timeEnd('distances');

    console.time('cost');
    let costs = await FlowField.calculateCostField(field, terrain, distances, pointOfInterest);
    console.timeEnd('cost');


    // costs = costs.map((val, idx) => {
    //   return val + Math.max(0, (1-(distances[idx] / (DISTANCE_FIELD_THRESHOLD))) * (val * 5));
    // });

    console.time('flows');
    const flows = await FlowField.calculateFlows(field, terrain, costs);
    console.timeEnd('flows');


    return {
      cellCosts: costs,
      flowCells: flows,
      distanceCells: distances,
      cellSize: CELL_SIZE,
      height: terrain.height,
      width: terrain.width,
      origin: pointOfInterest,
    };
  }
}