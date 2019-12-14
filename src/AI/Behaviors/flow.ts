import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";
import { TerrainDisplay } from "../../Display/TerrainDisplay";
import { FlowField, FlowFieldData } from "../FlowField";
import { FlockBehavior } from "../Flock";
import VecMath, { Vector } from "../../etc/Vector2D";

export class FlowBehavior {
	constructor(private field: FlowFieldData) { }

	updateAgent(agent: DisplayTrait & MotionTrait) {
		const pos = agent.position;
		const x = Math.round(pos[0]);
		const y = Math.round(pos[1]);
		const dir = FlowField.getDirectionAt(this.field, x, y);
		const steer = FlockBehavior.seek(agent, VecMath.add(pos, dir));

		return steer;
	}
}