import M from '../3rd-party/gl-matrix-min';
import Keyboard from '../framework/keyboard';
import Shot from './shot';

let width = 6/16;
let height = 8/16;

export default class Player {
    constructor(gl) {
        this.pos = M.vec2.clone([10 + 1/8, 7 + 1/8]);
        this.movement = M.vec2.clone([0, 0]);
        this.nextMovement = M.vec2.clone([0, 0]);
        this.facesRight = true;
        this.shotTimer = 0;
        this.jump = false;
    }
    
    update(ctx) {
        this.movement[0] = this.nextMovement[0];
        M.vec2.set(this.nextMovement, 0, 0);
        if(ctx.keyboard.isPressed(Keyboard.LEFT)) {
            this.movement[0] = -1;
            this.facesRight = false;
        }
        if(ctx.keyboard.isPressed(Keyboard.RIGHT)) {
            this.movement[0] = 1;
            this.facesRight = true;
        }
        this.shotTimer -= ctx.timeStep;
        if(ctx.keyboard.isTriggered(Keyboard.S) && this.shotTimer < 0) {
            let x = this.pos[0] + (this.facesRight ? width : 0);
            let y = this.pos[1] + width/2;
            ctx.game.addObject(new Shot(x, y, this.facesRight ? 1 : -1));
            this.shotTimer = 0.2;
        }

        if(this.jump && !ctx.keyboard.isPressed(Keyboard.A)) {
            this.movement[1] = this.movement[1] * 0.8 + 0.5;
            this.jump = false;
        }

        this.movement[1] += ctx.timeStep * 2;
        this.pos[0] += this.movement[0] * ctx.timeStep * (60 / 16);
        if(this.movement[0] !== 0) {
            let cx = this.movement[0] < 0 ? this.pos[0] - 1/16 : this.pos[0] + width + 1/16;
            let cy = this.pos[1] + height/2;
            let top = ctx.level.testCollision(cx, cy - height/2);
            let bottom = ctx.level.testCollision(cx, cy + height/2);
            let center = ctx.level.testCollision(cx, cy);
            if(top || bottom || center) {
                if(this.movement[0] < 0) {
                    this.pos[0] = Math.ceil(cx) + 1/16;
                } else {
                    this.pos[0] = Math.floor(cx) - (width + 1/16);
                }
            }
            if(top && !center) {
                this.nextMovement[1] = 1;
            } else if(bottom && !center) {
                this.nextMovement[1] = -1;
            }
        }
        this.pos[1] += this.movement[1] * ctx.timeStep * (60 / 16);
        let isOnGround = false;
        if(this.movement[1] !== 0) {
            let cx = this.pos[0] + width/2;
            let cy = this.movement[1] < 0 ? this.pos[1] - 1/16 : this.pos[1] + height + 1/16;
            let left = ctx.level.testCollision(cx - width/2, cy);
            let right = ctx.level.testCollision(cx + width/2, cy);
            let center = ctx.level.testCollision(cx, cy);
            if(left || right || center) {
                if(this.movement[1] < 0) {
                    this.pos[1] = Math.ceil(cy) + 1/16;
                } else {
                    this.pos[1] = Math.floor(cy) - (height + 1/16);
                    isOnGround = true;
                }
                this.movement[1] = 0;
            }
            if(left && !center) {
                this.nextMovement[0] = 1;
            } else if(right && !center) {
                this.nextMovement[0] = -1;
            }
        }
        if(isOnGround) {
            this.jump = false;
            if(ctx.keyboard.isPressed(Keyboard.A)) {
                this.movement[1] = -1.6;
                this.jump = true;
            }
        }
    }
    
    render(renderer, gfx) {
        renderer.draw(this.pos[0] * 16, this.pos[1] * 16, gfx[this.facesRight ? 'hero_right' : 'hero_left'], 1, 1, 1, 1);
    }
};
