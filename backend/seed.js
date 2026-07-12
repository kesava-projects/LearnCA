require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Course.deleteMany({});
  console.log('🗑️  Cleared existing courses');

  // Sample CA Final courses
  const courses = [
    {
      title: 'Financial Reporting (FR)',
      subject: 'FR',
      description: 'Comprehensive coverage of Ind AS, IFRS, and financial statement analysis for CA Final.',
      instructor: 'CA Harsha Vardhan',
      thumbnail: '',
      tags: ['CA Final', 'Accounting', 'Ind AS'],
      videos: [
        {
          title: 'Introduction to Ind AS Framework',
          description: 'Overview of the Ind AS framework and its applicability',
          fileName: 'intro_ind_as.mp4',
          filePath: 'intro_ind_as.mp4', // Place actual video in backend/uploads/
          duration: '45:00',
          order: 1,
        },
        {
          title: 'Ind AS 1 — Presentation of Financial Statements',
          description: 'Detailed study of Ind AS 1 with practical examples',
          fileName: 'ind_as_1.mp4',
          filePath: 'ind_as_1.mp4',
          duration: '1:20:00',
          order: 2,
        },
      ],
    },
    {
      title: 'Strategic Financial Management (SFM)',
      subject: 'SFM',
      description: 'Advanced financial management including derivatives, forex, and capital budgeting for CA Final.',
      instructor: 'CA Harsha Vardhan',
      thumbnail: '',
      tags: ['CA Final', 'Finance', 'Derivatives'],
      videos: [
        {
          title: 'Options & Futures — Complete Chapter',
          description: 'Comprehensive coverage of options pricing and futures contracts',
          fileName: 'options_futures.mp4',
          filePath: 'options_futures.mp4',
          duration: '2:10:00',
          order: 1,
        },
        {
          title: 'Forex Risk Management',
          description: 'Exchange rate risk hedging strategies',
          fileName: 'forex_risk.mp4',
          filePath: 'forex_risk.mp4',
          duration: '1:30:00',
          order: 2,
        },
      ],
    },
    {
      title: 'Advanced Auditing & Professional Ethics (AAPE)',
      subject: 'Audit',
      description: 'Standards on Auditing, company audit, tax audit and professional ethics.',
      instructor: 'CA Harsha Vardhan',
      thumbnail: '',
      tags: ['CA Final', 'Audit', 'Ethics'],
      videos: [
        {
          title: 'SA 315 — Risk Assessment',
          description: 'Understanding risk assessment and internal control evaluation',
          fileName: 'sa_315.mp4',
          filePath: 'sa_315.mp4',
          duration: '55:00',
          order: 1,
        },
      ],
    },
    {
      title: 'Direct Tax Laws & International Taxation (DT)',
      subject: 'Direct Tax',
      description: 'Income Tax Act, DTAA, transfer pricing, and international tax for CA Final.',
      instructor: 'CA Harsha Vardhan',
      thumbnail: '',
      tags: ['CA Final', 'Tax', 'Income Tax'],
      videos: [
        {
          title: 'Transfer Pricing — Complete Overview',
          description: 'Arm\'s length price, methods, and documentation',
          fileName: 'transfer_pricing.mp4',
          filePath: 'transfer_pricing.mp4',
          duration: '1:45:00',
          order: 1,
        },
      ],
    },
    {
      title: 'Indirect Tax Laws (IDT)',
      subject: 'GST & Customs',
      description: 'GST, customs duty, and foreign trade policy for CA Final.',
      instructor: 'CA Harsha Vardhan',
      thumbnail: '',
      tags: ['CA Final', 'GST', 'Customs'],
      videos: [
        {
          title: 'GST — Place of Supply Rules',
          description: 'Detailed analysis of place of supply provisions under CGST Act',
          fileName: 'gst_pos.mp4',
          filePath: 'gst_pos.mp4',
          duration: '1:05:00',
          order: 1,
        },
      ],
    },
    {
      title: 'Strategic Cost Management (SCM)',
      subject: 'Costing',
      description: 'Strategic cost management, decision-making and performance evaluation.',
      instructor: 'CA Harsha Vardhan',
      thumbnail: '',
      tags: ['CA Final', 'Costing', 'Management'],
      videos: [
        {
          title: 'Activity Based Costing (ABC)',
          description: 'Concept, computation, and practical problems of ABC',
          fileName: 'abc_costing.mp4',
          filePath: 'abc_costing.mp4',
          duration: '1:15:00',
          order: 1,
        },
      ],
    },
  ];

  const created = await Course.insertMany(courses);
  console.log(`✅ Seeded ${created.length} CA Final courses`);

  // Create a demo admin user
  const existingAdmin = await User.findOne({ email: 'admin@learnca.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: 'admin@learnca.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@learnca.com / Admin@123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  mongoose.connection.close();
  console.log('🎉 Seeding complete!');
};

seedData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
