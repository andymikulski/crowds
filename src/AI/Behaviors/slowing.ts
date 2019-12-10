import { PositionTrait, MotionTrait } from "../../traits";

export class SlowingBehavior {

	static calcReduce (prev:number, curr:MotionTrait) {
		return (prev + curr.currentSpeed) / 2;
	}

	static updateAgent(agent: PositionTrait & MotionTrait, neighbors: MotionTrait[]) {
		// agent.maxForce = 0; // Math.max(0.15, Math.min(0.5, neighbors.length / 6));
		// agent.maxForce = Math.max(0.15, 0.3 * ((neighbors.length / 4)));
		// agent.currentSpeed = agent.maxSpeed * (1 - (neighbors.length / 6));

		if (neighbors.length){
			const avgNeighborSpeed = neighbors.reduce(SlowingBehavior.calcReduce, neighbors[0].currentSpeed);
			// agent.currentSpeed = ((agent.currentSpeed + (avgNeighborSpeed * 0.5)) / 2);// Math.min(agent.maxSpeed, lerp(agent.currentSpeed, avgNeighborSpeed, 0.5)));
			agent.currentSpeed = Math.min(agent.maxSpeed, avgNeighborSpeed * 0.9);
			// (agent.currentSpeed - (avgNeighborSpeed * 0.9)) / 2;

			agent.maxForce = 0.05 + (0.15 * (agent.currentSpeed / agent.maxSpeed)); // + 0.1;
		} else {
			agent.currentSpeed += (agent.maxSpeed - agent.currentSpeed) / 2;
		}

	}
}