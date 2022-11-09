import {
    ACTION,
    Bullet,
    BulletHitInfo,
    CAMP,
    GAME_OVER_FLAG,
    GameContext,
    GameOverState,
    Movement,
    ORIENTATION,
    Piece,
    Position,
    Report,
    UNIT
} from "@/scripts/core/index";

export class Checkerboard {
    private _field: Piece[][];
    /** self: P1; ob: P2*/
    private _global_report: Report;

    constructor(public _game_context: GameContext) {
        const {ROW: row, COL: col} = _game_context;
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

    update(from: CAMP,
           movement: Movement): Report {
        const token = from == CAMP.P1 ? "self" : "ob";
        let selfReport = this._global_report[token];

        switch (movement.action) {
            case ACTION.MOVE:
                const old_loc = {...selfReport.position};
                let new_loc = selfReport.position;
                switch (movement.move.direction) {
                    case ORIENTATION.DOWN:
                        new_loc._y += new_loc._y == this._game_context.COL - 1 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
                        break;
                    case ORIENTATION.UP:
                        new_loc._y -= new_loc._y == 0 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
                        break;
                    case ORIENTATION.RIGHT:
                        new_loc._x += new_loc._x == this._game_context.ROW - 1 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
                        break;
                    case ORIENTATION.LEFT:
                        new_loc._x -= new_loc._x == 0 ?
                            0 : movement.move.step || this._game_context.MOVING_STEP;
                        break;
                }
                if (old_loc != new_loc) {
                    selfReport.position = new_loc;
                    selfReport.holding.push(new_loc);
                    this._field[new_loc._x][new_loc._y] = {
                        camp: from,
                        unit: UNIT.PANZER,
                    };
                    this._field[old_loc._x][old_loc._y] = {
                        camp: from,
                        unit: UNIT.EMPTY,
                    };
                }
                break;
            case ACTION.ATTACK:
                let bullet = movement.attack;
                /**initialize bullet position */
                bullet.position = {...selfReport.position};
                const bulletSpeed = bullet.speed || this._game_context.BULLET_SPEED;
                switch (bullet.direction) {
                    case ORIENTATION.DOWN:
                        bullet.position._y -= bulletSpeed;
                        break;
                    case ORIENTATION.LEFT:
                        bullet.position._x -= bulletSpeed;
                        break;
                    case ORIENTATION.UP:
                        bullet.position._y += bulletSpeed;
                        break;
                    case ORIENTATION.RIGHT:
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
            case ACTION.STANDBY:
                break;
        }
        selfReport.lastMovement = movement;
        this._global_report[token] = selfReport;
        return from === CAMP.P1 ? this._global_report : {
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
    private globalStateUpdate(): GameOverState | undefined {
        // TODO: check remaining rounds time
        if (!this._game_context.spared_rounds) {
            return {
                winner: this.coverRateChecker(),
                state: {
                    cause: GAME_OVER_FLAG.TIMEOUT,
                    description: "owning more spaces!"
                }
            };
        }
        // TODO: check if collision
        if (this._global_report.self.position == this._global_report.ob.position) {
            return {
                winner: this.coverRateChecker(),
                state: {
                    cause: GAME_OVER_FLAG.COLLIDED,
                    description: "owning more spaces!"
                }
            };
        }
        // TODO: check bullet attack
        const p1_hit_state = this.bulletHitChecker(
            this._global_report.ob.bullets,
            this._global_report.self);
        const p2_hit_state = this.bulletHitChecker(
            this._global_report.self.bullets,
            this._global_report.ob);

        // TODO: find who will be the first hit
        const report = {
            winner: CAMP.NONE,
            state: {
                cause: GAME_OVER_FLAG.ATTACKED,
            }
        } as GameOverState;
        if (p1_hit_state.timeCost > p2_hit_state.timeCost &&
            p2_hit_state.timeCost < this._game_context.BULLET_SPEED) {
            // p2 was attacked
            report.winner = CAMP.P1;
        } else if (p1_hit_state.timeCost < p2_hit_state.timeCost &&
            p1_hit_state.timeCost < this._game_context.BULLET_SPEED) {
            // p1 was attacked
            report.winner = CAMP.P2;
        } else if (p1_hit_state.timeCost === p2_hit_state.timeCost &&
            p1_hit_state.timeCost < this._game_context.BULLET_SPEED) {
            // Both were attacked meanwhile
            // Skip since set by default
        } else {
            // nobody wins
            return;
        }
        return report;
    }

    /**
     * compute cover rate (holding rate)
     * @private
     * @return {CAMP} winner
     */
    private coverRateChecker(): CAMP {
        const cr_p1 = this._global_report.self.holding.length;
        const cr_p2 = this._global_report.ob.holding.length;
        if (cr_p1 < cr_p2) return CAMP.P2;
        else if (cr_p1 == cr_p2) return CAMP.NONE;
        else return CAMP.P1;
    }

    /**
     * SHOULD running before update
     * @param bullets
     * @param enemy
     * @private
     */
    private bulletHitChecker(bullets: Bullet[], enemy: { position: Position }): BulletHitInfo {
        let closest_bullet: { timeCost: number, bullet?: Bullet } = {timeCost: 999};
        for (const bullet of bullets) {
            const hitDistances = {
                _x: enemy.position._x - bullet.position._x,
                _y: enemy.position._y - bullet.position._y
            };
            if (hitDistances._x === 0 && hitDistances._y > 0 && hitDistances._y < closest_bullet.timeCost)
                closest_bullet = {timeCost: hitDistances._y, bullet};
            else if (hitDistances._y === 0 && hitDistances._x > 0 && hitDistances._x < closest_bullet.timeCost)
                closest_bullet = {timeCost: hitDistances._x, bullet};

        }
        return closest_bullet as BulletHitInfo;
    }
}
