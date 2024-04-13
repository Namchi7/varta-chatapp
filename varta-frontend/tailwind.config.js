/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        msg: "0 2px 5px 1px rgba(0,0,0, 0.2)",
      },
      keyframes: {
        loaderRotate: {
          "0%": { transform: "rotate(0)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        loaderAnim1: "loaderRotate 1.5s ease-in-out infinite",
        loaderAnim2: "loaderRotate 1.5s ease-in-out infinite",
        loaderAnim3: "loaderRotate 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
