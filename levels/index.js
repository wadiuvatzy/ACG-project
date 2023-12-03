
import { lv_Tutorial_easy1 } from "./lv_Tutorial_easy1.js";

export { make_level } from "./make_level.js";

// set level names here, so it can be used in the start room
export const Levels = {
	"Tutorial(Easy)": ["Tutorial_easy1", "Tutorial_easy2", "Tutorial_easy3"],
	"Springs": []
};

// each name corresponds to an object, contains information of that level.
export const NameToLevel = {
	"Tutorial_easy1": lv_Tutorial_easy1,
	"Tutorial_easy2": null,
	"Tutorial_easy3": null,
}
