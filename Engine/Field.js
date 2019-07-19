import Cell from './Cell.js';
import Game from './Game.js';

export default class Field extends Game {
    constructor(x, y) {
        super();
        this.fieldDOM = $('Field');
        if (!this.fieldDOM) {
            console.warn(`Field is not found`);
        } else {
            const cellSize = 30;
            this.fieldDOM
                .css('width', `${x * cellSize}px`)
                .css('top', `calc(50% - ${y * cellSize / 2}px)`)
                .css('left', `calc(50% - ${x * cellSize / 2}px)`);
            this.fieldCells = [];
            for (let j = 0; j < y; j++) {
                for (let i = 0; i < x; i++) {
                    const cell = new Cell(i, j, {type: 'ground'});
                    let tempType = cell.config.type;
                    this.parallel.addTask(
                        `cellListener-${i}-${j}`,
                        100,
                        () => {
                            if (tempType !== cell.config.type) {
                                cell.renderCellType();
                            }
                            tempType = cell.config.type;
                        }
                    );
                    this.fieldDOM.append(cell.getDOM());
                    this.fieldCells.push(cell);
                }
            }
        }
    }

    getCell(x, y) {
        const cell = this.fieldCells.find((cell) => {
            return cell.config.x === x && cell.config.y === y;
        });
        if (cell) {
            return cell;
        } else {
            throw Error('Cell is not found');
        }
    }

    setCellConfigs(cellArray) {
        if (!cellArray instanceof Array) {
            throw Error('cellArray must be type of array');
        } else {
            cellArray.map((cell) => {
                this.getCell(cell.x, cell.y).setConfig(cell);
            });
        }
    }
}
