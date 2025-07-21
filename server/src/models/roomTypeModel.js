class RoomType {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  
    // This method shapes how the data will be sent back in the response
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        // you can add or remove fields here, e.g. hide internal props
      };
    }
  }
  
  module.exports = RoomType;