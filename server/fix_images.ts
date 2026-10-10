import { connectDatabase, disconnectDatabase } from './src/config/database.js';
import { Service, Gallery } from './src/models/index.js';

async function fix() {
  await connectDatabase();
  console.log('Connected');

  const services = await Service.find({});
  let sCount = 0;
  for (const s of services) {
    if (s.image && s.image.includes('unsplash')) {
      s.image = '';
      await s.save();
      sCount++;
    }
  }
  console.log(`Cleared image for ${sCount} services.`);

  const galleryItems = await Gallery.find({});
  let gCount = 0;
  for (const g of galleryItems) {
    if (g.image && g.image.includes('unsplash')) {
      await Gallery.deleteOne({ _id: g._id });
      gCount++;
    }
  }
  console.log(`Deleted ${gCount} unsplash gallery items.`);

  await disconnectDatabase();
}

fix().catch(console.error);
