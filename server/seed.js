import mongoose from "mongoose";
import dotenv from "dotenv";
import Pin from "./models/Pin.js";

dotenv.config();

const PINS = [
  { image: "/src/images/img3.jpeg", title: "Cafe Praha", author: "Rawr349", likes: 1234, saves: 567, category: "food" },
  { image: "/src/images/img2.jpeg", title: "Sahyri", author: "miseries and jokes", likes: 2345, saves: 678, category: "quote" },
  { image: "/src/images/img1.jpeg", title: "Pazaib", author: "eeshie", likes: 3456, saves: 789, category: "desi" },
  { image: "/src/images/img4.jpeg", title: "Dil Wil", author: "lata", likes: 4567, saves: 890, category: "henna" },
  { image: "/src/images/img7.jpg", title: "Vibes", author: "serene", likes: 5678, saves: 901, category: "song" },
  { image: "/src/images/img5.jpg", title: "Choorian", author: "amnahere", likes: 6789, saves: 1012, category: "desi" },
  { image: "/src/images/img8.jpg", title: "Spidey", author: "Bia", likes: 7890, saves: 1123, category: "fanart" },
  { image: "/src/images/img6.jpg", title: "Ludo Khelain?", author: "Mo", likes: 8901, saves: 1234, category: "art" },
  { image: "/src/images/img9.jpg", title: "coraline", author: "yashal", likes: 9012, saves: 1345, category: "fanart" },
  { image: "/src/images/img11.jpg", title: "women's world", author: "cordelia_black", likes: 10123, saves: 1456, category: "art" },
  { image: "/src/images/img10.jpg", title: "foofforthought", author: "Jane", likes: 11234, saves: 1567, category: "quote" },
  { image: "/src/images/img12.jpg", title: "let's dance", author: "123_james", likes: 12345, saves: 1678, category: "art" },
  { image: "/src/images/img13.jpg", title: "Bogenvelia", author: "flower_girl", likes: 13456, saves: 1789, category: "phool" },
  { image: "/src/images/img14.jpg", title: "Quote", author: "existing", likes: 14567, saves: 1890, category: "quote" },
  { image: "/src/images/img15.jpg", title: "Do it Girl!", author: "Cosmic Dreams", likes: 15678, saves: 1901, category: "art" },
  { image: "/src/images/img16.jpg", title: "Singhar", author: "laiba", likes: 16789, saves: 2012, category: "desi" },
  { image: "/src/images/img17.jpg", title: "Satrangi Choorian", author: "saraSitara", likes: 17890, saves: 2123, category: "desi" },
  { image: "/src/images/img18.jpg", title: "Queen of Pop", author: "mylittlehub", likes: 18901, saves: 2234, category: "art" },
  { image: "/src/images/img19.jpg", title: "Today's Stack", author: "simpforregulus", likes: 19012, saves: 2345, category: "henna" },
  { image: "/src/images/img20.jpg", title: "Mehndi", author: "hellokainat", likes: 20123, saves: 2456, category: "henna" },
  { image: "/src/images/img21.jpeg", title: "Bag", author: "rang_sai", likes: 15678, saves: 1901, category: "desi" },
  { image: "/src/images/img22.jpeg", title: "Phuljarhian", author: "wardawho", likes: 16789, saves: 2012, category: "desi" },
  { image: "/src/images/img23.jpeg", title: "flowers", author: "artemis", likes: 17890, saves: 2123, category: "phool" },
  { image: "/src/images/img24.jpeg", title: "fountain", author: "jojo", likes: 18901, saves: 2234, category: "desi" },
  { image: "/src/images/img25.jpeg", title: "Aik cup chai", author: "nimbopani", likes: 19012, saves: 2345, category: "food" },
  { image: "/src/images/img26.jpeg", title: "lanzhou", author: "author_name", likes: 12345, saves: 2345, category: "food" },
  { image: "/src/images/img27.jpeg", title: "cake", author: "author_name", likes: 13456, saves: 3456, category: "food" },
  { image: "/src/images/img28.jpeg", title: "eid", author: "author_name", likes: 14567, saves: 4567, category: "desi" },
  { image: "/src/images/img29.jpeg", title: "bows", author: "author_name", likes: 15678, saves: 5678, category: "desi" },
  { image: "/src/images/img30.jpeg", title: "ice-cream", author: "author_name", likes: 16789, saves: 6789, category: "food" },
  { image: "/src/images/img31.jpeg", title: "endofyear", author: "author_name", likes: 17890, saves: 7890, category: "quote" },
  { image: "/src/images/img32.jpeg", title: "lemons", author: "author_name", likes: 18901, saves: 8901, category: "quote" },
  { image: "/src/images/img33.jpeg", title: "textbox", author: "author_name", likes: 19012, saves: 9012, category: "quote" },
  { image: "/src/images/img34.jpeg", title: "thouhts", author: "author_name", likes: 20123, saves: 10123, category: "quote" },
  { image: "/src/images/img35.jpeg", title: "quote", author: "author_name", likes: 21234, saves: 11234, category: "quote" },
  { image: "/src/images/img36.jpeg", title: "vase", author: "author_name", likes: 22345, saves: 12345, category: "phool" },
  { image: "/src/images/img37.jpeg", title: "bouquet", author: "author_name", likes: 23456, saves: 13456, category: "phool" },
  { image: "/src/images/img38.jpeg", title: "yellow phool", author: "author_name", likes: 24567, saves: 14567, category: "phool" },
  { image: "/src/images/img39.jpeg", title: "flower hanging", author: "author_name", likes: 25678, saves: 15678, category: "phool" },
  { image: "/src/images/img40.jpeg", title: "matilda", author: "author_name", likes: 26789, saves: 16789, category: "song" },
  { image: "/src/images/img41.jpeg", title: "mamma mia", author: "author_name", likes: 27890, saves: 17890, category: "song" },
  { image: "/src/images/img42.jpeg", title: "coffee date", author: "author_name", likes: 28901, saves: 18901, category: "food" },
  { image: "/src/images/img43.jpeg", title: "cinnamon", author: "author_name", likes: 29012, saves: 19012, category: "food" },
  { image: "/src/images/img44.jpeg", title: "henna", author: "author_name", likes: 30123, saves: 20123, category: "henna" },
  { image: "/src/images/img45.jpeg", title: "mehendi", author: "author_name", likes: 31234, saves: 21234, category: "henna" },
  { image: "/src/images/img46.jpeg", title: "calcifier", author: "author_name", likes: 27890, saves: 17890, category: "fanart" },
  { image: "/src/images/img47.jpeg", title: "ghibli", author: "author_name", likes: 28901, saves: 18901, category: "fanart" },
  { image: "/src/images/img48.jpeg", title: "ipod", author: "author_name", likes: 29012, saves: 19012, category: "music" },
  { image: "/src/images/img49.jpeg", title: "music", author: "author_name", likes: 30123, saves: 20123, category: "music" },
  { image: "/src/images/img50.jpeg", title: "percy", author: "author_name", likes: 31234, saves: 21234, category: "fanart" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing pins
    await Pin.deleteMany({});
    console.log("Cleared existing pins collection.");

    // Insert new pins
    await Pin.insertMany(PINS);
    console.log(`Successfully seeded ${PINS.length} pins!`);

    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
