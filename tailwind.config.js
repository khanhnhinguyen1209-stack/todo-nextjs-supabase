/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Dòng quan trọng: Bảo Tailwind tìm class trong thư mục src
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};