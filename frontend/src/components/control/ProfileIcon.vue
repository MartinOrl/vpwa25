<template>
  <div
    :style="{
      position: 'relative',
      margin: '0 auto',
      width: '2.75rem',
    }"
  >
    <UserProfileImage :user="user" :size="42" :show-user-status="true" />

    <UserOptionsPopup />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { User } from '@/utils/types/user'
import UserOptionsPopup from '../popup/UserOptionsPopup.vue'
import UserProfileImage from '../user/userProfileImage.vue'

const { user } = useAuthStore() as { user: User }

defineComponent({
  setup() {
    return {
      user: user,
      spacing,
    }
  },
})
</script>
