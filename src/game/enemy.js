import M from '../3rd-party/gl-matrix-min';

export default class Enemy {
    constructor(x, y) {
        this.pos = M.vec2.clone([x, y]);
        this.movement = M.vec2.create();
        this.rage = 0;
        this.lives = 2;
    }
    update(ctx) {
        M.vec2.sub(this.movement, ctx.player.pos, this.pos);
        M.vec2.normalize(this.movement, this.movement);
        let left = ctx.level.testCollision(this.pos[0], this.pos[1] + 6/16);
        let right = ctx.level.testCollision(this.pos[0] + 12/16, this.pos[1] + 6/16);
        let up = ctx.level.testCollision(this.pos[0] + 6/16, this.pos[1]);
        let down = ctx.level.testCollision(this.pos[0] + 6/16, this.pos[1] + 12/16);
        this.movement[0] += ((left ? 1 : 0) + (right ? -1 : 0)) * 0.2;
        this.movement[1] += ((up ? 1 : 0) + (down ? -1 : 0)) * 0.2;
        let speed = ctx.level.testCollision(this.pos[0] + 6/16, this.pos[1] + 6/16) ? 0.5 : 1.5;
        this.rage -= ctx.timeStep;
        if(this.rage > 0) {
            speed *= this.rage > 5 ? 0.4 : 1.5;
        }
        M.vec2.scaleAndAdd(this.pos, this.pos, this.movement, ctx.timeStep * speed);
    }
    render(renderer, gfx) {
        renderer.draw(this.pos[0] * 16, this.pos[1] * 16, this.rage > 0 ? gfx.ghost_rage : gfx.ghost);
    }
    testHit(x, y) {
        if(x > this.pos[0] && x < this.pos[0] + 12/16 && y > this.pos[1] && y < this.pos[1] + 12/16) {
            if(this.rage <= 0) {
                if(--this.lives <= 0) {
                    this.deleteMe = true;
                }
                this.rage = 6;
            }
            return true;
        }
    }
}
