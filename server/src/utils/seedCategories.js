
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const connectDB = require('../config/db');

const categories = [
  {
    name: 'Programming & Tech',
    icon: 'FaCode',
    description: 'Get your technical projects done by expert developers',
    order: 1,
    subcategories: [
      'Web Development',
      'Mobile App Development',
      'Desktop Applications',
      'APIs & Integration',
      'Database Design',
      'DevOps & Cloud',
      'AI & Machine Learning',
      'Game Development'
    ]
  },
  {
    name: 'Graphics & Design',
    icon: 'FaPaintBrush',
    description: 'Get stunning designs for your brand and business',
    order: 2,
    subcategories: [
      'Logo Design',
      'Brand Style Guides',
      'Business Cards',
      'Illustration',
      'Web & App Design',
      'Social Media Design',
      'Packaging Design',
      'Flyer Design'
    ]
  },
  {
    name: 'Digital Marketing',
    icon: 'FaBullhorn',
    description: 'Grow your business with expert marketing strategies',
    order: 3,
    subcategories: [
      'Social Media Marketing',
      'SEO',
      'Content Marketing',
      'Email Marketing',
      'PPC Advertising',
      'Influencer Marketing',
      'Video Marketing',
      'Analytics & Strategy'
    ]
  },
  {
    name: 'Writing & Translation',
    icon: 'FaPen',
    description: 'Get quality content written by professional writers',
    order: 4,
    subcategories: [
      'Content Writing',
      'Copywriting',
      'Translation',
      'Technical Writing',
      'Creative Writing',
      'Resume Writing',
      'Proofreading & Editing',
      'Blog Writing'
    ]
  },
  {
    name: 'Video & Animation',
    icon: 'FaVideo',
    description: 'Bring your stories to life with video and animation',
    order: 5,
    subcategories: [
      'Video Editing',
      'Animation',
      'Motion Graphics',
      'Explainer Videos',
      'Whiteboard Animation',
      'Video Production',
      'Subtitles & Captions',
      'Visual Effects'
    ]
  },
  {
    name: 'Music & Audio',
    icon: 'FaMusic',
    description: 'Professional audio services for any project',
    order: 6,
    subcategories: [
      'Voice Over',
      'Music Production',
      'Podcast Editing',
      'Audio Editing',
      'Sound Design',
      'Mixing & Mastering',
      'Jingles & Intros',
      'Audiobook Production'
    ]
  }
];

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    for (const cat of categories) {
      const parent = await Category.create({
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        order: cat.order,
        parent: null
      });
      console.log(`✅ Created: ${cat.name}`);


      for (const subName of cat.subcategories) {
        await Category.create({
          name: subName,
          parent: parent._id,
          order: cat.subcategories.indexOf(subName)
        });
      }
      console.log(`   └── ${cat.subcategories.length} subcategories created`);
    }

    console.log('\n🎉 Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedCategories();