class Keychain {
  constructor(domain) {
    this.DOMAIN = domain.toLowerCase();
  }
  get(key) {
    return $keychain.get(key, this.DOMAIN);
  }
  set(key, value) {
    return $keychain.set(key, value, this.DOMAIN);
  }
  getValue(key) {
    return $keychain.get(key, this.DOMAIN);
  }
  setValue(key, value) {
    return $keychain.set(key, value, this.DOMAIN);
  }
  getAll() {
    const keys = this.getKeyList(),
      result = {};
    keys.map(key => {
      result[key] = $keychain.get(key, this.DOMAIN);
    });
    return result;
  }
  getKeyList() {
    return $keychain.keys(this.DOMAIN);
  }
  remove(key) {
    return $keychain.remove(key, this.DOMAIN);
  }
  moveItem(oldKey, newKey) {
    const oldValue = this.getValue(oldKey);
    this.setValue(newKey, oldValue);
    this.remove(oldKey);
  }
  moveToNewDomain(newDomain) {
    const oldList = this.getAll();
    Object.keys().map(key => {
      $keychain.set(key, oldList[key], newDomain);
      this.remove(key);
    });
  }
}
module.exports = {
  Keychain
};
