import M from '../3rd-party/gl-matrix-min';
import Keyboard from '../framework/keyboard';

export default function Player(gl) {
    this.pos = M.vec2.clone([1 + 1/8, 1 + 1/8]);
    this.movement = M.vec2.clone([0, 0]);
    
    this.update = function(ctx) {
        M.vec2.set(this.movement, 0, 0);
        if(ctx.keyboard.isPressed(Keyboard.LEFT)) {
            this.movement[0] = -1;
        }
        if(ctx.keyboard.isPressed(Keyboard.RIGHT)) {
            this.movement[0] = 1;
        }
        if(ctx.keyboard.isPressed(Keyboard.UP)) {
            this.movement[1] = -1;
        }
        if(ctx.keyboard.isPressed(Keyboard.DOWN)) {
            this.movement[1] = 1;
        }
        
        M.vec2.scaleAndAdd(this.pos, this.pos, this.movement, ctx.timeStep * (60 / 16));
    };
    
    this.render = function(renderer, texture) {
        renderer.draw(this.pos[0] * 16, this.pos[1] * 16, texture, 1, 1, 1, 1);
    };
};
