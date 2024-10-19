<template>
  <q-menu fit anchor="bottom left" :offset="[0, 10]" :style="menuStyles">
    <q-list>
      <q-item
        v-for="option in options"
        :key="option.command"
        clickable
        v-ripple
        v-model="selectedOption"
        :label="option.command"
        :value="option.command"
      >
        <q-item-section :style="optionStyles">
          <p :style="commandStyle">
            {{ option.command }}
          </p>
          <div>
            <p>
              {{ option.shadow }}
            </p>
            <p>
              {{ option.description }}
            </p>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { palette, spacing } from '@/css/theme'
import { getCommands } from '@/utils/commands'

const menuStyles = computed(() => ({
  background: palette.background,
  border: `1px solid ${palette.border}`,
  borderRadius: spacing(2),
  color: palette.textOpaque,
}))

const commandStyle = computed<CSSProperties>(() => ({
  color: palette.textOnPrimary,
  maxWidth: '64px',
  width: '100%',
}))

const optionStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: spacing(6),
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))

// Dropdown options
const options = ref(getCommands())

// Selected option
const selectedOption = ref('option1') // Set default value
</script>
