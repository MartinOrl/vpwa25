<template>
  <div>
    <q-btn :style="buttonStyles">
      <q-menu
        anchor="top right"
        self="top left"
        :offset="[12, 0]"
        :style="menuStyles"
      >
        <div
          :style="{
            padding: spacing(4),
            borderBottom: `1px solid ${palette.border}`,
          }"
        >
          <div
            :style="{
              display: 'flex',
              gap: spacing(3),
              minWidth: '200px',
            }"
          >
            <UserProfileImage :user="user" :size="40" />
            <div>
              <p
                :style="{
                  marginBottom: '0.125rem',
                  color: palette.textOnPrimary,
                }"
              >
                {{ user?.firstName + ' ' + user?.lastName }}
              </p>
              <p
                :style="{
                  marginBottom: 0,
                  fontSize: '0.875rem',
                }"
              >
                {{ statusType }}
              </p>
            </div>
          </div>
        </div>
        <q-list style="min-width: 200px">
          <q-item clickable v-close-popup @click="toggleStatusDialog">
            <q-item-section>Status</q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            :style="{
              borderBottom: `1px solid ${palette.border}`,
            }"
            @click="togglePreferencesDialog"
          >
            <q-item-section>Preferences</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="logout">
            <q-item-section>Sign Out</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-dialog v-model="preferencesDialog" persistent>
      <q-card style="min-width: 350px" :style="dialogStyles">
        <q-card-section
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
          }"
        >
          <div class="text-h6">Message Preferences</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-btn
            v-model="notifyType"
            dense
            flat
            :style="{
              border: `1px solid ${palette.border}`,
              borderRadius: spacing(2),
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              position: 'relative',
            }"
          >
            <div
              :style="{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: spacing(1),
              }"
            >
              <p
                :style="{
                  textTransform: 'none',
                  marginBottom: 0,
                  fontSize: '0.875rem',
                }"
                @click="togglePreferencesDialog"
              >
                {{
                  _messagesOptions.find((option) => option.value === notifyType)
                    ?.label
                }}
              </p>
              <q-icon name="arrow_drop_down" />
            </div>
            <q-menu
              v-model="preferencesOptionsDialog"
              anchor="bottom left"
              self="top left"
              :style="{
                background: palette.background,
                border: `1px solid ${palette.border}`,
                borderRadius: spacing(2),
                color: palette.textOpaque,
              }"
            >
              <q-list
                :style="{
                  width: '100%',
                }"
              >
                <q-item
                  clickable
                  v-close-popup
                  v-for="option in _messagesOptions"
                  :key="option.label"
                  @click="() => _handleNotifySelect(option)"
                >
                  <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" v-close-popup @click="handleUpdateNotify" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="statusDialog" persistent>
      <q-card style="min-width: 350px" :style="dialogStyles">
        <q-card-section
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
          }"
        >
          <div class="text-h6">Set a Status</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn
            v-model="statusType"
            dense
            flat
            :style="{
              border: `1px solid ${palette.border}`,
              borderRadius: spacing(2),
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              position: 'relative',
            }"
          >
            <div
              :style="{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: spacing(1),
              }"
            >
              <p
                :style="{
                  textTransform: 'none',
                  marginBottom: 0,
                  fontSize: '0.875rem',
                }"
                @click="toggleStatusMenuDialog"
              >
                {{
                  _options.find((option) => option.value === statusType)?.label
                }}
              </p>
              <q-icon name="arrow_drop_down" />
            </div>
            <q-menu
              v-model="statusMenuDialog"
              anchor="bottom left"
              self="top left"
              :style="{
                background: palette.background,
                border: `1px solid ${palette.border}`,
                borderRadius: spacing(2),
                color: palette.textOpaque,
              }"
            >
              <q-list
                :style="{
                  width: '100%',
                }"
              >
                <q-item
                  clickable
                  v-close-popup
                  v-for="option in _options"
                  :key="option.label"
                  @click="() => _handleSelect(option)"
                >
                  <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" v-close-popup @click="handleUpdateStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { palette, spacing } from '@/css/theme'
import { sanitizeStatus, useAuthStore } from '@/stores/authStore'
import { useChannelStore } from '@/stores/channelStore'
import { useUsersStore } from '@/stores/usersStore'
import { User, UserStatus } from '@/utils/types/user'
import UserProfileImage from '../user/userProfileImage.vue'

const { user, logout, updateStatus, notificationsType, setNotificationsType } =
  useAuthStore() as {
    user: User
    logout: () => void
    updateStatus: (status: UserStatus) => void
    notificationsType: 'default' | 'mention'
    setNotificationsType: (type: 'default' | 'mention') => void
  }
const usersStore = useUsersStore()
const { updateUserStatus } = usersStore
const { detach, reattach } = useChannelStore()

const _messagesOptions: { label: string; value: 'default' | 'mention' }[] = [
  { label: 'All messages', value: 'default' },
  { label: 'Mentions Only', value: 'mention' },
]

const _options = [
  { label: 'Online', value: UserStatus.ONLINE },
  { label: 'Do not disturb', value: UserStatus.DO_NOT_DISTURB },
  { label: 'Offline', value: UserStatus.OFFLINE },
]

const statusDialog = ref(false)
const preferencesDialog = ref(false)
const preferencesOptionsDialog = ref(false)
const statusMenuDialog = ref(false)
const notifyType = ref(notificationsType)
const statusType = ref(
  _options.find(
    (option) => option.value.toUpperCase() === user.status.toUpperCase(),
  )?.label,
)

const togglePreferencesDialog = () => {
  preferencesDialog.value = !preferencesDialog.value
}

const buttonStyles = computed(() => ({
  background: 'transparent',
  boxShadow: 'none',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
}))

const menuStyles = computed(() => ({
  background: palette.background,
  border: `1px solid ${palette.border}`,
  borderRadius: spacing(2),
  color: palette.textOpaque,
}))

const dialogStyles = computed(() => ({
  background: palette.background,
  color: palette.textOnPrimary,
}))

defineComponent({
  setup() {
    return {
      user: user,
      spacing,
    }
  },
})

const authStore = useAuthStore()
authStore.$subscribe(() => {
  const userMatch = usersStore.findUserById(user.id)
  console.log('matchh', userMatch)
  statusType.value = sanitizeStatus(
    _options.find(
      (option) =>
        option.value.toUpperCase() === userMatch?.status.toUpperCase(),
    )?.value as string,
  )
  console.log('statusType', statusType.value, userMatch?.status)
})

// usersStore.$subscribe(() => {
//   const userMatch = usersStore.findUserById(user.id)
//   console.log('matchh', userMatch)
//   statusType.value = sanitizeStatus(
//     _options.find(
//       (option) =>
//         option.value.toUpperCase() === userMatch?.status.toUpperCase(),
//     )?.value as string,
//   )
// })

function toggleStatusDialog() {
  statusDialog.value = !statusDialog.value
}

function toggleStatusMenuDialog() {
  statusMenuDialog.value = !statusMenuDialog.value
}

const _handleNotifySelect = (value: {
  label: string
  value: 'default' | 'mention'
}) => {
  notifyType.value = value.value
  preferencesOptionsDialog.value = false
}

const _handleSelect = (value: { label: string; value: UserStatus }) => {
  console.log(value)
  statusType.value = value.value
  statusMenuDialog.value = false
}

const handleUpdateNotify = () => {
  setNotificationsType(notifyType.value)
}

function handleUpdateStatus() {
  updateStatus(statusType.value as UserStatus)
  updateUserStatus(user.id, statusType.value as UserStatus)
  if (statusType.value === UserStatus.OFFLINE) {
    detach()
  } else {
    reattach()
  }
}
</script>
