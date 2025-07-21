class Customer {
  constructor(data) {
    this.name = data.name;
    this.last_name = data.last_name;
    this.gender = data.gender || null;
    this.birthday = data.birthday || null;
    this.tel = data.tel;
    this.email = data.email;
    this.address = data.address;
    this.password = data.password;
  }
}

module.exports = Customer;
