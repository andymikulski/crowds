import { Vector } from "./etc/Vector2D";
import { FlowFieldData } from "./AI/FlowField";
import { ItemID } from "./traits";
import { SCREEN_WIDTH, SPATIAL_HASH_SIZE} from "./config";

export class SpatialHash {
	public cellSize:number = SPATIAL_HASH_SIZE;

	private buckets:number[][] = []; // { [id: number]: number[]} = [];

	// We use a double buffer to flip between data each frame
	private bufferedBuckets:number[][] = []; //{ [id: number]: number[]} = [];

	public getBucketIndexForPosition(pos:Vector) {
		// const width = SCREEN_WIDTH / SpatialHash.cellSize; // 100 / 25
		return (
    	(Math.floor(pos[0] / this.cellSize)) +
    	(Math.floor(pos[1] / this.cellSize)) * (SCREEN_WIDTH / this.cellSize));
	}

	public addToBucket(agentId:number, position:Vector){
		const idx = this.getBucketIndexForPosition(position);
		this.buckets[idx] = this.buckets[idx] || [];
		this.buckets[idx].push(agentId);
	}

	public addToBuffer(agentId:number, position:Vector){
		const idx = this.getBucketIndexForPosition(position);
		this.bufferedBuckets[idx] = this.bufferedBuckets[idx] || [];
		this.bufferedBuckets[idx].push(agentId);
	}

	public getNeighborsForPosition(pos:Vector){
		return this.buckets[this.getBucketIndexForPosition(pos)] || [];
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