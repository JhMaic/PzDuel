import type {Position} from "@/scripts/types/Basic";
import type {Orientation} from "@/scripts/types/Basic";
import type {Commander} from "@/scripts/types/Commander";

export type Bullet = {
    from:Commander;
    position:Position;
    direction:Orientation;
    speed?: number;
}