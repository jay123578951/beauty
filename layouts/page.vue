<template>
  <div class="bg-primary-light pb-4">
    <Header />

    <section class="m-auto mb-40 flex w-full max-w-7xl justify-center">
      <div class="mx-4 flex w-full">
        <slot />
      </div>
    </section>

    <Footer />
  </div>
</template>
