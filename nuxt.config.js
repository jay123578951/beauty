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
      apiUrl: process.env.API_URL || "http://localhost:3001",
    },
  },

  devServer: {
    proxy: {
      "/api": {
        target: "http://13.112.145.125:3001",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: ["@fawmi/vue-google-maps", "fast-deep-equal", "pinia"],
    },
  },

  modules: ["@pinia/nuxt"],
  imports: {
    dirs: ["./components/Header", "./pages/**"],
  },
};
