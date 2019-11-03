import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";
import { TerrainDisplay } from "../../Display/TerrainDisplay";
import { FlowField, FlowFieldData } from "../FlowField";
import { FlockBehavior } from "../Flock";
import Vector from "../../etc/Vector2D";

export class FlowBehavior {
	constructor(private field: FlowFieldData) { }

	updateAgent(agent: DisplayTrait & MotionTrait) {
		const x = agent.position.values[0];
		const y = agent.position.values[1];
		const dir = new Vector(FlowField.getDirectionAt(this.field, x, y));

		if (!dir) {
			return new Vector();
		}

		// dir.normalize();
		// dir.mult(agent.maxSpeed);
		return FlockBehavior.seek(agent, Vector.sub(dir, agent.position));

		// if (!dir) {
		// 	return new Vector();
		// } else {
		// 	return FlockBehavior.seek(agent,
		// 		new Vector(agent.position).sub(new Vector(dir))
		// 	);
		// }
	}
}