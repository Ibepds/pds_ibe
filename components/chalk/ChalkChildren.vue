<template>
  <svg
    class="mx-auto w-full max-w-[320px] text-white"
    viewBox="0 0 320 140"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- horizon -->
    <path d="M20 110 Q160 95 300 110" />
    <!-- 5 figures holding hands -->
    <g v-for="(x, i) in [50, 95, 140, 185, 230]" :key="i">
      <circle :cx="x" :cy="72 - (i === 2 ? 8 : i === 1 || i === 3 ? 4 : 0)" r="10" />
      <path
        :d="`M${x} 82 v28 M${x - 12} 92 l12 8 l12-8 M${x - 18} 100 h36`"
      />
      <line
        v-if="i < 4"
        :x1="x + 18"
        y1="88"
        :x2="x + 27"
        y2="88"
      />
    </g>
    <!-- clouds & heart -->
    <path d="M60 35 Q70 28 80 35 Q90 28 100 35" stroke-width="1.5" class="opacity-60" />
    <path d="M220 30 Q230 23 240 30 Q250 23 260 30" stroke-width="1.5" class="opacity-60" />
    <path
      d="M160 28c-4-6-14-6-14 4 0 10 14 16 14 16s14-6 14-16c0-10-10-10-14-4z"
      fill="currentColor"
      stroke="none"
      class="text-primary-light opacity-80"
      transform="scale(0.5) translate(260 20)"
    />
  </svg>
</template>
