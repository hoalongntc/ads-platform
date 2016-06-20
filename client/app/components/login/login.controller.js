export default class LoginCtrl {
  constructor() {
    this.credentials = {
      username: '',
      password: ''
    }
  }

  login(credentials) {
    alert(`Logged with username ${credentials.username}!`);
  }
}
