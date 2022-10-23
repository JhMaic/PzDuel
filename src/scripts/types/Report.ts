import type {Movement} from "@/scripts/types/Movement";
import type {Position} from "@/scripts/types/Basic";

export type Report = {
    // movement information of yourself
    self: {
      position: Position;
      lastMovement:Movement;
      holding:{
          spaces: Position[];
      }
    };
    // movement information of enemy
    ob: {
        position: Position;
        lastMovement:Movement;
        holding:{
            spaces: Position[];
        }
    };

}