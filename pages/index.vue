<script setup>
const searchData = reactive({
  store: null,
  location: null,
  dateRange: {
    start: new Date(),
    end: new Date(),
  },
  services: null,
});

const handleSearchDataUpdate = (date) => {
  Object.assign(searchData, toRaw(date));
};

definePageMeta({
  layout: "main",
});
</script>

<template>
  <main class="px-4">
    <section class="relative mb-10 xl:mb-0 xl:min-h-screen">
      <div
        class="background-main relative mb-8 flex flex-col items-center justify-between rounded-2xl bg-cover bg-local bg-center p-4 md:p-6 lg:min-h-[40vh] lg:rounded-3xl xl:min-h-[70vh]"
      >
        <div class="w-full max-w-7xl py-4 font-light lg:py-12">
          <h1
            class="mb-3 text-3xl font-medium text-white text-opacity-[80%] lg:text-6xl lg:font-light"
          >
            完美造型，隨時隨地
          </h1>
          <p class="text-lg text-white text-opacity-[80%] lg:text-2xl">
            快速預約，輕鬆找到最適合你的髮型設計師！
          </p>
        </div>
        <div
          class="flex w-full max-w-7xl rounded-2xl bg-white py-6 md:px-4 lg:p-3"
        >
          <SearchBar
            :formValue="searchData"
            @update:form-value="handleSearchDataUpdate"
          />
        </div>
      </div>
      <div>
        <div class="m-auto h-16 w-[1px] bg-primary-dark"></div>
        <div
          class="relative bottom-5 left-2 m-auto h-6 w-[1px] rotate-45 bg-primary-dark"
        ></div>
      </div>
    </section>

    <section
      class="relative m-auto px-4 pb-20 lg:max-w-4xl lg:px-0 lg:pb-40 xl:max-w-7xl"
    >
      <div>
        <div class="mb-10 md:w-1/2 lg:mb-20 xl:w-1/3">
          <h2 class="mb-2 text-2xl font-semibold lg:mb-4 lg:text-3xl">
            類型探索
          </h2>
          <p class="text-sm opacity-75 lg:text-base">
            找到最符合您風格的美容院！透過我們精選的類型分類，您可以輕鬆篩選並發現提供您想要造型的專業設計師，打造專屬於您的完美造型。
          </p>
        </div>
        <div class="m-auto flex flex-col md:max-w-5xl md:flex-row md:space-x-5">
          <div
            class="mb-3 aspect-3/2 h-full w-full md:mb-0 md:aspect-auto md:h-[514px] md:w-1/2 lg:h-[600px]"
          >
            <img
              class="h-full w-full rounded-2xl object-cover brightness-90 lg:rounded-3xl"
              src="/assets/img/indexSpecialEpisode.jpg"
              alt=""
            />
          </div>
          <div class="w-full md:w-1/2 lg:h-[600px]">
            <ul class="flex h-full flex-row flex-wrap gap-3 lg:gap-6">
              <li
                class="relative flex h-40 w-full flex-col items-start justify-between rounded-2xl bg-white bg-opacity-75 p-6 lg:h-[calc(100%/3-1rem)] lg:rounded-3xl lg:p-8"
              >
                <div class="mt-2 w-9 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m9.85,17.035l-2.809-6.846,1.737-4.234c.754-1.762,1.222-3.288,1.222-5.455,0-.276-.224-.5-.5-.5s-.5.224-.5.5c0,1.996-.437,3.416-1.145,5.068l-1.355,3.303-1.359-3.311c-.705-1.645-1.142-3.064-1.142-5.061,0-.276-.224-.5-.5-.5s-.5.224-.5.5c0,2.167.468,3.693,1.219,5.447l1.741,4.242-2.809,6.846c-1.764.179-3.15,1.655-3.15,3.465,0,1.93,1.57,3.5,3.5,3.5,1.28,0,2.39-.698,3-1.726.61,1.028,1.72,1.726,3,1.726,1.93,0,3.5-1.57,3.5-3.5,0-1.81-1.386-3.286-3.15-3.465Zm-1.065.039c-.975.203-1.791.82-2.285,1.651-.494-.831-1.31-1.448-2.285-1.651l2.285-5.568,2.285,5.568Zm-5.285,5.925c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm6,0c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm7.5-18v3h6.5c.276,0,.5.224.5.5s-.224.5-.5.5h-6.5v3h6.5c.276,0,.5.224.5.5s-.224.5-.5.5h-6.5v3h6.5c.276,0,.5.224.5.5s-.224.5-.5.5h-6.5v6.5c0,.276-.224.5-.5.5s-.5-.224-.5-.5V3.5c0-1.93,1.57-3.5,3.5-3.5h4c.276,0,.5.224.5.5s-.224.5-.5.5h-4c-1.379,0-2.5,1.121-2.5,2.5v.5h6.5c.276,0,.5.224.5.5s-.224.5-.5.5h-6.5Z"
                    />
                  </svg>
                </div>
                <div class="absolute right-4 top-4 w-6 -rotate-45 opacity-25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="arrow-circle-down"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Z"
                    />
                    <path
                      d="M16.613,9.528l-2.828-2.879c-.194-.197-.51-.2-.707-.006-.197,.194-.2,.51-.006,.708l2.831,2.882c.187,.187,.448,.473,.715,.774,.131,.148,.224,.316,.286,.493H6.5c-.276,0-.5,.224-.5,.5s.224,.5,.5,.5h10.404c-.063,.177-.155,.345-.287,.493-.266,.301-.527,.587-.717,.777l-2.828,2.879c-.194,.197-.191,.514,.006,.708,.098,.095,.224,.143,.351,.143,.129,0,.259-.05,.356-.149l2.825-2.876c.198-.198,.475-.5,.756-.818,.837-.944,.837-2.368,0-3.312-.282-.318-.559-.621-.753-.815Z"
                    />
                  </svg>
                </div>
                <p class="w-full font-light tracking-wider">菜單</p>
              </li>
              <li
                class="relative flex aspect-square h-[calc(100%/3-1rem)] w-[calc(100%/2-0.375rem)] flex-col items-start justify-between rounded-2xl bg-white bg-opacity-75 p-6 lg:aspect-auto lg:w-[calc(100%/2-0.75rem)] lg:rounded-3xl lg:p-8"
              >
                <div class="mt-2 w-9 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m12,12c3.309,0,6-2.691,6-6S15.309,0,12,0s-6,2.691-6,6,2.691,6,6,6Zm0-11c2.757,0,5,2.243,5,5s-2.243,5-5,5-5-2.243-5-5S9.243,1,12,1Zm9,22v.5c0,.276-.224.5-.5.5s-.5-.224-.5-.5v-.5c0-3.538-2.309-6.547-5.499-7.599l-1.462,2.193,1.446,5.786c.066.268-.117.621-.485.621-.225,0-.429-.151-.485-.379l-1.5-6c-.034-.137-.009-.281.069-.398l1.391-2.086c-.478-.089-.971-.137-1.475-.137s-.996.047-1.474.137l1.39,2.086c.078.117.103.262.069.398l-1.5,6c-.057.228-.26.379-.484.379-.338,0-.553-.354-.485-.621l1.446-5.786-1.462-2.193c-3.19,1.052-5.5,4.061-5.5,7.599v.5c0,.276-.224.5-.5.5s-.5-.224-.5-.5v-.5c0-4.962,4.038-9,9-9s9,4.038,9,9Z"
                    />
                  </svg>
                </div>
                <div class="absolute right-4 top-4 w-6 -rotate-45 opacity-25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="arrow-circle-down"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Z"
                    />
                    <path
                      d="M16.613,9.528l-2.828-2.879c-.194-.197-.51-.2-.707-.006-.197,.194-.2,.51-.006,.708l2.831,2.882c.187,.187,.448,.473,.715,.774,.131,.148,.224,.316,.286,.493H6.5c-.276,0-.5,.224-.5,.5s.224,.5,.5,.5h10.404c-.063,.177-.155,.345-.287,.493-.266,.301-.527,.587-.717,.777l-2.828,2.879c-.194,.197-.191,.514,.006,.708,.098,.095,.224,.143,.351,.143,.129,0,.259-.05,.356-.149l2.825-2.876c.198-.198,.475-.5,.756-.818,.837-.944,.837-2.368,0-3.312-.282-.318-.559-.621-.753-.815Z"
                    />
                  </svg>
                </div>
                <p class="w-full font-light tracking-wider">男性</p>
              </li>
              <li
                class="relative flex aspect-square h-[calc(100%/3-1rem)] w-[calc(100%/2-0.375rem)] flex-col items-start justify-between rounded-2xl bg-white bg-opacity-75 p-6 lg:aspect-auto lg:w-[calc(100%/2-0.75rem)] lg:rounded-3xl lg:p-8"
              >
                <div class="mt-2 w-9 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m23.927,18.7l-1.314-5.585s.003-.003.005-.005c.569-.561.883-1.311.882-2.113,0-1.321-.864-2.468-2.098-2.855C20.737,3.475,16.757,0,12.002,0h-.003C5.425,0,3.297,4.959,1.889,8.241c-.574,1.338-1.069,2.494-1.641,2.827-.195.113-.29.344-.231.562.059.219.257.37.483.37.22,0,3.697-.035,7.501-2.042,0,.014-.001.027-.001.041,0,.552.448,1,1,1s1-.448,1-1c0-.392-.226-.731-.554-.895,1.559-1.029,3.112-2.423,4.461-4.312.161-.226.108-.537-.116-.698-.224-.159-.536-.106-.697.116-3.64,5.096-8.986,6.368-11.37,6.686.373-.6.707-1.377,1.085-2.259C4.19,5.413,6.083.999,11.999.999c0,0,0,0,.003,0,4.36,0,7.992,3.266,8.449,7.598.023.221.189.399.408.439.95.173,1.64.997,1.641,1.965,0,.529-.5,1.961-1.99,1.961l-.429-.006c-.205.031-.407.132-.479.334-.969,2.745-4.15,5.708-7.599,5.708h-.003c-2.433,0-5.051-1.514-6.669-3.857-.493-.714-1.294-1.141-2.143-1.141-1.211,0-2.278.859-2.536,2.043l-.584,2.686c-.228,1.312.133,2.649.991,3.669.857,1.018,2.111,1.602,3.441,1.602h4c.133,0,.26-.052.354-.146s.146-.221.146-.354v-4.127c.982.405,2.003.626,3,.627,1.036,0,2.05-.235,3-.638v4.138c0,.276.224.5.5.5h4c1.331,0,2.585-.584,3.442-1.602.857-1.019,1.219-2.356.985-3.697Zm-15.927.3v3.999h-3.5c-1.035,0-2.01-.454-2.676-1.246-.667-.792-.948-1.832-.775-2.832l.58-2.665c.159-.728.814-1.256,1.559-1.256.521,0,1.014.265,1.32.709.926,1.341,2.154,2.438,3.503,3.187-.007.033-.011.068-.011.104Zm14.177,2.754c-.667.791-1.642,1.245-2.677,1.245h-3.5s0-3.999,0-3.999c0-.044-.006-.086-.017-.126,2.035-1.161,3.672-3.057,4.433-4.913h.08c.44.005.854-.079,1.231-.244l1.22,5.183c.177,1.021-.104,2.061-.771,2.854Zm-7.177-10.755c-.552,0-1-.448-1-1s.448-1,1-1,1,.448,1,1-.448,1-1,1Z"
                    />
                  </svg>
                </div>
                <div class="absolute right-4 top-4 w-6 -rotate-45 opacity-25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="arrow-circle-down"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Z"
                    />
                    <path
                      d="M16.613,9.528l-2.828-2.879c-.194-.197-.51-.2-.707-.006-.197,.194-.2,.51-.006,.708l2.831,2.882c.187,.187,.448,.473,.715,.774,.131,.148,.224,.316,.286,.493H6.5c-.276,0-.5,.224-.5,.5s.224,.5,.5,.5h10.404c-.063,.177-.155,.345-.287,.493-.266,.301-.527,.587-.717,.777l-2.828,2.879c-.194,.197-.191,.514,.006,.708,.098,.095,.224,.143,.351,.143,.129,0,.259-.05,.356-.149l2.825-2.876c.198-.198,.475-.5,.756-.818,.837-.944,.837-2.368,0-3.312-.282-.318-.559-.621-.753-.815Z"
                    />
                  </svg>
                </div>
                <p class="w-full font-light tracking-wider">女性</p>
              </li>
              <li
                class="relative flex aspect-square h-[calc(100%/3-1rem)] w-[calc(100%/2-0.375rem)] flex-col items-start justify-between rounded-2xl bg-white bg-opacity-75 p-6 lg:aspect-auto lg:w-[calc(100%/2-0.75rem)] lg:rounded-3xl lg:p-8"
              >
                <div class="mt-2 w-9 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm4-8.626c0,1.448-1.178,2.626-2.626,2.626h-.874v1.5c0,.276-.224,.5-.5,.5s-.5-.224-.5-.5v-1.5h-.926c-.979,0-1.893-.526-2.382-1.375-.139-.239-.057-.545,.183-.683,.238-.14,.544-.057,.683,.183,.312,.54,.894,.875,1.517,.875h2.8c.896,0,1.626-.729,1.626-1.626,0-.803-.575-1.478-1.368-1.605l-3.422-.55c-1.28-.206-2.21-1.296-2.21-2.593,0-1.448,1.178-2.626,2.626-2.626h.874v-1.5c0-.276,.224-.5,.5-.5s.5,.224,.5,.5v1.5h.926c.979,0,1.892,.527,2.382,1.375,.139,.239,.057,.545-.183,.683-.236,.136-.545,.057-.683-.183-.312-.54-.894-.875-1.517-.875h-2.8c-.896,0-1.626,.729-1.626,1.626,0,.803,.575,1.478,1.368,1.605l3.422,.55c1.28,.206,2.21,1.297,2.21,2.593Z"
                    />
                  </svg>
                </div>
                <div class="absolute right-4 top-4 w-6 -rotate-45 opacity-25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="arrow-circle-down"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Z"
                    />
                    <path
                      d="M16.613,9.528l-2.828-2.879c-.194-.197-.51-.2-.707-.006-.197,.194-.2,.51-.006,.708l2.831,2.882c.187,.187,.448,.473,.715,.774,.131,.148,.224,.316,.286,.493H6.5c-.276,0-.5,.224-.5,.5s.224,.5,.5,.5h10.404c-.063,.177-.155,.345-.287,.493-.266,.301-.527,.587-.717,.777l-2.828,2.879c-.194,.197-.191,.514,.006,.708,.098,.095,.224,.143,.351,.143,.129,0,.259-.05,.356-.149l2.825-2.876c.198-.198,.475-.5,.756-.818,.837-.944,.837-2.368,0-3.312-.282-.318-.559-.621-.753-.815Z"
                    />
                  </svg>
                </div>
                <p class="w-full font-light tracking-wider">價格</p>
              </li>
              <li
                class="relative flex aspect-square h-[calc(100%/3-1rem)] w-[calc(100%/2-0.375rem)] flex-col items-start justify-between rounded-2xl bg-white bg-opacity-75 p-6 lg:aspect-auto lg:w-[calc(100%/2-0.75rem)] lg:rounded-3xl lg:p-8"
              >
                <div class="mt-2 w-9 opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m10.323,11.025l1.418-.328.354-1.418c.093-.371.716-.371.809,0l.356,1.424,1.424.356c.186.046.316.213.316.404s-.13.358-.316.404l-1.424.356-.356,1.424c-.046.186-.213.316-.404.316s-.358-.13-.404-.316l-.357-1.429-1.43-.385c-.185-.05-.312-.218-.308-.409s.137-.356.323-.399Zm2.985-8.192l1.43.385.357,1.429c.046.186.213.316.404.316s.358-.13.404-.316l.356-1.424,1.424-.356c.186-.046.316-.213.316-.404s-.13-.358-.316-.404l-1.424-.356-.356-1.424c-.093-.371-.716-.371-.809,0l-.354,1.418-1.418.328c-.186.043-.32.208-.323.399s.124.36.308.409Zm-7,3l1.43.385.357,1.429c.046.186.213.316.404.316s.358-.13.404-.316l.356-1.424,1.424-.356c.186-.046.316-.213.316-.404s-.13-.358-.316-.404l-1.424-.356-.356-1.424c-.093-.371-.716-.371-.809,0l-.354,1.418-1.418.328c-.186.043-.32.208-.323.399s.124.36.308.409Zm-4.293-.212c.13.52.004,1.06-.142,1.685-.228.979-.486,2.087.179,3.417.418.837.997,1.36,1.506,1.822.805.729,1.441,1.306,1.441,2.954v1c0,.276.224.5.5.5s.5-.224.5-.5v-1c0-2.092-.899-2.907-1.77-3.695-.488-.442-.949-.859-1.283-1.528-.504-1.008-.308-1.851-.1-2.743.16-.688.326-1.4.137-2.154-.269-1.078-.81-1.773-1.245-2.332-.429-.552-.74-.95-.74-1.547V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v1c0,.94.483,1.562.951,2.162.416.535.846,1.087,1.064,1.959Zm14.985,14.379h6.5c.276,0,.5-.224.5-.5s-.224-.5-.5-.5h-6.5c-3.944,0-4.824,2.831-5,4-.176-1.169-1.056-4-5-4H.5c-.276,0-.5.224-.5.5s.224.5.5.5h6.5c2.584,0,3.495,1.448,3.819,2.484-.708-.785-1.882-1.484-3.819-1.484H.5c-.276,0-.5.224-.5.5s.224.5.5.5h6.5c1.263,0,2.242.337,2.928,1H.5c-.276,0-.5.224-.5.5s.224.5.5.5h23c.276,0,.5-.224.5-.5s-.224-.5-.5-.5h-9.428c.685-.663,1.664-1,2.928-1h6.5c.276,0,.5-.224.5-.5s-.224-.5-.5-.5h-6.5c-1.937,0-3.11.699-3.819,1.484.324-1.035,1.235-2.484,3.819-2.484ZM23.5,0c-.276,0-.5.224-.5.5v1c0,.597-.311.996-.74,1.547-.435.559-.976,1.254-1.245,2.332-.189.754-.023,1.466.137,2.154.208.893.404,1.735-.1,2.743-.334.669-.795,1.086-1.283,1.528-.87.788-1.77,1.604-1.77,3.695v1c0,.276.224.5.5.5s.5-.224.5-.5v-1c0-1.648.636-2.225,1.441-2.954.51-.462,1.088-.985,1.506-1.822.665-1.331.407-2.439.179-3.417-.146-.625-.271-1.165-.142-1.685.218-.873.648-1.425,1.064-1.959.467-.6.951-1.221.951-2.162V.5c0-.276-.224-.5-.5-.5Z"
                    />
                  </svg>
                </div>
                <div class="absolute right-4 top-4 w-6 -rotate-45 opacity-25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="arrow-circle-down"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Z"
                    />
                    <path
                      d="M16.613,9.528l-2.828-2.879c-.194-.197-.51-.2-.707-.006-.197,.194-.2,.51-.006,.708l2.831,2.882c.187,.187,.448,.473,.715,.774,.131,.148,.224,.316,.286,.493H6.5c-.276,0-.5,.224-.5,.5s.224,.5,.5,.5h10.404c-.063,.177-.155,.345-.287,.493-.266,.301-.527,.587-.717,.777l-2.828,2.879c-.194,.197-.191,.514,.006,.708,.098,.095,.224,.143,.351,.143,.129,0,.259-.05,.356-.149l2.825-2.876c.198-.198,.475-.5,.756-.818,.837-.944,.837-2.368,0-3.312-.282-.318-.559-.621-.753-.815Z"
                    />
                  </svg>
                </div>
                <p class="w-full font-light tracking-wider">特色</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section
      class="relative m-auto flex flex-col items-end px-4 pb-20 lg:max-w-4xl lg:px-0 lg:pb-40 xl:max-w-7xl"
    >
      <div class="xl:w-1/ mb-10 md:w-1/2 lg:mb-20">
        <h2 class="mb-2 text-2xl font-semibold lg:mb-4 lg:text-3xl">
          沙龍推薦
        </h2>
        <p class="text-sm opacity-75 lg:text-base">
          探索我們精心挑選的沙龍推薦，無論您是追求創新造型、健康護髮，還是放鬆身心，我們都為您提供最合適的選擇，助您輕鬆找到理想的沙龍體驗。
        </p>
      </div>
      <div
        class="m-auto flex w-full max-w-5xl flex-col gap-5 md:h-[450px] md:flex-row md:gap-3 lg:h-[600px] lg:gap-5"
      >
        <ul
          class="flex h-full w-full flex-col gap-5 md:w-[27.5%] md:flex-row md:flex-col"
        >
          <li class="h-full w-full">
            <div class="aspect-video md:aspect-[3/2]">
              <img
                src="/img/recommend01.jpg"
                alt=""
                class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
              />
            </div>
            <div>
              <p class="my-2 text-lg font-medium md:my-3">ALBUM 台北</p>
              <p class="line-clamp-1 text-sm opacity-75">
                提供量身定制的髮型設計，以細膩手法和創新理念，打造出適合每位客人的獨特風格。
              </p>
            </div>
          </li>
          <li class="h-full w-full">
            <div class="aspect-video md:aspect-[3/2]">
              <img
                src="/img/recommend02.jpg"
                alt=""
                class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
              />
            </div>
            <div>
              <p class="my-2 text-lg font-medium md:my-3">Belle 中山</p>
              <p class="line-clamp-1 text-sm opacity-75">
                結合自然元素與現代技術，創造出自然且充滿生機的造型，適合追求簡約美感的顧客。
              </p>
            </div>
          </li>
        </ul>
        <ul class="order-first h-full w-full md:order-none md:w-[45%]">
          <li class="relative h-full w-full">
            <div
              class="via-bg-transparent absolute top-0 h-full w-full rounded-3xl bg-gradient-to-t from-primary-dark"
            ></div>
            <div class="absolute bottom-0 w-full p-6 text-white lg:p-8">
              <p class="my-3 text-lg font-medium">ZEST lill 信義</p>
              <p class="line-clamp-1 text-sm opacity-75">
                專為喜愛個性髮型的都市人設計，從俐落剪裁到前衛染髮，展現最自信的個人風格。
              </p>
            </div>
            <div class="aspect-3/2 md:aspect-auto md:h-full">
              <img
                src="/img/recommend03.jpg"
                alt=""
                class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
              />
            </div>
          </li>
        </ul>
        <ul
          class="flex h-full w-full flex-col gap-5 md:w-[27.5%] md:flex-row md:flex-col"
        >
          <li class="h-full w-full">
            <div class="aspect-video md:aspect-[3/2]">
              <img
                src="/img/recommend04.jpg"
                alt=""
                class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
              />
            </div>
            <div>
              <p class="my-2 text-lg font-medium md:my-3">foto 復興</p>
              <p class="line-clamp-1 text-sm opacity-75">
                專注於健康髮質與優雅風格，結合頂級護髮產品，為客人提供舒適的奢華體驗。
              </p>
            </div>
          </li>
          <li class="h-full w-full">
            <div class="aspect-video md:aspect-[3/2]">
              <img
                src="/img/recommend05.jpg"
                alt=""
                class="aspect-square h-full w-full rounded-2xl object-cover lg:rounded-3xl"
              />
            </div>
            <div>
              <p class="my-2 text-lg font-medium md:my-3">Blossom 中山</p>
              <p class="line-clamp-1 text-sm opacity-75">
                以放鬆、療癒為主題的美容院，設有放鬆空間和精油護理，讓每次造型都成為身心靈的放鬆之旅。
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section
      class="relative z-10 m-auto flex flex-col items-center px-4 pb-20 lg:max-w-4xl lg:px-0 lg:pb-40 xl:max-w-7xl"
    >
      <div class="z-10 mb-10 md:w-1/2 md:text-center lg:mb-20 xl:w-1/3">
        <h2 class="mb-2 text-2xl font-semibold lg:mb-4 lg:text-3xl">
          造型風格
        </h2>
        <p class="text-sm opacity-75 lg:text-base">
          根據您喜愛的髮型風格，我們為您挑選了最適合的沙龍！無論是俐落短髮、柔美長捲，還是個性染髮，立即找到符合您風格的沙龍與設計師，實現理想造型。
        </p>
      </div>
      <ul
        class="relative z-10 m-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:gap-5"
      >
        <li class="aspect-square lg:aspect-[3/2]">
          <img
            class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
            src="/assets/img/hairStyle01.jpg"
            alt=""
          />
        </li>
        <li class="aspect-square lg:aspect-[3/2]">
          <img
            class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
            src="/assets/img/hairStyle02.jpg"
            alt=""
          />
        </li>
        <li class="aspect-square lg:aspect-[3/2]">
          <img
            class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
            src="/assets/img/hairStyle03.jpg"
            alt=""
          />
        </li>
        <li class="aspect-square lg:aspect-[3/2]">
          <img
            class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
            src="/assets/img/hairStyle04.jpg"
            alt=""
          />
        </li>
        <li class="aspect-square lg:aspect-[3/2]">
          <img
            class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
            src="/assets/img/hairStyle05.jpg"
            alt=""
          />
        </li>
        <li class="aspect-square lg:aspect-[3/2]">
          <img
            class="h-full w-full rounded-2xl object-cover lg:rounded-3xl"
            src="/assets/img/hairStyle06.jpg"
            alt=""
          />
        </li>
      </ul>
      <div class="inset-x-6v absolute inset-x-0 bottom-0 z-0 m-auto max-w-7xl">
        <svg
          class="w-full"
          viewBox="0 0 1150 622"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="575" cy="575" r="575" fill="#eae4dc"></circle>
          <circle
            cx="575"
            cy="575.002"
            r="190.667"
            fill="#eae4dc"
            stroke="#F4F1EC"
            stroke-width="2"
          ></circle>
          <circle cx="575" cy="575.002" r="334.917" stroke="#F4F1EC"></circle>
          <path
            d="M973.806 575.001C973.806 795.255 795.254 973.807 575 973.807C354.746 973.807 176.194 795.255 176.194 575.001C176.194 354.747 354.746 176.195 575 176.195C795.254 176.195 973.806 354.747 973.806 575.001Z"
            stroke="#F4F1EC"
          ></path>
          <circle cx="575" cy="575" r="494.639" stroke="#F4F1EC"></circle>
        </svg>
      </div>
    </section>
  </main>
</template>

<style scoped>
.background-main {
  background-image: url("/assets/img/indexBanner.jpg");
}
</style>
