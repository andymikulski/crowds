import Vector from "../etc/Vector2D";
import { PositionTrait, MotionTrait, DisplayTrait } from "../traits";


const seperationBuffer = 15 * 15;
const neighborThreshold = 50 * 50;
const racismThreshold = 60 * 60;

export class FlockBehavior {

  public static racism(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    const sum: Vector = new Vector();
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent || other.color === currentAgent.color) {
        continue;
      }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if (d < racismThreshold) {
        // racism
        const diff: Vector = new Vector(currentAgent.position).sub(other.position).sub(Math.random() * 10);
        diff.normalize();
        diff.mult(d);
        sum.add(diff);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(currentAgent.currentSpeed);
      return Vector.sub(sum, currentAgent.velocity).limit(currentAgent.maxForce);
    }
    else {
      return new Vector();
    }
  }

  // Separation
  // Method checks for nearby boids and steers away
  public static separate(currentAgent: DisplayTrait & MotionTrait, agents: DisplayTrait[]): Vector {
    const steer: Vector = new Vector();
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if ((d > 0) && (d < seperationBuffer)) {
        // Calculate vector pointing away from neighbor
        const diff: Vector = new Vector(currentAgent.position).sub(other.position);
        diff.normalize();

        diff.div(d);
        count++;            // Keep track of how many
        steer.add(diff);
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.magnitude() > 0) {
      // First two lines of code below could be condensed with new setMag:Vector() method
      // Not using this method until Processing.js catches up
      // steer.setMag(currentSpeed);

      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(currentAgent.currentSpeed);
      steer.sub(currentAgent.velocity);
      steer.limit(currentAgent.maxForce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  public static align(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    const sum: Vector = new Vector();
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      // if (other === currentAgent || other.color !== currentAgent.color) {
      //   continue;
      // }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if (d < neighborThreshold) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(currentAgent.currentSpeed);
      return Vector.sub(sum, currentAgent.velocity).limit(currentAgent.maxForce);
    }
    else {
      return new Vector();
    }
  }

  // Cohesion
  // For the average position (i.e. center) of all nearby boids, calculate steering vector towards that position
  public static cohesion(currentAgent: DisplayTrait & MotionTrait, agents: (DisplayTrait & MotionTrait)[]): Vector {
    const sum: Vector = new Vector();   // Start with empty vector to accumulate all positions
    let count = 0;
    for (let i = 0; i < agents.length; i++) {
      const other = agents[i];
      if (other === currentAgent) { continue; }
      // if (other.color !== currentAgent.color) {
      //   continue;
      // }

      const d: number = Vector.squaredDist(currentAgent.position, other.position);
      if (d < neighborThreshold) {
        sum.add(other.position); // Add position
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return FlockBehavior.seek(currentAgent, sum);  // Steer towards the position
    }
    else {
      return new Vector();
    }
  }

  static seek(agent: DisplayTrait & MotionTrait, target: Vector): Vector {
    const desired: Vector = new Vector(target);
    desired.sub(agent.position);  // A vector pointing from the position to the target

    // Scale to maximum speed
    desired.normalize();
    desired.mult(agent.currentSpeed);

    // Above two lines of code below could be condensed with new setMag:Vector() method
    // Not using this method until Processing.js catches up
    // desired.setMag(currentSpeed);

    // Steering = Desired minus Velocity
    const steering = new Vector(desired);
    steering.sub(agent.velocity);
    steering.limit(agent.maxForce);  // Limit to maximum steering force
    return steering;
  }
}
