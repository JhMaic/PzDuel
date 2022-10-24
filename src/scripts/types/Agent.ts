import type {Position} from "@/scripts/types/Basic";
import type {Report} from "@/scripts/types/Report";
import type {GameContext} from "@/scripts/types/GameContext";
import type {Movement} from "@/scripts/types/Movement";

export type Agent = {
    destination: Position;
    how: "LINEAR" | "SQUARE";
    commands?: {
        when: ((report: Report, context: GameContext) => boolean)[];
        doing: Movement;
    }[];
}
