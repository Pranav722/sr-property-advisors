import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/Project.js';
import Location from '../models/Location.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const buildSlug = async (title, locationName) => {
  const base = slugify(`${title}${locationName ? '-' + locationName : ''}`);
  let candidate = base;
  let counter = 1;
  while (await Project.exists({ slug: candidate })) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
};

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/realestate');
    console.log('MongoDB connected.');

    const projects = await Project.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    console.log(`Found ${projects.length} projects without a slug.`);

    for (let p of projects) {
        let locName = '';
        try {
            if (p.location) {
                const loc = await Location.findById(p.location);
                if (loc) locName = loc.name;
            }
        } catch(e) {}
        
        const slug = await buildSlug(p.title, locName);
        p.slug = slug;
        await p.save();
        console.log(`Updated project "${p.title}" -> slug: ${slug}`);
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
