
// #TODO odd numbers for screen_width/height breaks pathfinding calcs
export const SCREEN_WIDTH = 256; // 1024;//2 * Math.round(window.innerWidth / 2);
export const SCREEN_HEIGHT = 256; // 768;//2 * Math.round(window.innerHeight / 2);

export const WORLD_DEPTH = 255;

export const DISTANCE_FIELD_GRANULARITY = 1;
export const DISTANCE_FIELD_THRESHOLD = 20 * 20;

export const DISTANCE_WEIGHT = 1;//  1000;

export const WORLD_DEPTH_HALF = WORLD_DEPTH / 2;
export const SCREEN_WIDTH_HALF = SCREEN_WIDTH / 2;
export const SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

export const CELL_SIZE = 1;

export const TERRAIN_WALKABLE_THRESHOLD = 0.075;

export const AGENT_SIZE = 2;

export const SPATIAL_HASH_SIZE = 25;

export const AGENT_FOV = 90;
export const AGENT_FOV_RADS = (AGENT_FOV / 180) * Math.PI;
export const AGENT_FOV_HALF = AGENT_FOV / 2;
export const AGENT_FOV_HALF_RADS = AGENT_FOV_RADS / 2;

export const AGENT_FOV_RANGE = SPATIAL_HASH_SIZE;
export const AGENT_FOV_RANGE_SQUARED = AGENT_FOV_RANGE * AGENT_FOV_RANGE;

export const NUM_AGENTS = 500;

export const TERRAIN_SEED = 94515159772799999; //  4242424444222;

export const TERRAIN_CHAOS = 0.01225;

export const MIN_SPEED = 0.35;
export const MAX_SPEED = 0.45;

export const MAX_FORCE = 0.005; //  0.125;

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