import SpriteRenderer from '../framework/spriterenderer';
import ResourceManager from '../framework/resourcemanager';
import TxtGfx from '../framework/txtgfx';
import Shaders from '../framework/shaders';
import Player from './player';
import VirtualScreen from './virtualscreen';

export default function* Game(gl, frameworkShaders) {
    let resourceManager = new ResourceManager(gl);
    let gfx = yield resourceManager.load(TxtGfx, 'src/game/gfx.txt');
    let shaders = yield Shaders.load(gl, 'src/game/shaders.glsl');
    let vscreen = new VirtualScreen(gl, 320, 200, shaders);
    let player = new Player(gl);
    
    gl.clearColor(0, 0, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    let spriteRenderer = new SpriteRenderer(gl, frameworkShaders);

    let time = 0;
    
    this.update = function(ctx) {
        player.update(ctx);
        time += ctx.timeStep;
    };
    
    this.render = function() {
        vscreen.begin();

        gl.clear(gl.COLOR_BUFFER_BIT);
        
        spriteRenderer.begin(vscreen);

        spriteRenderer.drawPlain(4, 150, 140, 30, 1, 0, 1, 1);
        spriteRenderer.draw(0, 0, gfx.hero);
        player.render(spriteRenderer, gfx.hero);

        spriteRenderer.end();

        vscreen.end();
    };

    return this;
};
