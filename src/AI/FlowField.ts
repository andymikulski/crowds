import Vector from "../etc/Vector2D";
import { TerrainDisplay } from "../Display/TerrainDisplay";

export type FlowField = {
  cells: Vector[];
  width: number;
  height: number;
  origin: Vector;
};


export type FlowList = {
  list: Vector[];
  lastPos: Vector[];
}

export class FlowFieldManager {
  static getCellAt(field: FlowField, x: number, y: number) {
    return field.cells[(y * field.width) + x];
  }

  static async generate(terrain: TerrainDisplay, pointOfInterest: Vector): Promise<FlowField> {
    // let idx;
    // let cells:Vector[] = [];


    /**  TODO: Add the breadth-first algo which builds out flow field **/


    // for (let x = 0; x < terrain.width; x += terrain.cellSize) {
    //   for (let y = 0; y < terrain.height; y += terrain.cellSize) {
    //     // idx = (y * terrain.width) + x;
    //     cells.push
    //   }
    // }




    return {
      cells: [],
      height: terrain.height,
      width: terrain.width,
      origin: pointOfInterest,
    };
  }
}