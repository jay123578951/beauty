<template>
  <div class="h-screen bg-primary-light">
    <Navigation />

    <!-- <section class="fixed top-0 z-0">
      <slot name="maps" />
    </section> -->

    <!-- <section class="relative z-10 mx-4 mb-8">
      <slot name="searchBar" />
    </section> -->

    <section class="relative z-0 flex justify-center">
      <div class="mx-4 flex w-full">
        <slot name="content" />
      </div>
    </section>

    <!-- <Footer /> -->
  </div>
</template>
