This plugin gives you tailwind utility classes for all animation properties

# Install

```
npm install https://github.com/subhero24/tailwindcss-animation
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
		transitionDelay: false,
		transitionDuration: false,
		transitionTimingFunction: false,
	},
};
```

# Classes

## Animation

### animation

theme.animation

.animation-spin
.animation-ping
.animation-pulse
.animation-bounce

### animation name

theme.keyframes

.animation-name-spin
.animation-name-ping
.animation-name-pulse
.animation-name-bounce

### animation play state

.play-state-paused
.play-state-running

### animation fill mode

.fill-mode-none
.fill-mode-both
.fill-mode-forwards
.fill-mode-backwards

### animation composition

.composition-add
.composition-replace
.composition-accumulate

### animation iterations

theme.animationIterations

.iterations-0
.iterations-1
.iterations-infinite

## Duration

theme.duration
theme.animationDuration
theme.transitionDuration

### animation duration

.animation-duration-75
.animation-duration-100
.animation-duration-150
.animation-duration-200
.animation-duration-300
.animation-duration-500
.animation-duration-700
.animation-duration-1000

### transition duration

.transition-duration-75
.transition-duration-100
.transition-duration-150
.transition-duration-200
.transition-duration-300
.transition-duration-500
.transition-duration-700
.transition-duration-1000

## Delay

theme.delay

.delay-75
.delay-100
.delay-150
.delay-200
.delay-300
.delay-500
.delay-700
.delay-1000

### animation delay

theme.delay
theme.animationDelay

.animation-delay-75
.animation-delay-100
.animation-delay-150
.animation-delay-200
.animation-delay-300
.animation-delay-500
.animation-delay-700
.animation-delay-1000

### transition delay

theme.delay
theme.transitionDelay

.transition-delay-75
.transition-delay-100
.transition-delay-150
.transition-delay-200
.transition-delay-300
.transition-delay-500
.transition-delay-700
.transition-delay-1000

## Timing function

theme.timingFunction

.ease-linear
.ease-in
.ease-out
.ease-in-out

### animation timing function

theme.timingFunction
theme.animationTimingFunction

.animation-ease-linear
.animation-ease-in
.animation-ease-out
.animation-ease-in-out

### transition timing function

theme.timingFunction
theme.transitionTimingFunction

.transition-ease-linear
.transition-ease-in
.transition-ease-out
.transition-ease-in-out

# Advanced usage

## Use your timing functions in the animation values

```javascript
theme: {
	extend: {
		keyframes: {
			'fade-in': {
				'0%': { opacity: 0 },
				'100%': { opacity: 1 },
			},
			'slide-up': {
				'0%': { transform: 'translateY(2rem)' },
				'100%': { transform: 'translateY(0)' },
			}
		}
		animation: {
			appear: 'fade-in 200ms ease-out, slide-up 1s wobbly'
		},
		animationTimingFunction: {
			wobbly: 'linear(0, 0.037 1.8%, 0.151 3.9%, 0.767 11.2%, 0.99, 1.131 17.5%, 1.174 19%, 1.199 20.7%, 1.208, 1.193 25.1%, 1.011 36.1%, 0.976, 0.959 42.8%, 0.96 47.5%, 0.997 58.3%, 1.008 64.6%, 0.999 85.5% 100%)'
		},
	}
}
```

## Allow complex custom animations/transitions with different easings, durations, delays, ...

```html
<div class="transition-[opacity,transform] transition-ease-[out,wobbly] transition-duration-[200ms,1s]"></div>
```

## Specify fallback timing functions

```javascript
theme: {
	extend: {
		timingFunction: {
			wobbly: [
				'ease-out', // Fallback if linear is not supported
				'linear(0, 0.037 1.8%, 0.151 3.9%, 0.767 11.2%, 0.99, 1.131 17.5%, 1.174 19%, 1.199 20.7%, 1.208, 1.193 25.1%, 1.011 36.1%, 0.976, 0.959 42.8%, 0.96 47.5%, 0.997 58.3%, 1.008 64.6%, 0.999 85.5% 100%)',
			]
		},
	}
}
```
