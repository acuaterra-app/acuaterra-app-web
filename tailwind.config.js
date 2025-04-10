/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Color palette provided following ACUATERRA colors
        primary: "#44cbd3",
        secondary: "#3cacac",
        tertiary: "#34969e",
        quaternary: "#84bd7d",  
        quinary: "#7fb050",
        lightGray: "#ccd7d6",
        greenish: "#6ca09c",
        teal: "#649c94",
        darkGray: "#5d7a7e", //ErrorMesagge color
        veryDark: "#303537",
        
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],// specified fonts for project
      },
      // Defined sizes for headers (using rem; 1rem = 16px)
      fontSize: {
        h1: ["1.75rem", { lineHeight: "2.25rem" }], // 28px aprox.
        h2: ["1.5rem", { lineHeight: "2rem" }],       // 24px aprox.
        h3: ["1.25rem", { lineHeight: "1.75rem" }],    // 20px aprox.
      },
      keyframes: {
        "square-in-hesitate": {
          "0%": { clipPath: "inset(100% 100% 100% 100%)" },
          "40%": { clipPath: "inset(33% 33% 33% 33%)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "square-in-center": {
          from: { clipPath: "inset(100% 100% 100% 100%)" },
          to: { clipPath: "inset(0 0 0 0)" },
        },
        "wipe-in-right": {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "inset(0 0 0 0)" },
        },
      },
      animation: {
        "square-in-hesitate": "square-in-hesitate 2.5s cubic-bezier(0.25, 1, 0.3, 1) both",
        "square-in-center": "square-in-center 2.5s cubic-bezier(0.25, 1, 0.3, 1) both",
        "wipe-in-right": "wipe-in-right 2.5s cubic-bezier(0.25, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
