import io from '../framework/io';
import async from '../framework/async';

let tileMapping = {
    '#': 'block',
    'E': 'exit'
};

export default class Level {
    constructor(data) {
        this.data = data;
    }
    render(renderer, tiles) {
        for(let y = 0; y < this.data.length; ++y) {
            let line = this.data[y];
            for(let x = 0; x < line.length; ++x) {
                let name = tileMapping[line[x]];
                if(name !== undefined) {
                    renderer.draw(x * 16, y * 16, tiles[name])
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
}

Level.loadData = async(function*() {
    let text = yield io.load('src/game/levels.txt');
    let levels = text.split(/\n---\n/).map(level => level.split(/\n/).slice(0, 10).map(line => line.split('')));
    return levels;
});
