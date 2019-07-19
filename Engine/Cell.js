import CellConfig from './CellConfig.js';

export default class Cell {
    constructor(x, y, config) {
        this.config = new CellConfig({x, y, ...config});
    }

    getDOM() {
        if (!this.DOM &&
            typeof this.config.x === 'number' &&
            typeof this.config.y === 'number') {
            this.DOM = $('<Cell/>');
            this.DOM.attr('pos-x', this.config.x)
                .attr('pos-y', this.config.y);
            this.renderCellType();
        } else if (!this.config.x || !this.config.y) {
            console.warn(`The current cell has no position properties`);
            return null;
        }
        return this.DOM;
    }

    setConfig(properties, merge = true) {
        if (merge) {
            this.config = new CellConfig({...this.config, ...properties}
            );
        } else {
            this.config = new CellConfig(properties);
        }
    }

    renderCellType() {
        if (this.DOM.attr('type')) {
            if (this.DOM.attr('type') !== this.config.type) {
                const prevType = this.DOM.attr('type');
                this.DOM.removeClass(`cell-type-${prevType}`);
                this.DOM.attr('type', this.config.type);
                this.DOM.addClass(`cell-type-${this.config.type}`);
            } else {

            }
        } else {
            this.DOM.attr('type', this.config.type);
            this.DOM.addClass(`cell-type-${this.config.type}`);
        }
    }
}