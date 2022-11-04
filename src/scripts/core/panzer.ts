import type {CAMP, Commander} from "@/scripts/core/index";

export class Panzer implements Commander {

    constructor(commander: Commander,
                camp: CAMP) {
    }

    fn(f: string) {
        console.log(f);
    }

}