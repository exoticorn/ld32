import M from '../3rd-party/gl-matrix-min';

export default class Shot {
    constructor(x, y, dir) {
        this.pos = M.vec2.clone([x, y]);
        this.sx = dir > 0 ? 1 : -1;
        this.lastX = Math.floor(this.pos[0]);
    }

    update(ctx) {
        this.pos[0] += this.sx * ctx.timeStep * 120 / 16;
        let x = Math.floor(this.pos[0]);
        if(x != this.lastX) {
            if(ctx.level.testCollision(x, this.pos[1])) {
                this.deleteMe = true;
            } else {
                ctx.level.destroyTile(x, Math.floor(this.pos[1]));
            }
            this.lastX = x;
        }
    }

    render(renderer, gfx) {
        renderer.draw(this.pos[0] * 16 - 2, this.pos[1] * 16 - 2, gfx.shot);
    }
}