import { app, database, authentication } from './config.js'
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js'

let id = "";
let authSucces = false
localStorage.setItem('authSucces', authSucces)
const LoginForm = document.getElementById('loginUser')
LoginForm.addEventListener('submit', e => {
  e.preventDefault()

  const email = LoginForm.email.value
  const pass = LoginForm.password.value

  signInWithEmailAndPassword(authentication, email, pass)
    .then(userCredential => {
      authSucces = true
      localStorage.setItem('authSucces', authSucces)
      localStorage.setItem('User',email)
      id = userCredential.user.uid
      //id = user.toString;

      LoginForm.email.value = null
      LoginForm.password.value = null
      open('accounts.html', '_self')
    })
    .catch(err => {
      console.log("error", err.message)
    })
})