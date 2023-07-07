let plugin = require("tailwindcss/plugin");

const DIRECTIONS = new Set(["normal", "reverse", "alternate", "alternate-reverse"]);
const PLAY_STATES = new Set(["running", "paused"]);
const FILL_MODES = new Set(["none", "forwards", "backwards", "both"]);
const ITERATION_COUNTS = new Set(["infinite"]);
const TIMINGS = new Set(["linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end"]);
const TIMING_FNS = ["cubic-bezier", "steps", "linear"];

const COMMA = /\,(?![^(]*\))/g; // Comma separator that is not located between brackets. E.g.: `cubiz-bezier(a, b, c)` these don't count.
const SPACE = /\ +(?![^(]*\))/g; // Similar to the one above, but with spaces instead.
const TIME = /^(-?[\d.]+m?s)$/;
const DIGIT = /^(\d+)$/;

let defaultOptions = {
	theme: {
		animationIterations: {
			0: 0,
			1: 1,
			infinite: "infinite",
		},
		animationDelay: {
			0: "0s",
			75: "75ms",
			100: "100ms",
			150: "150ms",
			200: "200ms",
			300: "300ms",
			500: "500ms",
			700: "700ms",
			1000: "1000ms",
		},
		animationFillMode: {
			none: "none",
			both: "both",
			forwards: "forwards",
			backwards: "backwards",
		},
		animationPlayState: {
			paused: "paused",
			running: "running",
		},
		animationComposition: {
			add: "add",
			replace: "replace",
			accumulate: "accumulate",
		},
		animationDirection: {
			"normal": "normal",
			"reverse": "reverse",
			"alternate": "alternate",
			"alternate-reverse": "alternate-reverse",
		},
		animationDuration: {
			DEFAULT: "150ms",
			0: "0s",
			75: "75ms",
			100: "100ms",
			150: "150ms",
			200: "200ms",
			300: "300ms",
			500: "500ms",
			700: "700ms",
			1000: "1000ms",
		},
		timingFunction: {
			"DEFAULT": "cubic-bezier(0.4, 0, 0.2, 1)",
			"linear": "linear",
			"in": "cubic-bezier(0.4, 0, 1, 1)",
			"out": "cubic-bezier(0, 0, 0.2, 1)",
			"in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
		},
	},
	variants: {
		animation: ["motion-reduce"],
	},
};

function animationPlugin({ addUtilities, matchUtilities, theme, config, variants, e }) {
	let prefix = (name) => e(config("prefix") + name);
	let keyframes = Object.fromEntries(
		Object.entries(theme("keyframes") ?? {}).map(([key, value]) => {
			return [key, { [`@keyframes ${prefix(key)}`]: value }];
		})
	);

	let animationDelay = { ...theme("delay"), ...theme("animationDelay") };
	let animationDuration = { ...theme("duration"), ...theme("animationDuration") };
	let animationTimingFunction = { ...theme("timingFunction"), ...theme("animationTimingFunction") };

	let transitionDelay = { ...theme("delay"), ...theme("transitionDelay") };
	let transitionDuration = { ...theme("duration"), ...theme("transitionDuration") };
	let transitionTimingFunction = { ...theme("timingFunction"), ...theme("transitionTimingFunction") };

	matchUtilities({ "fill-mode": (value) => ({ animationFillMode: value }) }, { values: theme("animationFillMode") });

	matchUtilities(
		{ "play-state": (value) => ({ animationPlayState: value }) },
		{ values: theme("animationPlayState") }
	);

	matchUtilities(
		{ composition: (value) => ({ animationComposition: value }) },
		{ values: theme("animationComposition") }
	);

	matchUtilities(
		{ iterations: (value) => ({ animationIterationCount: value }) },
		{ values: theme("animationIterations") }
	);

	matchUtilities(
		{ "animation-direction": (value) => ({ animationDirection: value }) },
		{ values: theme("animationDirection") }
	);

	matchUtilities(
		{
			duration: (value) => {
				({ animationDuration: value, transitionDuration: value });
			},
		},
		{
			values: theme("duration"),
		}
	);

	matchUtilities({ "animation-duration": (value) => ({ animationDuration: value }) }, { values: animationDuration });

	matchUtilities(
		{ "transition-duration": (value) => ({ transitionDuration: value }) },
		{ values: transitionDuration }
	);

	matchUtilities(
		{
			delay: (value) => {
				({ animationDelay: value, transitionDelay: value });
			},
		},
		{
			values: theme("delay"),
		}
	);

	matchUtilities({ "animation-delay": (value) => ({ animationDelay: value }) }, { values: animationDelay });

	matchUtilities({ "transition-delay": (value) => ({ transitionDelay: value }) }, { values: transitionDelay });

	matchUtilities(
		{
			ease: (value) => {
				if (typeof value === "string") {
					let values = value.split(COMMA).map((value) => animationTimingFunction[value] ?? value);
					let arrays = enumerateArrays(values);

					return { animationTimingFunction: arrays, transitionTimingFunction: arrays };
				} else {
					return { animationTimingFunction: value, transitionTimingFunction: value };
				}
			},
		},
		{ values: theme("timingFunction") }
	);

	matchUtilities(
		{
			"animation-ease": (value) => {
				if (typeof value === "string") {
					let values = value.split(COMMA).map((value) => animationTimingFunction[value] ?? value);
					let arrays = enumerateArrays(values);

					return { animationTimingFunction: arrays };
				} else {
					return { animationTimingFunction: value };
				}
			},
		},
		{ values: animationTimingFunction }
	);

	matchUtilities(
		{
			"transition-ease": (value) => {
				if (typeof value === "string") {
					let values = value.split(COMMA).map((value) => transitionTimingFunction[value] ?? value);
					let arrays = enumerateArrays(values);

					return { transitionTimingFunction: arrays };
				} else {
					return { transitionTimingFunction: value };
				}
			},
		},
		{ values: transitionTimingFunction }
	);

	matchUtilities(
		{
			animationName: (value) => {
				let values = value.split(COMMA);
				let frames = values.map((value) => keyframes[value]);

				return [...frames, { animationName: values.map((value) => prefix(value)).join() }];
			},
		},
		{ values: Object.fromEntries(Object.keys(theme("keyframes")).map((key) => [key, key])) }
	);

	matchUtilities(
		{
			animation: (value) => {
				let timings = Object.keys(animationTimingFunction);
				let animations = parseAnimationValue(value, timings);

				function replaceTimingFunction(value, name) {
					let timing = animationTimingFunction[name];
					if (timing) {
						if (timing instanceof Array) {
							return timing.map((timing) => value.replace(name, timing));
						} else {
							return value.replace(name, timing);
						}
					} else {
						return value;
					}
				}

				function replaceAnimationName(value, name) {
					if (name && keyframes[name]) {
						if (value instanceof Array) {
							return value.map((value) => value.replace(name, prefix(name)));
						} else {
							return value.replace(name, prefix(name));
						}
					} else {
						return value;
					}
				}

				let results = animations.map(({ name, value, timingFunction }) => {
					let result = value;
					result = replaceTimingFunction(result, timingFunction);
					result = replaceAnimationName(result, name);
					return result;
				});

				return [
					...animations.flatMap((animation) => keyframes[animation.name]),
					{
						animation: enumerateArrays(results).map((array) => array.join()),
					},
				];
			},
		},
		{ values: theme("animation") }
	);
}

module.exports = plugin(animationPlugin, defaultOptions);

function enumerateArrays(arr) {
	let results = [];

	function helper(subArr, index) {
		if (index === arr.length) {
			results.push(subArr);
			return;
		}

		if (typeof arr[index] === "string") {
			helper([...subArr, arr[index]], index + 1);
		} else if (Array.isArray(arr[index])) {
			for (let item of arr[index]) {
				helper([...subArr, item], index + 1);
			}
		}
	}

	helper([], 0);
	return results;
}

function parseAnimationValue(input, timings = []) {
	let animations = input.split(COMMA);
	return animations.map((animation) => {
		let value = animation.trim();
		let result = { value };
		let parts = value.split(SPACE);
		let seen = new Set();

		for (let part of parts) {
			if (!seen.has("DIRECTIONS") && DIRECTIONS.has(part)) {
				result.direction = part;
				seen.add("DIRECTIONS");
			} else if (!seen.has("PLAY_STATES") && PLAY_STATES.has(part)) {
				result.playState = part;
				seen.add("PLAY_STATES");
			} else if (!seen.has("FILL_MODES") && FILL_MODES.has(part)) {
				result.fillMode = part;
				seen.add("FILL_MODES");
			} else if (!seen.has("ITERATION_COUNTS") && (ITERATION_COUNTS.has(part) || DIGIT.test(part))) {
				result.iterationCount = part;
				seen.add("ITERATION_COUNTS");
			} else if (!seen.has("TIMING_FUNCTION") && (TIMINGS.has(part) || timings.includes(part))) {
				result.timingFunction = part;
				seen.add("TIMING_FUNCTION");
			} else if (!seen.has("TIMING_FUNCTION") && TIMING_FNS.some((f) => part.startsWith(`${f}(`))) {
				result.timingFunction = part;
				seen.add("TIMING_FUNCTION");
			} else if (!seen.has("DURATION") && TIME.test(part)) {
				result.duration = part;
				seen.add("DURATION");
			} else if (!seen.has("DELAY") && TIME.test(part)) {
				result.delay = part;
				seen.add("DELAY");
			} else if (!seen.has("NAME")) {
				result.name = part;
				seen.add("NAME");
			} else {
				if (!result.unknown) result.unknown = [];
				result.unknown.push(part);
			}
		}

		return result;
	});
}
