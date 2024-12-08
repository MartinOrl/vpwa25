<template>
  <div
    :style="{
      position: 'relative',
      margin: '0 auto',
      width: '2.75rem',
    }"
  >
    <UserProfileImage :user="_user" :size="42" :show-user-status="true" />

    <UserOptionsPopup />
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { User } from '@/utils/types/user'
import UserOptionsPopup from '../popup/UserOptionsPopup.vue'
import UserProfileImage from '../user/userProfileImage.vue'

const { user } = useAuthStore()

const _counter = computed(() => user?.status)
const _user = ref(user as User)

watch(_counter, () => {
  _user.value = user as User
})

defineComponent({
  setup() {
    return {
      user: user,
      spacing,
    }
  },
})
</script>
