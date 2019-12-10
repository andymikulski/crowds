import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";
import { TerrainDisplay } from "../../Display/TerrainDisplay";
import { FlowField, FlowFieldData } from "../FlowField";
import { FlockBehavior } from "../Flock";
import Vector from "../../etc/Vector2D";

export class FlowBehavior {
	constructor(private field: FlowFieldData) { }

	updateAgent(agent: DisplayTrait & MotionTrait) {
		const pos = Vector.get(agent.position);
		const x = Math.round(pos.values[0]);
		const y = Math.round(pos.values[1]);
		const dir = Vector.get(FlowField.getDirectionAt(this.field, x, y));
		const steer = FlockBehavior.seek(agent, Vector.add(pos, dir));

		Vector.free(pos, dir);

		return steer;
	}
}