// belonging to Piece
export enum Camp {
    P1,
    P2,
    NONE
}

// belonging to Piece
export enum Unit {
    PANZER,
    EMPTY
}

// a basic unit of the checkerboard
export type Piece = {
    camp: Camp;
    unit: Unit.EMPTY | Unit.PANZER;
    bullets?: Bullet[];
}

export enum Orientation {
    LEFT,
    RIGHT,
    UP,
    DOWN
}

export type Position = {
    _x: number;
    _y: number
}

//
export type Agent = {
    destination: Position;
    how: "LINEAR" | "SQUARE";
    commands?: {
        when: ((report: Report, context: GameContext) => boolean)[];
        doing: Movement | Agent | Agent[];
    }[];
}

export type Movement = {
    action: Action.MOVE;
    move: {
        direction: Orientation;
        step?: number;
    }
} | {
    action: Action.ATTACK;
    attack: Bullet;
} | {
    action: Action.STANDBY
}

export enum Action {
    MOVE,
    ATTACK,
    STANDBY
}

export type Bullet = {
    from: Commander;
    position: Position;
    direction: Orientation;
    speed?: number;
}

export interface Commander {
    readonly cmdr_name: string;
    readonly author?: {
        name: string;
        badge: URL;
        description: string;
    }
    start: (context: GameContext) => Movement | Agent | Agent[];
    move: (report: Report, context: GameContext) => Movement | Agent | Agent[];
}

export type GameContext = {
    col: number;
    row: number;
    spared_rounds: number;
}


export type Report = {
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