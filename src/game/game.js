import SpriteRenderer from '../framework/spriterenderer';
import ResourceManager from '../framework/resourcemanager';
import TxtGfx from '../framework/txtgfx';
import Shaders from '../framework/shaders';
import Player from './player';
import VirtualScreen from './virtualscreen';
import Level from './level';

export default function* Game(gl, frameworkShaders) {
    let resourceManager = new ResourceManager(gl);
    let gfx = yield resourceManager.load(TxtGfx, 'src/game/gfx.txt');
    let tiles = yield resourceManager.load(TxtGfx, 'src/game/tiles.txt');
    let shaders = yield Shaders.load(gl, 'src/game/shaders.glsl');
    let vscreen = new VirtualScreen(gl, 320, 160, shaders);
    let player = new Player(gl);
    let levels = yield Level.loadData();
    let level = new Level(levels[0]);
    
    gl.clearColor(0, 0, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    let spriteRenderer = new SpriteRenderer(gl, frameworkShaders);

    let time = 0;
    
    this.update = function(ctx) {
        ctx.level = level;
        player.update(ctx);
        time += ctx.timeStep;
    };
    
    this.render = function() {
        vscreen.begin();

        gl.clear(gl.COLOR_BUFFER_BIT);
        
        spriteRenderer.begin(vscreen);

        level.render(spriteRenderer, tiles);
        player.render(spriteRenderer, gfx.hero);

        spriteRenderer.end();

        vscreen.end();
    };

    return this;
};
