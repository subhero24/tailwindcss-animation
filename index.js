let plugin = require("tailwindcss/plugin");

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

function animationPlugin({ addUtilities, matchUtilities, theme, config, variants, e }) {
	let prefix = (name) => e(config("prefix") + name);
	let keyframes = Object.fromEntries(
		Object.entries(theme("keyframes") ?? {}).map(([key, value]) => {
			return [key, { [`@keyframes ${prefix(key)}`]: value }];
		})
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

	matchUtilities(
		{ "animation-direction": (value) => ({ animationDirection: value }) },
		{ values: theme("animationDirection") }
	);

	matchUtilities(
		{ "animation-duration": (value) => ({ animationDuration: value }) },
		{ values: theme("animationDuration") }
	);

	matchUtilities(
		{ "transition-duration": (value) => ({ transitionDuration: value }) },
		{ values: theme("transitionDuration") }
	);

	matchUtilities({ "animation-delay": (value) => ({ animationDelay: value }) }, { values: theme("animationDelay") });

	matchUtilities(
		{ "transition-delay": (value) => ({ transitionDelay: value }) },
		{ values: theme("transitionDelay") }
	);

	matchUtilities(
		{ "animation-ease": (value) => ({ animationTimingFunction: value }) },
		{ values: theme("animationTimingFunction") }
	);

	matchUtilities(
		{ "transition-ease": (value) => ({ transitionTimingFunction: value }) },
		{ values: theme("transitionTimingFunction") }
	);

	matchUtilities(
		{ animation: (value) => [keyframes[value], { animationName: prefix(value) }] },
		{ values: Object.fromEntries(Object.keys(theme("keyframes")).map((key) => [key, key])) }
	);
}

module.exports = plugin(animationPlugin, defaultOptions);
