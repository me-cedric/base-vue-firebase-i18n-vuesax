<template>
  <div class="home">
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  components: {},
  methods: {
    logout () {
      this.$firebase.auth().signOut()
        .then(() => {
          this.$router.replace('connexion')
        })
    }
  }
}
</script>
