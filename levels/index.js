
import { lv_Tutorial_easy1 } from "./lv_Tutorial_easy1.js";
import { lv_Tutorial_easy2 } from "./lv_Tutorial_easy2.js";
import { lv_Tutorial_easy3 } from "./lv_Tutorial_easy3.js";
import { lv_Tutorial_hard1 } from "./lv_Tutorial_hard1.js";
import { lv_Tutorial_hard2 } from "./lv_Tutorial_hard2.js";
import { lv_Tutorial_hard3 } from "./lv_Tutorial_hard3.js";

export { make_level } from "./make_level.js";

// set level names here, so it can be used in the start room
export const Levels = {
	"Tutorial(Easy)": ["Tutorial_easy1", "Tutorial_easy2", "Tutorial_easy3"],
	"Tutorial(Hard)": ["Tutorial_hard1", "Tutorial_hard2", "Tutorial_hard3"],
};

// each name corresponds to an object, contains information of that level.
export const NameToLevel = {
	"Tutorial_easy1": lv_Tutorial_easy1,
	"Tutorial_easy2": lv_Tutorial_easy2,
	"Tutorial_easy3": lv_Tutorial_easy3,
	"Tutorial_hard1": lv_Tutorial_hard1,
	"Tutorial_hard2": lv_Tutorial_hard2,
	"Tutorial_hard3": lv_Tutorial_hard3
}
