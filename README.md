This plugin gives you tailwind utility classes for all animation and transition properties

# Install

```
npm install https://github.com/subhero24/tailwindcss-animation -D
```

Add the plugin to your tailwind config file

```javascript
import tailwindAnimationPlugin from "tailwindcss-animation";

export default {
	plugins: [tailwindAnimationPlugin],
};
```

This plugin uses explicit transition and animation prefixes for classes, so feel free to disabled the core plugins:

```javascript
export default {
	corePlugins: {
		animation: false,
		transition: false,
		transitionDelay: false,
		transitionDuration: false,
		transitionTimingFunction: false,
	},
};
```

# Classes

## Animation

theme.animation

-   animation-spin
-   animation-ping
-   animation-pulse
-   animation-bounce

### animation name

theme.keyframes

-   animation-name-spin
-   animation-name-ping
-   animation-name-pulse
-   animation-name-bounce

### animation timing function

theme.animationTimingFunction

-   animation-ease-in
-   animation-ease-out
-   animation-ease-in-out
-   animation-ease-linear

### animation delay

theme.animationDelay

-   animation-delay-0
-   animation-delay-75
-   animation-delay-100
-   animation-delay-150
-   animation-delay-200
-   animation-delay-300
-   animation-delay-500
-   animation-delay-700
-   animation-delay-1000

### animation duration

theme.animationDuration

-   animation-duration-0
-   animation-duration-75
-   animation-duration-100
-   animation-duration-150
-   animation-duration-200
-   animation-duration-300
-   animation-duration-500
-   animation-duration-700
-   animation-duration-1000

### animation iterations

theme.animationIterations

-   iterations-0
-   iterations-1
-   iterations-infinite

### animation play state

-   play-state-paused
-   play-state-running

### animation fill mode

-   fill-mode-none
-   fill-mode-both
-   fill-mode-forwards
-   fill-mode-backwards

### animation composition

-   composition-add
-   composition-replace
-   composition-accumulate

## Transitions

### transition delay

theme.transitionDelay

-   transition-delay-75
-   transition-delay-100
-   transition-delay-150
-   transition-delay-200
-   transition-delay-300
-   transition-delay-500
-   transition-delay-700
-   transition-delay-1000

### transition duration

theme.transitionDuration

-   transition-duration-0
-   transition-duration-75
-   transition-duration-100
-   transition-duration-150
-   transition-duration-200
-   transition-duration-300
-   transition-duration-500
-   transition-duration-700
-   transition-duration-1000

### transition timing function

theme.transitionTimingFunction

-   transition-ease-in
-   transition-ease-out
-   transition-ease-in-out
-   transition-ease-linear
