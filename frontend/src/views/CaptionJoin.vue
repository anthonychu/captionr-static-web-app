<template>
  <div class="caption-join">
    <div v-if="!joined">
      <div><input type="password" v-model="meetingPassword" placeholder="Meeting Password" /></div>
      <button @click="join">Join</button>
    </div>
    <div v-else>
      <div id="language-select">
        <select v-model="toLanguageCode">
          <option v-for="lang in toLanguageCodes" :value="lang" :key="lang">
            {{ lang }}
          </option>
        </select>
      </div>
      <div id="captions-text" class="caption">
        <div v-for="caption in captions" :key="caption.offset">{{ caption.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import constants from '../lib/constants'
import * as signalR from '@microsoft/signalr'
import languageListMixin from '../lib/language-list-mixin'

export default {
  mixins: [ languageListMixin ],
  props: {
    clientId: String
  },
  data() {
    return {
      code: '',
      captions: [],
      captionsMap: {},
      toLanguageCode: 'en',
      meetingId: null,
      meetingPassword: null,
      joined: false
    }
  },
  computed: {
    toLanguageCodes() {
      return this.toLanguages.map(l => l.substring(0, 2)).sort()
    }
  },
  methods: {
    async join() {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${constants.apiBaseUrl}/api/${this.clientId}/${this.meetingId}/${this.meetingPassword}`)
        .withAutomaticReconnect()
        .build()

      this.connection.on('newCaption', onNewCaption.bind(this))

      try {
        await this.connection.start()
      } catch (e) {
        alert('Connection failed. Verify the meeting id and password and try again.')
      }

      console.log('connection started')
      this.joined = true
      await this.updateLanguageSubscription(this.toLanguageCode)

      function onNewCaption(caption) {
        let localCaption = this.captionsMap[caption.offset]
        if (!localCaption) {
          localCaption = this.captionsMap[caption.offset] = {
            offset: caption.offset,
            text: ''
          }
          this.captions.push(localCaption)
        }
        localCaption.text = caption.text

        Vue.nextTick(function() {
          window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
        })
      }
    },
    async updateLanguageSubscription(languageCode) {        
      await axios.post(`${constants.apiBaseUrl}/api/selectlanguage?meetingId=${this.meetingId}`, {
        languageCode,
        userId: this.clientId
      })
    }
  },
  watch: {
    toLanguageCode: {
      handler() {
        return this.updateLanguageSubscription(this.toLanguageCode)
      },
      immediate: true
    }
  },
  mounted() {
    this.meetingId = this.$route.params.meetingId
  },
  async beforeDestroy() {
    if (this.connection) {
      await Promise.all([
        this.connection.stop(),
        this.updateLanguageSubscription(null)
      ])
      console.log('connection stopped')
    }
  }
}
</script>

<style scoped>
#language-select {
  position: fixed;
  top: 0;
  width: 100%;
  padding-top: 120px;
  padding-bottom: 6px;
  background-color: white;
}

#captions-text {
  padding-top: 140px;
  padding-bottom: 60px
}
</style>
