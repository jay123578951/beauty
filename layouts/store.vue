<template>
  <div>
    <Navigation />

    <section class="mx-4 mb-8">
      <slot name="banner"></slot>
    </section>

    <section class="mb-40">
      <div class="m-auto w-full max-w-7xl">
        <slot name="content" />
      </div>
    </section>

    <Footer />
  </div>
</template>
