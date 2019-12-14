import { PositionTrait, MotionTrait } from "../../traits";
import VecMath from "../../etc/Vector2D";

export class PhysicsBehavior {
	static updateAgent(agent: PositionTrait & MotionTrait) {
		// Update velocity
		agent.velocity = VecMath.add(agent.velocity, agent.acceleration);

		// Limit speed
		agent.velocity = VecMath.limit(agent.velocity, agent.maxSpeed);

		// Update world position
		agent.position = VecMath.add(agent.position, agent.velocity);

		// Reset accelertion to 0 each cycle
		agent.acceleration = VecMath.mult(agent.acceleration, 0);
	}
}