export const SCREEN_WIDTH = 1000;
export const SCREEN_HEIGHT = 1000;
export const WORLD_DEPTH = 255;

export const DISTANCE_FIELD_GRANULARITY = 3;
export const DISTANCE_FIELD_THRESHOLD = 10 * 10;


export const WORLD_DEPTH_HALF = WORLD_DEPTH / 2;
export const SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2;
export const SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

export const CELL_SIZE = 2;

export const TERRAIN_WALKABLE_THRESHOLD = 0.05;

export const AGENT_SIZE = 2;
export const NUM_AGENTS = 100;

export const TERRAIN_SEED = 144444222;

export const TERRAIN_CHAOS = 0.015;

export const AGENT_WEIGHTS = {
	// flow: 0.3,
	// separate: 1.3,
	// align: 0.8,
	// cohesion: 0.0,
	racism: 0,
	flow: 1,
	separate: 0.95,
	align: 0.35,
	cohesion: 0.03,
	avoidWalls: 0.5,
};