import plugin from "tailwindcss/plugin";

import parseAnimationValue from "./utils/parse-animation-value.js";

let defaultOptions = {
	theme: {
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
		animationIterations: {
			0: 0,
			1: 1,
			infinite: "infinite",
		},
		animationDirection: {
			"normal": "normal",
			"reverse": "reverse",
			"alternate": "alternate",
			"alternate-reverse": "alternate-reverse",
		},
		animationTimingFunction: {
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

function animationPlugin({ matchUtilities, theme, config, e }) {
	let defaultAnimationDuration = theme("animationDuration.DEFAULT");
	let defaultTransitionDuration = theme("transitionDuration.DEFAULT");
	let defaultAnimationTimingFunction = theme("animationTimingFunction.DEFAULT");
	let defaultTransitionTimingFunction = theme("transitionTimingFunction.DEFAULT");

	let prefix = (name) => e(config("prefix") + name);
	let keyframes = Object.fromEntries(
		Object.entries(theme("keyframes") ?? {}).map(([key, value]) => {
			return [key, { [`@keyframes ${prefix(key)}`]: value }];
		})
	);

	// Animations

	matchUtilities(
		{
			animation: (value) => {
				let animations = parseAnimationValue(value);

				return [
					...animations.flatMap((animation) => keyframes[animation.name]),
					{
						animation: animations
							.map(({ name, value }) => {
								if (name === undefined || keyframes[name] === undefined) {
									return value;
								}
								return value.replace(name, prefix(name));
							})
							.join(", "),
					},
				];
			},
		},
		{ values: theme("animation") }
	);

	matchUtilities(
		{
			"animation-name": (value) => {
				let values = value.split(COMMA);
				let names = values.map((value) => prefix(value)).join();
				let frames = values.map((value) => keyframes[value]);

				return [
					...frames,
					{
						animationName: names,
						...(value === "none"
							? {}
							: {
									animationDuration: defaultAnimationDuration,
									animationTimingFunction: defaultAnimationTimingFunction,
							  }),
					},
				];
			},
		},
		{ values: Object.fromEntries(Object.keys(theme("keyframes")).map((key) => [key, key])) }
	);

	matchUtilities({ "animation-delay": (value) => ({ animationDelay: value }) }, { values: theme("animationDelay") });

	matchUtilities(
		{ "animation-duration": (value) => ({ animationDuration: value }) },
		{ values: theme("animationDuration") }
	);

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

	matchUtilities({ direction: (value) => ({ animationDirection: value }) }, { values: theme("animationDirection") });

	matchUtilities(
		{ "animation-ease": (value) => ({ animmationTimingFunction: value }) },
		{ values: theme("animationTimingFunction") }
	);

	// Transitions

	matchUtilities({ transition: (value) => ({ transition: value }) }, { values: theme("transition") });

	matchUtilities(
		{
			"transition-property": (value) => {
				return {
					transitionProperty: value,
					...(value === "none"
						? {}
						: {
								transitionDuration: defaultTransitionDuration,
								transitionTimingFunction: defaultTransitionTimingFunction,
						  }),
				};
			},
		},
		{ values: theme("transitionProperty") }
	);

	matchUtilities(
		{ "transition-delay": (value) => ({ transitionDelay: value }) },
		{ values: theme("transitionDelay") }
	);

	matchUtilities(
		{ "transition-duration": (value) => ({ transitionDuration: value }) },
		{ values: theme("transitionDuration") }
	);

	matchUtilities(
		{ "transition-ease": (value) => ({ transitionTimingFunction: value }) },
		{ values: theme("transitionTimingFunction") }
	);
}

export default plugin(animationPlugin, defaultOptions);
