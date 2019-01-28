<template>
  <div class="signup">
    <p>Let's create an account</p>
    <input type="text" v-model="email" :placeholder="$t('email')">
    <input type="password" v-model="password" :placeholder="$t('password')">
    <button @click="signUp">Inscription</button>
    <span>{{ $t('signup.existingAccount') }} <router-link to="/connexion">{{ $t('signup.connect') }}</router-link>.</span>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signUp () {
      this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.$router.replace('calendar')
        },
        (err) => {
          alert('Failed ' + err.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.signup {
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
span {
  display: block;
  margin-top: 20px;
  font-size: 11px;
}
</style>
