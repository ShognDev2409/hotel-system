class Room {
    constructor(id, name, status, roomType_id, price, roomTypeName) {
      this.id = id;
      this.name = name;
      this.status = status;
      this.roomType_id = roomType_id;
      this.price = price;
      this.roomTypeName = roomTypeName;
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        status: this.status,
        price: this.price,
        roomTypeName: this.roomTypeName, // room type name included
        roomType_id: this.roomType_id,
      };
    }
  }
  
  module.exports = Room;
  