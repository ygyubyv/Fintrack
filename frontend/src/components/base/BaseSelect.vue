<template>
  <div class="flex flex-col relative">
    <label
      v-if="label"
      :for="id"
      class="mb-1 text-sm font-medium text-neutral-800"
    >
      {{ label }}
    </label>

    <button
      :id="id"
      type="button"
      :class="[
        'flex items-center justify-between rounded-lg border text-left transition-colors duration-200',
        sizeClasses,
        error
          ? 'border-red-500 bg-red-50'
          : 'border-neutral-300 hover:border-neutral-400',
      ]"
      @click="toggle"
    >
      <span class="truncate">
        {{ displayLabel }}
      </span>

      <font-awesome-icon
        icon="chevron-down"
        class="text-xs transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <transition name="select">
      <ul
        v-if="isOpen"
        class="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-md overflow-hidden"
      >
        <li
          v-for="option in options"
          :key="option.value ?? option.label"
          :class="[
            'flex items-center gap-2 px-4 py-2 text-sm cursor-pointer',
            isActive(option) ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50',
          ]"
          @click="select(option)"
        >
          <input
            v-if="multiple"
            type="checkbox"
            class="pointer-events-none"
            :checked="isActive(option)"
          />

          {{ option.label }}
        </li>
      </ul>
    </transition>

    <p v-if="error" class="mt-1 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
type Size = "Small" | "Medium" | "Big";

interface Option {
  label: string;
  value: string | number | null;
}

interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  error?: string;
  size?: Size;
  options: Option[];
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "Medium",
  placeholder: "Select option",
  multiple: false,
});

const model = defineModel<Option["value"] | Option["value"][]>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const isActive = (option: Option) => {
  if (props.multiple) {
    return Array.isArray(model.value) && model.value.includes(option.value);
  }

  return model.value === option.value;
};

const select = (option: Option) => {
  if (props.multiple) {
    const arr = Array.isArray(model.value) ? [...model.value] : [];

    const index = arr.indexOf(option.value);

    if (index > -1) {
      arr.splice(index, 1);
    } else {
      arr.push(option.value);
    }

    model.value = arr;
  } else {
    model.value = option.value;
    isOpen.value = false;
  }
};

const displayLabel = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(model.value) || model.value.length === 0) {
      return props.placeholder;
    }

    const labels = props.options
      .filter((option) => {
        return (model.value as Option["value"][]).includes(option.value);
      })
      .map((option) => {
        return option.label;
      });

    return labels.join(", ");
  }

  const selected = props.options.find((option) => {
    return option.value === model.value;
  });

  return selected?.label || props.placeholder;
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "Small":
      return "px-3 py-1.5 text-xs";
    case "Big":
      return "px-6 py-3 text-base";
    default:
      return "px-4 py-2 text-sm";
  }
});
</script>

<style scoped>
.select-enter-active,
.select-leave-active {
  transition: all 0.15s ease;
}

.select-enter-from,
.select-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
