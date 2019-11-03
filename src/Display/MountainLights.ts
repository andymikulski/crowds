// import { Boid } from "./boids";
// import { hexToRgb, rgbToHex, mixColors } from "../etc/colorUtils";
// import { PositionTrait, DisplayTrait } from "../traits";
// class MountainLights {
// 	static getGradient(agents: DisplayTrait[]) {
// 		const baseColor = hexToRgb('#bde2eb');
// 		let gradString = `linear-gradient(90deg, #bde2eb 0%,`;
// 		let ok = agents.sort((a, b) => {
// 			if (a.position.values[0] > b.position.values[0]) {
// 				return 1;
// 			}
// 			if (a.position.values[0] < b.position.values[0]) {
// 				return -1;
// 			}
// 			return 0;
// 		});
// 		for (let i = 0; i < ok.length; i++) {
// 			let wispColor = rgbToHex(ok[i].color.values[0], ok[i].color.values[1], ok[i].color.values[2]);
// 			let thisColor = mixColors('#bde2eb', wispColor, 1 - (ok[i].position.values[1] / 500));
// 			if (i > 0) {
// 				gradString += ', ';
// 			}
// 			gradString += `${thisColor} ${(ok[i].position.values[0] / 500) * 100}%`;
// 		}
// 		gradString = `${gradString}, #bde2eb 100%)`;
// 		// `linear-gradient(red 0%, orange 25%, yellow 50%, green 75%, blue 100%)`;
// 		return gradString;
// 	}
// }
