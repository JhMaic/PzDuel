import type {CAMP, Commander} from "@/scripts/core/index";

export class Panzer implements Commander {

    constructor(commander: Commander,
                camp: CAMP) {
        commander = undefined;
        camp = undefined;
    }

    fn() {
        let a = 13;

    }

}