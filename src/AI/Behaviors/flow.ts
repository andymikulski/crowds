import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH, SCREEN_WIDTH_HALF } from "../../config";
import Vector from "../../etc/Vector2D";
import { FlockBehavior } from "../Flock";

export class FlowBehavior {
	static updateAgent(agent: PositionTrait & MotionTrait & DisplayTrait) {
		if (agent.color === '#f00') {
			return FlockBehavior.seek(agent, new Vector([0, SCREEN_HEIGHT]));
		} else if (agent.color === '#00f') {
			return FlockBehavior.seek(agent, new Vector([SCREEN_WIDTH_HALF, 0]));
		} else if (agent.color === '#222') {
			return FlockBehavior.seek(agent, new Vector([SCREEN_WIDTH, SCREEN_HEIGHT]));
		} else {
			return new Vector();
		}
	}
}