import { Game } from './game/Game';
import { MenuScene } from './ui/MenuScene';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const game = new Game(canvas);
game.sceneManager.switchTo(new MenuScene());
game.start();
