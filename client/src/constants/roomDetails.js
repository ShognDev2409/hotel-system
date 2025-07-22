// constants/roomDetails.js
import doubleImg from '@/assets/image/double.jpg'
import familyImg from '@/assets/image/family.jpg'
import roomviewImg from '@/assets/image/roomview.jpg'
import tripleImg from '@/assets/image/roomview.jpg'

export const roomDetails = {
  "Double Room": {
    description:
      "A comfortable and warm room, perfect for relaxing after a full day of exploring the city. It features a large double bed and all the essential amenities for a perfect stay.",
    image: doubleImg,
  },
  "Twin Room": {
    description:
      "Designed for convenience for travel companions or colleagues, this room features two comfortable single beds, a workspace, and all modern amenities.",
    image: familyImg,
  },
  "Double Room (Thatluang view)": {
    description:
      "Elevate your stay with a stunning view of Pha That Luang, the magnificent national symbol of Laos. This room combines the comfort of our Double Room with an unparalleled and impressive backdrop.",
    image: roomviewImg,
  },
  "Triple Room": {
    description:
      "Our spacious Triple Room is perfectly suited for small families or groups of friends. It offers extra space and a comfortable bedding arrangement to easily accommodate three guests.",
    image: tripleImg,
  }
};
