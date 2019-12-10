import { PositionTrait, MotionTrait } from "../../traits";

export class PhysicsBehavior {
	static updateAgent(agent: PositionTrait & MotionTrait) {
		// Update velocity
		agent.velocity.add(agent.acceleration);

		// Limit speed
		agent.velocity.limit(agent.maxSpeed);

		// console.log('here111', agent.maxSpeed, JSON.stringify(agent));
		// throw new Error();

		// Update world position
		agent.position.add(agent.velocity);
		// Reset accelertion to 0 each cycle
		agent.acceleration.mult(0);

	}
}