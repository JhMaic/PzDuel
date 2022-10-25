import type {GameContext, Movement, Piece, Report} from "@/scripts/types/content";
import {Action, Camp, Orientation, Unit} from "@/scripts/types/content";

export class Checkerboard {
    private _field: Piece[][];
    /** self: P1; ob: P2*/
    private _global_report: Report;
    private _game_context: GameContext;

    constructor(gameContext: GameContext) {
        const {ROW: row, COL: col} = gameContext;
        this._game_context = gameContext;
        let field = [];
        for (let i = 0; i < row; i++) {
            field[i] = new Array<Piece>(col);
        }
        this._field = field;
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
           movement: Movement): Report {
        this.globalStateUpdate();
        const token = from == Camp.P1 ? "self" : "ob";
        let selfReport = this._global_report[token];

        switch (movement.action) {
            case Action.MOVE:
                const old_loc = {...selfReport.position};
                let new_loc = selfReport.position;
                switch (movement.move.direction) {
                    case Orientation.DOWN:
                        new_loc._y += new_loc._y == this._game_context.COL - 1 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
                        break;
                    case Orientation.UP:
                        new_loc._y -= new_loc._y == 0 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
                        break;
                    case Orientation.RIGHT:
                        new_loc._x += new_loc._x == this._game_context.ROW - 1 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
                        break;
                    case Orientation.LEFT:
                        new_loc._x -= new_loc._x == 0 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
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
            case Action.ATTACK:
                let bullet = movement.attack;
                /**initialize bullet position */
                bullet.position = {...selfReport.position};
                const bulletSpeed = bullet.speed || this._game_context.BULLET_SPEED;
                switch (bullet.direction) {
                    case Orientation.DOWN:
                        bullet.position._y -= bulletSpeed;
                        break;
                    case Orientation.LEFT:
                        bullet.position._x -= bulletSpeed;
                        break;
                    case Orientation.UP:
                        bullet.position._y += bulletSpeed;
                        break;
                    case Orientation.RIGHT:
                        bullet.position._x += bulletSpeed;
                        break;
                }

                if ((bullet.position._x < 0 || bullet.position._x > this._game_context.COL) ||
                    (bullet.position._y < 0 || bullet.position._y > this._game_context.ROW))
                    break;
                selfReport.bullets.push(bullet);

                let pieceTarget = this._field[bullet.position._x][bullet.position._y];
                if (pieceTarget.bulletOver)
                    pieceTarget.bulletOver.push(bullet);
                else
                    pieceTarget.bulletOver = [bullet];
                break;
        }
        selfReport.lastMovement = movement;
        this._global_report[token] = selfReport;
        return from === Camp.P1 ? this._global_report : {
            self: this._global_report.ob,
            ob: this._global_report.self,
            details: this._global_report.details
        };
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
