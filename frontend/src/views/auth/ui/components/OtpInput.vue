<script setup lang="ts">
interface Props {
  modelValue: string;
  length: number;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inputs = ref<HTMLInputElement[]>([]);
const digits = ref<string[]>([]);

const initDigits = () => {
  digits.value = Array(props.length)
    .fill("")
    .map((_, i) => props.modelValue?.[i] ?? "");
};

initDigits();

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      digits.value = Array(props.length).fill("");
      return;
    }

    digits.value = Array(props.length)
      .fill("")
      .map((_, i) => val[i] ?? "");
  },
);

const combined = computed(() => digits.value.join(""));

watch(combined, (val) => {
  emit("update:modelValue", val);
});

const handleInput = async (index: number) => {
  const value = digits.value[index] ?? "";

  if (!/^\d$/.test(value)) {
    digits.value[index] = "";
    return;
  }

  if (index < props.length - 1) {
    await nextTick();
    inputs.value[index + 1]?.focus();
  }
};

const handleBackspace = async (index: number) => {
  if (!digits.value[index] && index > 0) {
    await nextTick();
    inputs.value[index - 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();

  const pasted = event.clipboardData?.getData("text") ?? "";

  if (!/^\d+$/.test(pasted)) return;

  const values = pasted.slice(0, props.length).split("");

  digits.value = [...values, ...Array(props.length - values.length).fill("")];
};

const handleKeydown = async (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      if (index > 0) {
        await nextTick();
        inputs.value[index - 1]?.focus();
      }
      break;

    case "ArrowRight":
      event.preventDefault();
      if (index < props.length - 1) {
        await nextTick();
        inputs.value[index + 1]?.focus();
      }
      break;

    case "Home":
      event.preventDefault();
      inputs.value[0]?.focus();
      break;

    case "End":
      event.preventDefault();
      inputs.value[props.length - 1]?.focus();
      break;
  }
};
</script>

<template>
  <section class="flex flex-wrap justify-center gap-2 max-w-full mx-auto">
    <input
      v-for="(_, index) in length"
      :key="index"
      ref="inputs"
      v-model="digits[index]"
      type="text"
      maxlength="1"
      inputmode="numeric"
      placeholder="•"
      class="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 transition"
      @focus="(e) => (e.target as HTMLInputElement).select()"
      @input="handleInput(index)"
      @keydown="handleKeydown($event, index)"
      @keydown.backspace="handleBackspace(index)"
      @paste="handlePaste"
    />
  </section>
</template>
