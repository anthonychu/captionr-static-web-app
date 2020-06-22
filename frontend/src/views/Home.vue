<template>
  <div class="home">
    <div class="main-option">
      <h2>Host a captioning session</h2>
      <button @click="newMeeting">Create a new meeting</button>
    </div>
    <div class="main-option">
      <h2>Join a captioning session</h2>
      <div>
        <div><input type="text" v-model="meetingId" placeholder="Meeting id" /></div>
        <div><button @click="join">Join a meeting</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import constants from '../lib/constants'
import axios from 'axios'

export default {
  name: 'home',
  data() {
    return {
      meetingId: null
    }
  },
  methods: {
    async newMeeting() {
      // TODO: need retry logic (could error out if generated a meeting that already exists)
      const meeting = await axios.post(`${constants.apiBaseUrl}/api/meetings`)
        .then(r => r.data);
      this.$router.push(`host/${meeting.meetingId}/${meeting.hostKey}`)
    },
    join() {
      this.$router.push(`join/${this.meetingId}`)
    }
  }
}
</script>

<style>
div.main-option {
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 24px;
  max-width: 740px;
  margin: 24px auto;
}

.main-option h2 {
  margin: 0px 0px 12px 0px;
}

.main-option button {
  padding: 12px;
  border-radius: 8px;
  width: 300px;
  font-size: 16px;
}

.main-option input[type=text] {
  padding: 0px;
  margin: 12px;
  border-radius: 8px;
  height: 48px;
  width: 300px;
  font-size: 28px;
  text-align: center;
}
</style>
