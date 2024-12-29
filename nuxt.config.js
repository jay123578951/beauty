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
      apiUrl: process.env.API_URL || "http://localhost:3001",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
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
      include: ["fast-deep-equal", "pinia"],
    },
  },

  modules: ["@pinia/nuxt"],
  imports: {
    dirs: ["./components/Header", "./pages/**"],
  },
};
