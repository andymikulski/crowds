import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";
import { TerrainDisplay } from "../../Display/TerrainDisplay";
import { FlowField, FlowFieldData } from "../FlowField";
import { FlockBehavior } from "../Flock";
import Vector from "../../etc/Vector2D";

export class FlowBehavior {
	constructor(private field: FlowFieldData) { }

	updateAgent(agent: DisplayTrait & MotionTrait) {
		const pos = new Vector(agent.position);
		const x = Math.round(pos.values[0]);
		const y = Math.round(pos.values[1]);
		const dir = new Vector(FlowField.getDirectionAt(this.field, x, y));


		// dir.normalize();
		// dir.mult(agent.maxSpeed);
		// console.log('here...', 'raw dir:', JSON.stringify(FlowField.getDirectionAt(this.field, x, y)), '\nagent: ', JSON.stringify(agent), '\n\n', 'pos:', JSON.stringify(pos), '\n\n', 'dir:', JSON.stringify(dir), '\n\n', 'pos add dir: ', JSON.stringify(pos.add(dir)));
		// throw new Error();
		return FlockBehavior.seek(agent, pos.add(dir)); // Vector.sub(pos, dir));

		// if (!dir) {
		// 	return new Vector();
		// } else {
		// 	return FlockBehavior.seek(agent,
		// 		new Vector(pos).sub(new Vector(dir))
		// 	);
		// }
	}
}