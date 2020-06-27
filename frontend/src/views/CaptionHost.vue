<template>
  <div class="caption-host">
    <div>
      <div>Meeting join link: <code>{{ `${origin}/join/${meetingId}` }}</code></div>
      <div>Meeting password: <code>{{ meetingPassword }}</code></div>
    </div>
    <div v-if="!started">
      <h1>Host a session</h1>
      <div><input type="password" v-model="key" placeholder="Cognitive Services Speech API Key" /></div>
      <div>
        <input type="text" v-model="region" placeholder="Speech API region" />
        <select v-model="fromLanguage">
          <option v-for="lang in fromLanguages" :value="lang" :key="lang">
            {{ lang }}
          </option>
        </select>
        <button @click="start">start</button>
      </div>
    </div>
    <div v-else>
      <button @click="stop">stop</button>
      <div id="currentSentence" class="caption">
        {{ currentSentence }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import constants from '../lib/constants'
import Translator from '../lib/translator'
import languageListMixin from '../lib/language-list-mixin'

const speechApiKeyLocalStorageKey = 'speechApiKey'
const speechApiRegionStorageKey = 'speechApiRegion'

export default {
  mixins: [ languageListMixin ],
  data() {
    return {
      key: window.localStorage.getItem(speechApiKeyLocalStorageKey) || '',
      region: window.localStorage.getItem(speechApiRegionStorageKey) || `${constants.region}`,
      currentSentence: '',
      started: false,
      fromLanguage: 'en-US',
      meetingId: this.$route.params.meetingId,
      hostKey: this.$route.params.hostKey,
      authToken: null,
      meetingPassword: null,
      origin: null
    }
  },
  watch: {
    key(newKey) {
      window.localStorage.setItem(speechApiKeyLocalStorageKey, newKey)
    },
    region(newRegion) {
      window.localStorage.setItem(speechApiRegionStorageKey, newRegion)
    }
  },
  async created() {
    this.translator = new Translator(function(captions) {
      this.currentSentence = captions.original
      const translations = Object.assign({
        token: this.authToken
      }, captions.translations)
      axios.post(`${constants.apiBaseUrl}/api/captions?meetingId=${this.meetingId}`, translations)
    }.bind(this))

    const auth = await axios.post(`${constants.apiBaseUrl}/api/tokens/host`, {
      meetingId: this.meetingId,
      hostKey: this.hostKey
    }).then(r => r.data)

    this.authToken = auth.token
    this.meetingPassword = auth.meeting.meetingPassword
  },
  mounted() {
    this.origin = window.location.origin
  },
  methods: {
    start() {
      this.translator.start({
        key: this.key,
        region: this.region,
        fromLanguage: this.fromLanguage,
        toLanguages: this.toLanguages
      })
      console.log(this.meetingId, this.hostKey)
      this.started = true
    },
    stop() {
      this.started = false
      this.currentSentence = ''
      this.translator.stop()
    }
  },
  beforeDestroy() {
    this.translator.stop()
  }
}
</script>

<style scoped>
input[type=password] {
  width: 600px;
}
</style>