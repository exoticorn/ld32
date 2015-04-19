import SpriteRenderer from '../framework/spriterenderer';
import ResourceManager from '../framework/resourcemanager';
import TxtGfx from '../framework/txtgfx';
import Shaders from '../framework/shaders';
import Player from './player';
import VirtualScreen from './virtualscreen';
import Level from './level';
import Enemy from './enemy';

export default function* Game(gl, frameworkShaders) {
    let resourceManager = new ResourceManager(gl);
    let gfx = yield resourceManager.load(TxtGfx, 'src/game/gfx.txt');
    let tiles = yield resourceManager.load(TxtGfx, 'src/game/tiles.txt');
    let shaders = yield Shaders.load(gl, 'src/game/shaders.glsl');
    let vscreen = new VirtualScreen(gl, 320, 160, shaders);
    let levels = yield Level.loadData();
    let level = new Level(levels[0]);

    let objects = [];
    let player = new Player(gl);
    objects.push(player);
    let timeToGhost = 0;
    
    gl.clearColor(0, 0, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    let spriteRenderer = new SpriteRenderer(gl, frameworkShaders);

    let time = 0;
    
    this.update = function(ctx) {
        ctx.level = level;
        ctx.player = player;
        ctx.game = this;
        ctx.objects = objects;
        timeToGhost -= ctx.timeStep;
        if(timeToGhost < 0) {
            objects.push(new Enemy(Math.random() < 0.5 ? -1 : 20, Math.random() * 10));
            timeToGhost += 10;
        }
        let needsDeletion = false;
        for(let obj of objects) {
            obj.update(ctx);
            needsDeletion = needsDeletion || obj.deleteMe;
        }
        if(needsDeletion) {
            objects = objects.filter(obj => !obj.deleteMe);
        }
        level.update(ctx);
        time += ctx.timeStep;
    };
    
    this.render = function() {
        vscreen.begin();

        gl.clear(gl.COLOR_BUFFER_BIT);
        
        spriteRenderer.begin(vscreen);

        level.render(spriteRenderer, tiles);
        for(let obj of objects) {
            obj.render(spriteRenderer, gfx);
        }

        spriteRenderer.end();

        vscreen.end();
    };

    this.addObject = function(obj) {
        objects.push(obj);
    };

    return this;
};
