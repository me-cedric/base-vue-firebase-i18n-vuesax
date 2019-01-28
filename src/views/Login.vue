<template>
  <div class="login">
    <h3>Sign In</h3>
    <input type="text" v-model="email" :placeholder="$t('email')">
    <input type="password" v-model="password" :placeholder="$t('password')">
    <button @click="login">Connection</button>
    <p>{{ $t('login.noAccount') }} <router-link to="/inscription">{{ $t('login.createOne') }}</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.$router.replace('calendrier')
        },
        (err) => {
          alert('Failed ' + err.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  margin-top: 40px;
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
button {
  margin-top: 20px;
  width: 10%;
  cursor: pointer;
}
p {
  margin-top: 40px;
  font-size:13px;
}
p a {
  text-decoration: underline;
  cursor: pointer;
}
</style>
