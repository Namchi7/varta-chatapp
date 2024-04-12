/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        msg: "0 2px 5px 1px rgba(0,0,0, 0.2)",
      },
    },
  },
  plugins: [],
};
