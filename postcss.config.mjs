/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Pridaný autoprefixer pre lepšiu kompatibilitu štýlov
  },
};

export default config;
