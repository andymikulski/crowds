import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";

export class BoundaryBehavior {

	static updateAgent(agent: PositionTrait) {
		if (agent.position.values[0] < 0) {
			agent.position.values[0] += SCREEN_WIDTH;
			agent.position.values[1] = Math.random() * SCREEN_HEIGHT;
		} else if (agent.position.values[0] > SCREEN_WIDTH) {
			agent.position.values[0] -= SCREEN_WIDTH;
			agent.position.values[1] = Math.random() * SCREEN_HEIGHT;
		}

		if (agent.position.values[1] < 0) {
			agent.position.values[0] = Math.random() * SCREEN_WIDTH;
			agent.position.values[1] += SCREEN_HEIGHT;
		} else if (agent.position.values[1] > SCREEN_HEIGHT) {
			agent.position.values[0] = Math.random() * SCREEN_WIDTH;
			agent.position.values[1] -= SCREEN_HEIGHT;
		}

		if (agent.position.values[2] < 0) {
			agent.position.values[0] = Math.random() * SCREEN_WIDTH;
			agent.position.values[1] = Math.random() * SCREEN_HEIGHT;
			agent.position.values[2] += WORLD_DEPTH;
		} else if (agent.position.values[2] > WORLD_DEPTH) {
			agent.position.values[0] = Math.random() * SCREEN_WIDTH;
			agent.position.values[1] = Math.random() * SCREEN_HEIGHT;
			agent.position.values[2] -= WORLD_DEPTH;
		}
	}
}