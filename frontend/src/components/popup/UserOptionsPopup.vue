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
            <img
              :src="user?.image"
              alt="Profile"
              :style="{
                objectFit: 'contain',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: spacing(2),
              }"
            />
            <div>
              <p
                :style="{
                  marginBottom: '0.125rem',
                  color: palette.textOnPrimary,
                }"
              >
                {{ user?.name + ' ' + user?.surname }}
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
          <q-item clickable v-close-popup>
            <q-item-section>Profile</q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            :style="{
              borderBottom: `1px solid ${palette.border}`,
            }"
          >
            <q-item-section>Preferences</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="logout">
            <q-item-section>Sign Out</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

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
                {{ statusSelect }}
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
          <q-btn
            flat
            label="Save"
            v-close-popup
            @click="handleUpdateStatus"
            :disable="statusSelect === user?.status || !statusSelect"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { palette, spacing } from '@/css/theme'
import { useAuthStore } from '@/stores/authStore'
import { UserStatus } from '@/utils/types/user'
const { user, logout, updateStatus } = useAuthStore()

const statusDialog = ref(false)
const statusMenuDialog = ref(false)
const statusType = computed(() => user?.status)
const statusSelect = ref(user?.status)

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

const _options = [
  { label: 'Online', value: UserStatus.ONLINE },
  { label: 'Do not disturb', value: UserStatus.DO_NOT_DISTURB },
  { label: 'Offline', value: UserStatus.OFFLINE },
]

defineComponent({
  setup() {
    return {
      user: user,
      spacing,
    }
  },
})

function toggleStatusDialog() {
  statusDialog.value = !statusDialog.value
}

function toggleStatusMenuDialog() {
  statusMenuDialog.value = !statusMenuDialog.value
}

const _handleSelect = (value: { label: string; value: UserStatus }) => {
  console.log(value)
  statusSelect.value = value.value
  statusMenuDialog.value = false
}

function handleUpdateStatus() {
  updateStatus(statusSelect.value as UserStatus)
}
</script>
