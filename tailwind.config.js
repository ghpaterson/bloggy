/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins",
        coustard: "Coustard",
        moonie: "moonie",
      },
      colors: {
        yellowbloggy: "#FCE000",
        pinkbloggy: "#EA6EB0",
        blackbloggy: "#312424",
        brunswick: "#32533D",
        bloggylime: "#CCF5AC",
        bloggypurple: "#9B489B",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
