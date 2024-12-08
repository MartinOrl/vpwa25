<template>
  <UserProfileImage :user="userData" v-if="!isSystemMessage" />
  <div
    :style="{
      width: '100%',
    }"
  >
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isSystemMessage ? 'center' : 'flex-start',
      }"
    >
      <p
        :style="{
          fontWeight: 'bold',
        }"
        v-if="!isSystemMessage"
      >
        {{ userData?.firstName }} {{ userData?.lastName }}
      </p>
      <span
        :style="{
          fontSize: '0.75rem',
          color: palette.textOpaque,
          marginLeft: spacing(2),
        }"
        >{{ timestampReadable }}</span
      >
    </div>

    <p
      :style="{
        marginTop: spacing(0.5),
        textWrap: 'wrap',
        wordBreak: 'break-word',
        width: '80%',
        opacity: isSystemMessage ? 0.5 : 1,
        textAlign: isSystemMessage ? 'center' : 'left',
        marginLeft: isSystemMessage ? 'auto' : '0',
        marginRight: isSystemMessage ? 'auto' : '0',
      }"
      v-html="processedContent"
    ></p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { palette, spacing } from '@/css/theme'
import { useChannelStore } from '@/stores/channelStore'
import { useUsersStore } from '@/stores/usersStore'
import { ChannelMessage } from '@/utils/types/channel'
import { User } from '@/utils/types/user'
import UserProfileImage from '../user/userProfileImage.vue'

const { findUserById, findUserByNickname } = useUsersStore()
const { isChannelMember } = useChannelStore()

const props = defineProps<{
  message: ChannelMessage
}>()

const timestampReadable = ref('')

const isSystemMessage = computed(() => {
  return props.message.senderId === 0
})

const allowedMentions = ['@here', '@everyone']

const processedContent = computed(() => {
  let rawContent = props.message.content
  const mentions = rawContent.match(/@\w+/g)
  if (mentions) {
    mentions.forEach((mention) => {
      const username = mention.slice(1)
      let user = findUserByNickname(username) || null
      const isAllowedMention = allowedMentions.includes(mention)

      if ((user && isChannelMember(undefined, user.id)) || isAllowedMention) {
        let flag = isAllowedMention ? mention : `@${user?.nickName}`
        rawContent = rawContent.replace(
          mention,
          `<span style="color: ${palette.mention}; background: ${palette.mentionBackground}">${flag}</span>`,
        )
      }
    })
  }

  const links = rawContent.match(/https?:\/\/[^\s]+/g)
  if (links) {
    links.forEach((link) => {
      rawContent = rawContent.replace(
        link,
        `<a href="${link}" target="_blank" style="color: ${palette.link}">${link}</a>`,
      )
    })
  }

  return rawContent
})

const userData = computed(() => {
  const user = findUserById(props.message.senderId) as User
  return user
})

const convertTimestampToReadable = () => {
  console.log('convertTimestampToReadable', props.message.timestamp)
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: 'numeric',
  })
}

onMounted(() => {
  timestampReadable.value = convertTimestampToReadable()
})

defineComponent({
  props: {
    message: {
      type: Object as () => ChannelMessage,
      required: true,
    },
  },
})
</script>
