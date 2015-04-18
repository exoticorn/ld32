import M from '../3rd-party/gl-matrix-min';
import Keyboard from '../framework/keyboard';

export default function Player(gl) {
    this.pos = M.vec2.clone([0, 0]);
    this.movement = M.vec2.clone([0, 0]);
    
    this.update = function(ctx) {
        if(ctx.keyboard.isPressed(Keyboard.LEFT)) {
            this.movement[0] = -60;
        } else if(ctx.keyboard.isPressed(Keyboard.RIGHT)) {
            this.movement[0] = 60;
        } else {
            this.movement[0] = 0;
        }
        
        this.movement[1] += 140 * ctx.timeStep;
        M.vec2.scaleAndAdd(this.pos, this.pos, this.movement, ctx.timeStep);
        if(this.pos[1] > 0) {
            this.pos[1] = 0;
            this.movement[1] = 0;
            if(ctx.keyboard.isTriggered(Keyboard.UP)) {
                this.movement[1] = -80;
            }
        }
    };
    
    this.render = function(renderer, texture) {
        renderer.draw(this.pos[0], this.pos[1] + 150, texture, 1, 1, 1, 1);
    };
};
