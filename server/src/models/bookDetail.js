class BookingDetail {
    constructor(id, Booking_id, Room_id, Check_in_Date, Check_out_Date) {
      this.id = id;
      this.Booking_id = Booking_id;
      this.Room_id = Room_id;
      this.Check_in_Date = Check_in_Date;
      this.Check_out_Date = Check_out_Date;
    }
  
    toJSON() {
      return {
        id: this.id,
        Booking_id: this.Booking_id,
        Room_id: this.Room_id,
        Check_in_Date: this.Check_in_Date,
        Check_out_Date: this.Check_out_Date,
      };
    }
  }
  
  module.exports = BookingDetail;
  