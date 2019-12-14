export const SCREEN_WIDTH = 500;
export const SCREEN_HEIGHT = 500;
export const WORLD_DEPTH = 255;

export const DISTANCE_FIELD_GRANULARITY = 1;
export const DISTANCE_FIELD_THRESHOLD = 20 * 20;

export const DISTANCE_WEIGHT = 25;//  1000;

export const WORLD_DEPTH_HALF = WORLD_DEPTH / 2;
export const SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2;
export const SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

export const CELL_SIZE = 2;

export const TERRAIN_WALKABLE_THRESHOLD = 0.05;

export const AGENT_SIZE = 2;
export const NUM_AGENTS = 250;

export const TERRAIN_SEED = 4242424444222;

export const TERRAIN_CHAOS = 0.0125;

export const MIN_SPEED = 1; // 0.25;
export const MAX_SPEED = 1.15; // 0.45;

export const MAX_FORCE = 0.25; // 125; //  0.05;

export const AGENT_WEIGHTS = {
	// flow: 0.3,
	// separate: 1.3,
	// align: 0.8,
	// cohesion: 0.0,
	racism: 0,
	flow: 1.15,
	separate: 1,
	align: 0.75,
	cohesion: 0, //.03,
	avoidWalls: 0.5,
};