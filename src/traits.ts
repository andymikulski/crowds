import Vector from './etc/Vector2D';
export type PositionTrait = {
	position: Vector;
};
export type MotionTrait = {
	acceleration: Vector;
	velocity: Vector;
	maxSpeed: number;
	maxForce: number;
};

export type DisplayTrait = PositionTrait & {
	size: number;
	color: string;
}