<template>
  <Navigation />

  <section
    class="mb-4 flex min-h-[20vh] items-end justify-center rounded-2xl bg-gradient-to-l from-[#ffecd2] to-[#fcb69f] p-4"
  >
    <div class="flex w-full max-w-7xl rounded-2xl bg-white p-3">
      <slot name="searchBar" />
    </div>
  </section>

  <section class="flex justify-center">
    <div class="flex w-full max-w-7xl">
      <slot name="content" />
    </div>
  </section>
</template>
