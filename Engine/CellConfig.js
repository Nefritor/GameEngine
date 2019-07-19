export default class CellConfig {
    constructor(config) {
        for (const prop in config) {
            if (config.hasOwnProperty(prop)) {
                switch(prop) {
                    case 'x':
                    case 'y':
                    case 'type':
                        this[prop] = config[prop];
                        break;
                    default:
                        console.warn(`Property '${prop}' of cell configuration is not found!`);
                        break;
                }
            }
        }
    }
}

export class CellConfigArray {
    constructor(startPos, endPos, type, config) {
        this.array = [];
        this.drawType = new DrawType(type, [startPos, endPos]);
        this[this.drawType.getDrawFunc()](this.drawType.startPos, this.drawType.endPos, config);
    }
    /*
     * Line must be horizontal, vertical of diagonal
     */
    drawLine([x1, y1], [x2, y2], config) {
        const yMax = Math.max(y1, y2);
        const yMin = Math.min(y1, y2);
        const xMax = Math.max(x1, x2);
        const xMin = Math.min(x1, x2);
        if (x1 === x2) {
            for (let y = yMin; y <= yMax; y++) {
                this.array.push(new CellConfig({x: x1, y, ...config}));
            }
        } else if (y1 === y2) {
            for (let x = xMin; x <= xMax; x++) {
                this.array.push(new CellConfig({x, y: y1, ...config}));
            }
        } else if (xMax - xMin === yMax - yMin) {
            const increment = y1 === yMin;
            let y = increment ? yMin : yMax;
            for (let x = xMin; x <= xMax; x++) {
                this.array.push(new CellConfig({x, y: increment ? y++ : y--, ...config}));
            }
        } else {
            throw Error('Can\'t draw line (not horizontal, vertical of diagonal)');
        }
    }
}

class DrawType {
    constructor(type, coordinates) {
        this.type = type;
        if (coordinates.length === 2 &&
            coordinates[0] instanceof Array &&
            coordinates[1] instanceof Array) {
            this.startPos = coordinates[0];
            this.endPos = coordinates[1];
        } else {
            throw Error('Coordinates must contain two array of start and end position');
        }
    }

    getDrawFunc() {
        switch (this.type) {
            case 'line':
                return 'drawLine';
            case 'rectangle':
                return 'drawRectangle';
            default:
                throw Error('Unknown draw type');
        }
    }
}