import { PositionTrait, MotionTrait } from "../../traits";
import { lerp } from "../../etc/colorUtils";

export class SlowingBehavior {
	static updateAgent(agent: PositionTrait & MotionTrait, neighbors: MotionTrait[]) {
		agent.maxForce = Math.max(0.15, Math.min(0.5, neighbors.length / 6));
		// agent.maxForce = Math.max(0.15, 0.3 * ((neighbors.length / 4)));
		// agent.currentSpeed = agent.maxSpeed * (1 - (neighbors.length / 6));

		// const avgNeighborSpeed = neighbors.reduce((prev, curr) => { return (prev + curr.currentSpeed) / 2; }, 1);
		// agent.currentSpeed = (agent.currentSpeed + avgNeighborSpeed) / 2;// Math.min(agent.maxSpeed, lerp(agent.currentSpeed, avgNeighborSpeed, 0.5)));
	}
}