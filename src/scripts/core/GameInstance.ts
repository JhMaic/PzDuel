import type {Commander, GameContext} from "@/scripts/core/types";
import {Panzer} from "@/scripts/core/Panzer";

export class GameInstance {
    static instance: GameInstance

    constructor(private readonly ai1: Commander,
                private readonly ai2: Commander,
                private readonly gameContext: GameContext) {
        let checkerboard = [];


        const p1 = new Panzer(ai1);
        const p2 = new Panzer(ai2);

    }


}