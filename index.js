let plugin = require("tailwindcss/plugin");

let defaultOptions = {
	theme: {
		animationIterations: {
			0: 0,
			1: 1,
			infinite: "infinite",
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

	addUtilities(
		{
			".fill-mode-none": { animationFillMode: "none" },
			".fill-mode-both": { animationFillMode: "both" },
			".fill-mode-forwards": { animationFillMode: "forwards" },
			".fill-mode-backwards": { animationFillMode: "backwards" },
		},
		variants("animation")
	);

	addUtilities(
		{
			".paused": { animationPlayState: "paused" },
			".running": { animationPlayState: "running" },
		},
		variants("animation")
	);

	addUtilities(
		{
			".composition-add": { animationComposition: "add" },
			".composition-replace": { animationComposition: "replace" },
			".composition-accumulate": { animationComposition: "accumulate" },
		},
		variants("animation")
	);

	matchUtilities(
		{ iterations: (value) => ({ animationIterationCount: value }) },
		{ values: theme("animationIterations") }
	);

	matchUtilities(
		{ "animation-duration": (value) => ({ animationDuration: value }) },
		{ values: theme("animationDuration") ?? theme("transitionDuration") }
	);

	matchUtilities(
		{ "transition-duration": (value) => ({ transitionDuration: value }) },
		{ values: theme("transitionDuration") }
	);

	matchUtilities(
		{ "animation-delay": (value) => ({ animationDelay: value }) },
		{ values: theme("animationDelay") ?? theme("transitionDelay") }
	);

	matchUtilities(
		{ "transition-delay": (value) => ({ transitionDelay: value }) },
		{ values: theme("transitionDelay") }
	);

	matchUtilities(
		{ "animation-ease": (value) => ({ animationTimingFunction: value }) },
		{ values: theme("animationTimingFunction") ?? theme("transitionTimingFunction") }
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
