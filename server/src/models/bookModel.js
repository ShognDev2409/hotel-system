class Booking {
    constructor(id, User_id, startDate, endDate, status, cus_id, payment_image) {
      this.id = id;
      this.User_id = User_id;
      this.startDate = startDate;
      this.endDate = endDate;
      this.status = status;
      this.cus_id = cus_id;
      this.payment_image = payment_image;
    }
  
    toJSON() {
      return {
        id: this.id,
        User_id: this.User_id,
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.status,
        cus_id: this.cus_id,
        payment_image: this.payment_image,
      };
    }
  }
  
  module.exports = Booking;
  