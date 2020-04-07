class SymmetricCrypt {
  constructor(key) {
    this.key = key;
  }

  encrypt(data) {
    const cipher = crypto.createCipher('aes-256-ecb', this.key);
    let crypted= cipher.update(data, 'utf8', 'hex');
    crypted = crypted + cipher.final('hex');
    return crypted;
  }

  decrypt(crypted) {
    const decipher = crypto.createDecipher('aes-256-ecb', this.key);
    let decrypted = decipher.update(crypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

class Token {
  constructor(app_id, app_secret) {
    this.app_id = app_id;
    this.app_secret = app_secret;
    this.cryptMachine = new SymmetricCrypt('x-key' + app_secret);
    this.token = this.generate();
  }

  generate() {
    const raw_token = [this.app_id, +new Date(), 100 + parseInt(Math.random() * (999 + 1 -100), 10)].join('');
    return this.cryptMachine.encrypt(raw_token);
  }

  data() {
    return this.cryptMachine.decrypt(this.token);
  }
}


module.exports.SymmetricCrypt = SymmetricCrypt;
module.exports.Token = Token;
