/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open sans", "sans-serif"],
        owners: ["owners-narrow", "sans-serif"],
        ownersx: ["owners-xnarrow", "sans-serif"],
        "helvetica-display": ["HelveticaNowDisplay", "sans-serif"],
        "helvetica-text": ["HelveticaNowText", "sans-serif"],
        "helvetica-micro": ["HelveticaNowMicro", "sans-serif"],
        "sf-pro-text": ["SF Pro Text", "system-ui", "Open Sans", "sans-serif"],
      },
      screens: {
        xs: "520px",
      },
      colors: {
        "almost-black": "rgba(0, 0, 0, .8) !important",
        "club-red": "var(--club-red)",
        "background": "hsl(var(--background))",
        "foreground": "hsl(var(--foreground))",
        "foreground-transparent": "hsla(var(--foreground-transparent))",
        "primary": "hsl(var(--primary))",
        // secondary: "#FFFFFF",
      },
      backgroundImage: {
        "live-page-player": "url('/lil_buddy_low_res.png')",
      },
      xShadow: {
        "lens-profile-hover": "shadow-[0 0 0 4px #2980b9, 0 0 0 7px #0d293c]",
      },
      height: {
        "full-minus-header": "calc(100vh - 88px)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "fade-in-from-top": {
          from: {
            opacity: 0,
            transform: "translateY(10px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "fade-in-and-out-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "50%": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "80%": {
            opacity: 1,
            transform: "translateY(-5px)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(-10px)",
          },
        },
        "move-txt-bg": {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
        crash: {
          "0%": {
            translate: "-100vw",
          },
          "50%": {
            translate: "0",
          },
        },
        destroy: {
          "50%": {
            translate: "0",
            transform: "scale(1)",
            transitionTimingFunction: "cubic-bezier(0,0,0.2,1)",
            color: "red",
          },
          "60%": {
            translateY: "0 -60vh",
            transform: "scale(1.4)",
          },
          "80%": {
            translateY: "0 30vh",
            transform: "scale(0.8)",
          },
          "100%": {
            translateY: "0 0vh",
            transform: "scale(1)",
          },
        },
        scale: {
          "0%, 100%": {
            transform: "scale(1.0)",
          },
          "50%": {
            transform: "scale(0)",
          },
        },
      },
      animation: {
        "move-txt-bg": "move-txt-bg 8s linear infinite",
        "fade-in-and-out-up": "fade-in-and-out-up 2s ease-in-out",
        "fade-in-from-top": "fade-in-from-top 0.5s var(--ease-squish-1) forwards calc(var(--_delay) * 100ms)",
        crash: "crash 6s linear",
        destroy: "destroy 6s",
        scale: "scale 2s infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        '@media (max-width: 767px)': { // Just below the 'md' breakpoint
          '.mask-gradient-bottom': {
            '-webkit-mask-image': 'linear-gradient(to bottom, transparent, black 75%)',
            'mask-image': 'linear-gradient(to bottom, transparent, black 75%)',
          }
        }
      };
      addUtilities(newUtilities, ['responsive']);
    })
  ],
};
