import type {Movement, Piece, Report} from "@/scripts/types/content";
import {Action, Camp, Orientation, Unit} from "@/scripts/types/content";

export class Checkerboard {
    private _field: Piece[][];
    private _field_size: { row: number, col: number };
    /** self: P1; ob: P2*/
    private _global_report: Report;


    constructor(row: number, col: number) {
        let field = [];
        for (let i = 0; i < row; i++) {
            field[i] = new Array<Piece>(col);
        }
        this._field = field;
        this._field_size = {row, col};
        this._global_report = {
            self: {
                position: {_x: 0, _y: 0},
                holding: [{_x: 0, _y: 0}],
                bullets: []
            },
            ob: {
                position: {_x: row - 1, _y: col - 1},
                holding: [{_x: row - 1, _y: col - 1}],
                bullets: []
            },
            details: this._field
        };
    }

    update(from: Camp,
           movement: Movement) {
        this.globalStateUpdate();
        const token = from == Camp.P1 ? "self" : "ob";
        let selfReport = this._global_report[token];

        switch (movement.action) {
            case Action.MOVE:
                const old_loc = {...selfReport.position};
                let new_loc = selfReport.position;
                switch (movement.move.direction) {
                    case Orientation.DOWN:
                        new_loc._y += new_loc._y == this._field_size.col - 1 ?
                            0 : movement.move.step || 1;
                        break;
                    case Orientation.UP:
                        new_loc._y -= new_loc._y == 0 ?
                            0 : movement.move.step || 1;
                        break;
                    case Orientation.RIGHT:
                        new_loc._x += new_loc._x == this._field_size.row - 1 ?
                            0 : movement.move.step || 1;
                        break;
                    case Orientation.LEFT:
                        new_loc._x -= new_loc._x == 0 ?
                            0 : movement.move.step || 1;
                        break;
                }
                if (old_loc != new_loc) {
                    selfReport.position = new_loc;
                    selfReport.holding.push(new_loc);
                    this._field[new_loc._x][new_loc._y] = {
                        camp: from,
                        unit: Unit.PANZER,
                    };
                    this._field[old_loc._x][old_loc._y] = {
                        camp: from,
                        unit: Unit.EMPTY,
                    };
                }
                break;
        }
        selfReport.lastMovement = movement;
    }

    parseReport(of: "P1" | "P2"): Report {
        return this._global_report;
    }

    /**
     * Update bullets moving, attacked report, etc.
     * Always running before update()
     * @return whetherEndsGame
     * Game over if return true
     *
     */
    private globalStateUpdate(): boolean {
        return false;
    }

}
