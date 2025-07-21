class Detail {
    constructor(id, details, room_image, Room_id) {
      this.id = id;
      this.details = details;
      this.room_image = room_image;
      this.Room_id = Room_id;
    }
  
    toJSON() {
      return {
        id: this.id,
        details: this.details,
        room_image: this.room_image,
        Room_id: this.Room_id,
      };
    }
  }
  
  module.exports = Detail;
  