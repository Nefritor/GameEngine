import Field from './Field.js';
import CellConfig, {CellConfigArray} from "./CellConfig.js";

export function execute() {
    const field = new Field(10, 10);

    field.setCellConfigs(
        new CellConfigArray(
                [1, 1],
                [1, 8],
                'line',
                {
                    type: 'wall'
                },
            ).array.concat(
            new CellConfigArray(
                [2, 2],
                [4, 4],
                'line',
                {
                    type: 'wall'
                },
            ).array,
            new CellConfigArray(
                [5, 4],
                [7, 2],
                'line',
                {
                    type: 'wall'
                },
            ).array,
            new CellConfigArray(
                [8, 1],
                [8, 8],
                'line',
                {
                    type: 'wall'
                },
            ).array)
    );
}