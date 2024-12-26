<template>
  <div class="bg-primary-light lg:h-screen">
    <Header />

    <section class="relative z-0 flex justify-center">
      <div class="mx-4 flex w-full">
        <slot name="content" />
      </div>
    </section>
  </div>
</template>
