import { Vector } from "./etc/Vector2D";
import { FlowFieldData } from "./AI/FlowField";
import { ItemID } from "./traits";
import { SCREEN_WIDTH, SPATIAL_HASH_SIZE, SCREEN_HEIGHT_HALF, AGENT_FOV_RANGE } from "./config";

function onlyUnique<T>(value: T, index: number, self: T[]) {
	return self.indexOf(value) === index;
}


export class SpatialHash {
	public cellSize: number = SPATIAL_HASH_SIZE;

	private buckets: number[][] = []; // { [id: number]: number[]} = [];

	// We use a double buffer to flip between data each frame
	private bufferedBuckets: number[][] = []; //{ [id: number]: number[]} = [];

	public getBucketIndexForPosition(pos: Vector) {
		return (
			((pos[0] / this.cellSize) | 0) +
			((pos[1] / this.cellSize) | 0) * (SCREEN_WIDTH / this.cellSize));
	}

	public getBucketPositionForIndex(index: number) {
		const y = (index / (SCREEN_WIDTH / this.cellSize)) | 0;
		const x = index - (y * (SCREEN_WIDTH / this.cellSize));
		return [(x * this.cellSize) + (this.cellSize / 2), (y * this.cellSize) + (this.cellSize / 2)];
	}

	private _halfRad: number;
	public getBucketIndices(pos: Vector, radius: number = AGENT_FOV_RANGE) {
		this._halfRad = radius / 2;
		return [
			// Central
			this.getBucketIndexForPosition([pos[0], pos[1]]),
			// W
			this.getBucketIndexForPosition([pos[0] - this._halfRad, pos[1]]),
			// NW
			this.getBucketIndexForPosition([pos[0] - this._halfRad, pos[1] - this._halfRad]),
			// N
			this.getBucketIndexForPosition([pos[0], pos[1] - this._halfRad]),
			// NE
			this.getBucketIndexForPosition([pos[0] + this._halfRad, pos[1] - this._halfRad]),
			// E
			this.getBucketIndexForPosition([pos[0] + this._halfRad, pos[1]]),
			// SE
			this.getBucketIndexForPosition([pos[0] + this._halfRad, pos[1] + this._halfRad]),
			// S
			this.getBucketIndexForPosition([pos[0], pos[1] - this._halfRad]),
			// SW
			this.getBucketIndexForPosition([pos[0] - this._halfRad, pos[1] + this._halfRad]),
		]
	}

	public addToBucket(agentId: number, position: Vector) {
		const idx = this.getBucketIndexForPosition(position);
		this.buckets[idx] = this.buckets[idx] || [];
		this.buckets[idx].push(agentId);
	}

	public addToBuffer(agentId: number, position: Vector) {
		const idx = this.getBucketIndexForPosition(position);
		this.bufferedBuckets[idx] = this.bufferedBuckets[idx] || [];
		this.bufferedBuckets[idx].push(agentId);
	}

	public getAgentsAtBucket(pos: Vector) {
		return this.buckets[this.getBucketIndexForPosition(pos)] || [];
	}

	private idToBucket = (id: number) => {
		return this.buckets[id] || [];
	}

	public getNeighboringIDsAtPos(pos: Vector, radius: number = AGENT_FOV_RANGE) {
		return this.getBucketIndices(pos, radius)
			.map(this.idToBucket)
			.flat();
	}

	public clearBuckets() {
		this.buckets = [];
		this.bufferedBuckets = [];
	}

	public flip() {
		this.buckets = this.bufferedBuckets;
		this.bufferedBuckets = [];
	}
}