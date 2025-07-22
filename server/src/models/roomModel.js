class Room {
    constructor(id, name, status, roomType_id, price, roomTypeName, maxGuests) {
      this.id = id;
      this.name = name;
      this.status = status;
      this.roomType_id = roomType_id;
      this.roomTypeName = roomTypeName;
      this.maxGuests = maxGuests;
      this.price = price;
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        status: this.status,
        price: this.price,
        roomTypeName: this.roomTypeName, // room type name included
        roomType_id: this.roomType_id,
        maxGuests: this.maxGuests
      };
    }
  }
  
  module.exports = Room;
  