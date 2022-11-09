/// https://blog.csdn.net/poppy995/article/details/125095990

// a basic unit of the checkerboard

export declare type Piece = {
    camp: CAMP;
    unit: UNIT.EMPTY | UNIT.PANZER;
    bulletOver?: Bullet[];
}

export declare type Position = {
    /** between [0, ~-1] */
    _x: number;
    _y: number
}

//
export declare type Agent = {
    destination: Position;
    how: "LINEAR" | "SQUARE";
    commands?: {
        when: ((report: Readonly<Report>, context: Readonly<GameContext>) => boolean)[];
        doing: Movement | Agent | Agent[];
    }[];
}

export declare type Movement = {
    action: ACTION.MOVE;
    move: {
        direction: ORIENTATION;
        step?: number;
    }
} | {
    action: ACTION.ATTACK;
    attack: Bullet;
} | {
    action: ACTION.STANDBY
}


export declare type Bullet = {
    direction: ORIENTATION;
    position: Position;
    speed?: number;
}

export declare interface Commander {
    readonly cmdr_name: string;
    readonly author?: {
        name: string;
        badge: URL;
        description: string;
    };
    start: (context: Readonly<GameContext>) => Movement | Agent | Agent[];
    move: (report: Readonly<Report>, context: Readonly<GameContext>) => Movement | Agent | Agent[];
}

export declare type GameContext = {
    readonly COL: number;
    readonly ROW: number;
    readonly MOVING_STEP: number;
    readonly BULLET_SPEED: number;
    spared_rounds: number;
}


export declare type Report = {
    // movement information of yourself
    self: {
        position: Position;
        lastMovement?: Movement;
        holding: Position[];
        bullets: Bullet[];
    };
    // movement information of enemy
    ob: {
        position: Position;
        lastMovement?: Movement;
        holding: Position[];
        bullets: Bullet[];
    };
    details: Piece[][]
}
export declare type GameOverState = {
    winner: CAMP;
    state: {
        cause: GAME_OVER_FLAG;
        description?: string;
    }
}

export declare type BulletHitInfo = {
    bullet: Bullet;
    timeCost: number;
}

/**
 * belonging to Piece
 */
export declare enum CAMP {
    P1 = 0,
    P2 = 1,
    NONE = 2
}

/***
 * indicate unit of a piece
 *
 */
export declare enum UNIT {
    PANZER = 0,
    EMPTY = 1
}


export declare enum ORIENTATION {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3
}

export declare enum ACTION {
    MOVE = 0,
    ATTACK = 1,
    STANDBY = 2
}

export declare enum GAME_OVER_FLAG {
    ATTACKED = 0, /** attacked by bullet */
    COLLIDED = 1, /** collided each other, [cover rate]*/
    TIMEOUT = 2, /** timeout, [cover rate] */
}