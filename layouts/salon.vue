<template>
  <div>
    <Navigation />

    <section class="mx-4 mb-8 mt-24">
      <slot name="searchBar" />
    </section>

    <section class="flex justify-center">
      <div class="flex w-full max-w-7xl">
        <slot name="content" />
      </div>
    </section>

    <Footer />
  </div>
</template>
