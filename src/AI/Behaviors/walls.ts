import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";
import { TerrainDisplay } from "../../Display/TerrainDisplay";

export class WallBehavior {
  constructor(private terrain: TerrainDisplay) { }

  updateAgent(agent: DisplayTrait & MotionTrait) {
    const x = agent.position.values[0];
    const y = agent.position.values[1];
    const size = agent.size * 2;

    if (!this.terrain.isWalkableAt(x + size, y)) {
      agent.acceleration.values[0] -= agent.maxSpeed;
    }
    if (!this.terrain.isWalkableAt(x - size, y)) {
      agent.acceleration.values[0] += agent.maxSpeed;
    }

    if (!this.terrain.isWalkableAt(x, y + size)) {
      agent.acceleration.values[1] -= agent.maxSpeed;
    }
    if (!this.terrain.isWalkableAt(x, y - size)) {
      agent.acceleration.values[1] += agent.maxSpeed;
    }
  }
}