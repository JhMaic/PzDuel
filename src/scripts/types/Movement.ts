import type {Orientation} from "@/scripts/types/Basic";
import type {Bullet} from "@/scripts/types/Bullet";

export type Movement = {
    action: Action;
    move?:{
        direction: Orientation;
        step?: number;
    }
    attack?:Bullet;
}

export enum Action{
    MOVE,
    ATTACK,
    STANDBY
}

