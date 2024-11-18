export default {
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: [],

  runtimeConfig: {
    public: {
      mapApiKey: "AIzaSyDpXWj2tq9dlmSyUOJ2N0GDKIVeGfhChM4",
      // mapApiKey: "xxx",
    },
  },

  vite: {
    optimizeDeps: {
      include: ["@fawmi/vue-google-maps", "fast-deep-equal"],
    },
  },
};
