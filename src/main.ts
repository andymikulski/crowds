import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  CELL_SIZE,
  SCREEN_HEIGHT_HALF,
  SCREEN_WIDTH_HALF,
} from "./config";

import { AgentDisplay } from './Display/AgentDisplay';
import { AgentManager } from './AI/Agent';
import { TerrainDisplay } from "./Display/TerrainDisplay";
import { FlowField, FlowFieldData } from "./AI/FlowField";
import Vector from "./etc/Vector2D";

const disp = new AgentDisplay(SCREEN_WIDTH, SCREEN_HEIGHT);
const terrain = new TerrainDisplay(SCREEN_WIDTH, SCREEN_HEIGHT);
terrain.draw();
terrain.drawWalkable();
terrain.drawGrid();



const displayFlowFieldData = (data: FlowFieldData) => {
  console.log('field generated', data);
  const canv = document.createElement('canvas');
  canv.width = SCREEN_WIDTH;
  canv.height = SCREEN_HEIGHT;
  const ctx = canv.getContext('2d');
  let cost;
  let maxCost = data.cellCosts.reduce((prev, curr) => {
    return prev > curr ? prev : curr;
  }, -Infinity);
  console.log('max cost =', maxCost);

  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      cost = FlowField.getCostAt(data, x, y);
      ctx.fillStyle = `rgba(255, 0, 0, ${(cost / maxCost)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  document.body.appendChild(canv);
}

const testFlow = FlowField.generate(terrain, new Vector([SCREEN_WIDTH_HALF, 0]))
  .then(displayFlowFieldData)

const agentMan = new AgentManager(terrain);
for (let i = 0; i < 100; i++) {
  agentMan.spawnAgent(i);
}

const stepWorld = () => {
  agentMan.tick();
  disp.draw(agentMan.agents, agentMan.agentCount, 0);
  requestAnimationFrame(stepWorld);
};
stepWorld();




// const mountains = document.createElement('div');
// mountains.style.width = '500px';
// mountains.style.height = '50px';
// document.body.appendChild(mountains);
