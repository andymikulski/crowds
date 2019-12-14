import { PositionTrait, MotionTrait, DisplayTrait } from "../../traits";
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_DEPTH } from "../../config";

export class BoundaryBehavior {

	static updateAgent(agent: PositionTrait) {
		if (agent.position[0] < 0) {
			agent.position[0] += SCREEN_WIDTH;
			agent.position[1] = Math.random() * SCREEN_HEIGHT;
		} else if (agent.position[0] > SCREEN_WIDTH) {
			agent.position[0] -= SCREEN_WIDTH;
			agent.position[1] = Math.random() * SCREEN_HEIGHT;
		}

		if (agent.position[1] < 0) {
			agent.position[0] = Math.random() * SCREEN_WIDTH;
			agent.position[1] += SCREEN_HEIGHT;
		} else if (agent.position[1] > SCREEN_HEIGHT) {
			agent.position[0] = Math.random() * SCREEN_WIDTH;
			agent.position[1] -= SCREEN_HEIGHT;
		}

		// if (agent.position[2] < 0) {
		// 	agent.position[0] = Math.random() * SCREEN_WIDTH;
		// 	agent.position[1] = Math.random() * SCREEN_HEIGHT;
		// 	// agent.position[2] += WORLD_DEPTH;
		// } else if (agent.position[2] > WORLD_DEPTH) {
		// 	agent.position[0] = Math.random() * SCREEN_WIDTH;
		// 	agent.position[1] = Math.random() * SCREEN_HEIGHT;
		// 	// agent.position[2] -= WORLD_DEPTH;
		// }
	}
}