import io from '../framework/io';
import async from '../framework/async';

let tileMapping = {
    ' ': 'ground',
    'S': 'ground',
    '#': 'block',
    'E': 'exit'
};

export default class Level {
    constructor(data) {
        this.data = data;
        for(let line of data) {
            for(let x = 0; x < line.length; ++x) {
                if(line[x] === ' ' && Math.random() < 0.2) {
                    line[x] = '#';
                }
            }
        }
        this.anim = [];
        for(let x = 0; x < data[0].length; ++x) {
            this.anim.push({ y: 0, o: 0, s: 0 });
        }
    }
    update(ctx) {
        for(let a of this.anim) {
            a.s -= ctx.timeStep * 6;
            a.o += a.s * ctx.timeStep;
            if(a.o < 0) {
                a.o = 0;
                a.s *= -0.3;
            }
        }
    }
    render(renderer, tiles) {
        for(let y = 0; y < this.data.length; ++y) {
            let line = this.data[y];
            for(let x = 0; x < line.length; ++x) {
                let name = tileMapping[line[x]];
                if(name !== undefined) {
                    let ay = y;
                    let a = this.anim[x];
                    if(y <= a.y) {
                        ay -= a.o;
                    }
                    renderer.draw(x * 16, ay * 16, tiles[name])
                }
            }
        }
    }
    testCollision(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if(y < 0 || y >= this.data.length) {
            return true;
        }
        let line = this.data[y];
        if(x < 0 || x >= line.length) {
            return true;
        }
        let tile = line[x];
        return tile === '#';
    }
    get(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        let line = this.data[y];
        if(line) {
            return line[x] || '#'
        }
        return '#';
    }
    destroyTile(x, y) {
        if(x < 0 || x >= this.anim.length) {
            return;
        }
        this.anim[x].y = y;
        this.anim[x].o += 1;
        let destroyedTile = this.get(x, y);
        while(y > 0) {
            this.data[y][x] = this.get(x, y-1);
            y -=1;
        }
        if(destroyedTile !== 'E') {
            destroyedTile = Math.random() < 0.2 ? '#' : ' ';
        }
        this.data[y][x] = destroyedTile;
    }
}

Level.loadData = async(function*() {
    let text = yield io.load('src/game/levels.txt');
    let levels = text.split(/\n---\n/).map(level => level.split(/\n/).slice(0, 10).map(line => line.split('')));
    return levels;
});
