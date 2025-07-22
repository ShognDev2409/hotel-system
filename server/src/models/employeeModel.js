class Employee {
  constructor(data) {
    this.e_id = data.e_id;
    this.name = data.name;
    this.last_name = data.last_name;
    this.gender = data.gender;
    this.birthday = data.birthday;
    this.tel = data.tel;
    this.idcard = data.idcard;
    this.District_id = data.District_id;
    this.Province_ = data.Province_;
    this.village_id = data.village_id;
    this.role = data.role;
    this.password = data.password
  }
}

module.exports = Employee;
