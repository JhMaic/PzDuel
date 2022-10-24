import type {Movement} from "@/scripts/types/Movement";
import type {Report} from "@/scripts/types/Report";
import type {GameContext} from "@/scripts/types/GameContext";
import type {Agent} from "@/scripts/types/Agent";

export interface Commander {
    readonly name: unique symbol;
    readonly badge?: URL;
    readonly start: (context: GameContext) => Movement | Agent | Agent[];
    readonly move: (report: Report, context: GameContext) => Movement | Agent | Agent[];
}
