class User {
  constructor({ id, name, email, password, role = 'user', created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}

module.exports = User;
