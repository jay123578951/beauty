<template>
  <div class="bg-primary-light pb-4">
    <Header />

    <section class="m-auto mb-8 flex w-full max-w-7xl justify-center lg:mb-40">
      <div class="mx-4 flex w-full">
        <slot />
      </div>
    </section>

    <Footer />
  </div>
</template>
