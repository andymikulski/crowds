import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "./config";

import { AgentDisplay } from './Display/AgentDisplay';
import { AgentManager } from './AI/Agent';
import { TerrainDisplay } from "./Display/TerrainDisplay";

const disp = new AgentDisplay(SCREEN_WIDTH, SCREEN_HEIGHT);
const terrain = new TerrainDisplay(SCREEN_WIDTH, SCREEN_HEIGHT, 5);
terrain.draw();
terrain.drawGrid();
terrain.drawWalkable();

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


const mountains = document.createElement('div');
mountains.style.width = '500px';
mountains.style.height = '50px';
document.body.appendChild(mountains);
