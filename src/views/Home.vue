<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button @click="login">Connexion</button>
    <button @click="logout">Déconnexion</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  methods: {
    login () {
      this.$router.replace('connexion')
    },
    logout () {
      this.$firebase.auth().signOut()
        .then(() => {
          this.$router.replace('connexion')
        })
    }
  }
}
</script>
