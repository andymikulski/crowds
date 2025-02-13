declare var requestIdleCallback:any;
import * as dat from 'dat.gui';

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
import { mixColors } from "./etc/colorUtils";
import Vector2D from './etc/Vector2D';

const disp = new AgentDisplay(SCREEN_WIDTH, SCREEN_HEIGHT);
const terrain = new TerrainDisplay(SCREEN_WIDTH, SCREEN_HEIGHT);
terrain.draw();
terrain.drawWalkable();
terrain.drawGrid();

const displayFlowFieldData = (data: FlowFieldData) => {
  // console.log('field generated', data);
  displayCostVisual(data);
  displayFlowVisual(data);
}

const displayFlowVisual = (data: FlowFieldData) => {
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'black';
  let dir;
  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      dir = FlowField.getDirectionAt(data, x, y);
      if (!dir) {
        continue;
      }
      ctx.fillStyle = 'black';
      if (x % 10 === 0 && y % 10 === 0) {
        const debugLength = 6;
        const debugX = x + (dir.values[0]) * debugLength;
        const debugY = y + (dir.values[1]) * debugLength;
        const debugSize = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(debugX, debugY);
        ctx.stroke();
        ctx.closePath();
        ctx.fillRect(debugX - (debugSize / 2), debugY - (debugSize / 2), debugSize, debugSize);
      }

      // ctx.fillStyle = mixColors('#ff0000', '#a1e064', cost / maxCost, 0.5);
      ctx.fillStyle = `rgba(${dir.values[0] * 255}, ${dir.values[1] * 255}, 0, 0.2)`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  document.body.appendChild(canvas);
};

const displayCostVisual = (data: FlowFieldData) => {
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  const ctx = canvas.getContext('2d');
  let cost;
  let maxCost = data.cellCosts.reduce((prev, curr) => {
    return prev > curr ? prev : curr;
  }, -Infinity);
  console.log('max cost =', maxCost);

  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      cost = FlowField.getCostAt(data, x, y);
      if (cost <= 0) { continue; }
      ctx.fillStyle = mixColors('#ff0000', '#00ff00', cost / maxCost, 0.5);
      // ctx.fillStyle = `rgba(255, 0, 0, ${(cost / maxCost)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  document.body.insertBefore(canvas, document.body.firstChild);
};



const gui = new dat.GUI();
gui.add(AgentManager.WEIGHTS, 'racism', 0, 5, 0.05);
gui.add(AgentManager.WEIGHTS, 'flow', 0, 5, 0.05);
gui.add(AgentManager.WEIGHTS, 'separate', 0, 5, 0.05);
gui.add(AgentManager.WEIGHTS, 'align', 0, 5, 0.05);
gui.add(AgentManager.WEIGHTS, 'cohesion', 0, 5, 0.05);
// const ok = ()=>{
//   console.log('pool..', Vector2D.pool.length, Vector2D.totalCount, Vector2D.freeCount);
//   requestIdleCallback(ok);
// };
// requestIdleCallback(ok);


const seedPools = (num: number = 200000) => {
  for(let i = 0; i < num; i ++ ){
    Vector2D.pool.push(Vector2D.get());
  }
}


const run = async () => {
  console.time('seed');
  seedPools();
  console.timeEnd('seed');

  console.time('flowField');
  const testFlow = await FlowField.generate(terrain, Vector.get([SCREEN_WIDTH, SCREEN_HEIGHT_HALF]))
  console.timeEnd('flowField');
  displayFlowFieldData(testFlow);

  // console.time('spawnAgents');
  const agentMan = new AgentManager(terrain, testFlow);
  let currentCount = 0;
  // for (let i = 0; i < 2; i++) {
  const ok = ()=>{
    setTimeout(()=>{
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;
      agentMan.spawnAgent(currentCount);
      currentCount += 1;

      if(currentCount > 250){ return; }
      ok();
    }, 100);
  };

  ok();

  // }
  // console.timeEnd('spawnAgents');

  const stepWorld = () => {
    agentMan.tick();
    disp.draw(agentMan.agents, agentMan.agentCount, 0);
    requestAnimationFrame(stepWorld);
  };
  stepWorld();
};


run();



// const mountains = document.createElement('div');
// mountains.style.width = '500px';
// mountains.style.height = '50px';
// document.body.appendChild(mountains);
