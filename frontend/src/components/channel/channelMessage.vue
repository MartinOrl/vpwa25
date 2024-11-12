<template>
  <img
    :src="userData?.image"
    :style="{
      width: '2.25rem',
      height: '2.25rem',
      cursor: 'pointer',
      display: 'block',
      borderRadius: spacing(2),
    }"
  />
  <div
    :style="{
      width: '80%',
    }"
  >
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
      }"
    >
      <p
        :style="{
          fontWeight: 'bold',
        }"
      >
        {{ userData?.name }} {{ userData?.surname }}
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
      }"
      v-html="processedContent"
    ></p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { palette, spacing } from '@/css/theme'
import { usersTest } from '@/tmp/dummy'
import { ChannelMessage } from '@/utils/types/channel'

const props = defineProps<{
  message: ChannelMessage
}>()

const timestampReadable = ref('')

const allowedMentions = ['@here', '@everyone']

const processedContent = computed(() => {
  let rawContent = props.message.content
  const mentions = rawContent.match(/@\w+/g)
  if (mentions) {
    mentions.forEach((mention) => {
      const username = mention.slice(1)
      let user =
        usersTest.find((user) => user.nickName === username)?.nickName || null
      if (!user) {
        user = allowedMentions.includes(mention) ? mention.slice(1) : null
      }

      if (user) {
        rawContent = rawContent.replace(
          mention,
          `<span style="color: ${palette.mention}; background: ${palette.mentionBackground}">@${user}</span>`,
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
  return usersTest.find((user) => user.id === props.message.senderID)
})

const convertTimestampToReadable = () => {
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
