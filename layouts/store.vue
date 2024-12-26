<template>
  <div class="bg-primary-light pb-4">
    <Header />

    <section class="m-4 lg:my-16">
      <div class="m-auto w-full max-w-7xl">
        <slot name="title"></slot>
      </div>
    </section>

    <section class="mx-4 mb-8">
      <slot name="banner"></slot>
    </section>

    <section class="mx-4 mb-40">
      <div class="m-auto w-full max-w-7xl">
        <slot name="content" />
      </div>
    </section>

    <Footer />
  </div>
</template>
