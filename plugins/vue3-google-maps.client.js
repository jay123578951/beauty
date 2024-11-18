import { defineNuxtPlugin } from "#app";
import VueGoogleMaps from "@fawmi/vue-google-maps";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const { mapApiKey: MAP_API_KEY } = runtimeConfig.public;

  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: { key: MAP_API_KEY },
  });
});
