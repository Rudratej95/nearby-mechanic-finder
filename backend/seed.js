/**
 * seed.js — Populates MongoDB with sample mechanic data.
 * Usage: node seed.js
 *
 * Uses coordinates around New Delhi, India as default location.
 * Change coordinates to match your area.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Mechanic = require('./models/Mechanic');

const sampleMechanics = [
  {
    name: 'Rajesh Kumar Auto Works',
    phone: '+91-98765-43210',
    email: 'rajesh@autoworks.com',
    profileImage: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0D8ABC&color=fff&size=200',
    experience: 12,
    rating: 4.8,
    availability: 'available',
    services: ['Engine Repair', 'Oil Change', 'Brake Service', 'AC Repair', 'Battery Replacement'],
    specialization: 'Engine Specialist',
    address: '45, Karol Bagh, New Delhi',
    location: { type: 'Point', coordinates: [77.1900, 28.6519] },
    reviews: [
      { userName: 'Amit S.', rating: 5, comment: 'Excellent engine work! Fixed my car in 2 hours.' },
      { userName: 'Priya M.', rating: 5, comment: 'Very professional and honest pricing.' },
      { userName: 'Vikram R.', rating: 4, comment: 'Good service, slightly delayed.' }
    ]
  },
  {
    name: 'Sharma Tyre & Wheel Center',
    phone: '+91-98765-12345',
    email: 'sharma.tyres@email.com',
    profileImage: 'https://ui-avatars.com/api/?name=Sharma+Tyres&background=E74C3C&color=fff&size=200',
    experience: 8,
    rating: 4.5,
    availability: 'available',
    services: ['Tyre Replacement', 'Wheel Alignment', 'Wheel Balancing', 'Puncture Repair'],
    specialization: 'Tyre Specialist',
    address: '12, Connaught Place, New Delhi',
    location: { type: 'Point', coordinates: [77.2195, 28.6315] },
    reviews: [
      { userName: 'Suresh K.', rating: 5, comment: 'Best tyre shop in the area!' },
      { userName: 'Neha T.', rating: 4, comment: 'Quick puncture repair.' }
    ]
  },
  {
    name: 'Quick Fix Garage',
    phone: '+91-91234-56789',
    email: 'quickfix@garage.com',
    profileImage: 'https://ui-avatars.com/api/?name=Quick+Fix&background=2ECC71&color=fff&size=200',
    experience: 15,
    rating: 4.9,
    availability: 'available',
    services: ['Full Service', 'Engine Repair', 'Transmission', 'Electrical', 'Diagnostics'],
    specialization: 'Full-Service Garage',
    address: '78, Lajpat Nagar, New Delhi',
    location: { type: 'Point', coordinates: [77.2373, 28.5700] },
    reviews: [
      { userName: 'Rahul D.', rating: 5, comment: 'The best garage in Delhi. Period.' },
      { userName: 'Sneha P.', rating: 5, comment: 'Diagnosed my car issue in minutes!' },
      { userName: 'Mohit G.', rating: 5, comment: 'Fair pricing and expert service.' }
    ]
  },
  {
    name: 'AutoCare Express',
    phone: '+91-99887-76655',
    email: 'autocare@express.com',
    profileImage: 'https://ui-avatars.com/api/?name=AutoCare+Express&background=9B59B6&color=fff&size=200',
    experience: 6,
    rating: 4.2,
    availability: 'busy',
    services: ['Oil Change', 'Filter Replacement', 'Brake Pads', 'Car Wash'],
    specialization: 'Quick Service',
    address: '23, Saket, New Delhi',
    location: { type: 'Point', coordinates: [77.2167, 28.5245] },
    reviews: [
      { userName: 'Karan J.', rating: 4, comment: 'Fast oil change service.' },
      { userName: 'Ritu S.', rating: 4, comment: 'Good quality work.' }
    ]
  },
  {
    name: 'Delhi Denting & Painting',
    phone: '+91-98111-22233',
    email: 'delhident@paint.com',
    profileImage: 'https://ui-avatars.com/api/?name=Delhi+Denting&background=F39C12&color=fff&size=200',
    experience: 20,
    rating: 4.7,
    availability: 'available',
    services: ['Denting', 'Painting', 'Scratch Removal', 'Full Body Repaint', 'Ceramic Coating'],
    specialization: 'Body Work & Painting',
    address: '56, Dwarka Sector 12, New Delhi',
    location: { type: 'Point', coordinates: [77.0369, 28.5921] },
    reviews: [
      { userName: 'Arjun M.', rating: 5, comment: 'My car looks brand new after painting!' },
      { userName: 'Divya R.', rating: 5, comment: 'Best denting work in Delhi.' },
      { userName: 'Sanjay K.', rating: 4, comment: 'Slightly expensive but quality work.' }
    ]
  },
  {
    name: 'Royal Mechanics',
    phone: '+91-97777-88899',
    email: 'royal@mechanics.com',
    profileImage: 'https://ui-avatars.com/api/?name=Royal+Mechanics&background=1ABC9C&color=fff&size=200',
    experience: 10,
    rating: 4.4,
    availability: 'available',
    services: ['Suspension Repair', 'Clutch Repair', 'Gear Box', 'Engine Overhaul'],
    specialization: 'Suspension & Clutch',
    address: '89, Rohini Sector 7, New Delhi',
    location: { type: 'Point', coordinates: [77.1146, 28.7151] },
    reviews: [
      { userName: 'Pankaj B.', rating: 5, comment: 'Fixed my suspension perfectly!' },
      { userName: 'Meera S.', rating: 4, comment: 'Reliable mechanics.' }
    ]
  },
  {
    name: 'EV Power Hub',
    phone: '+91-96666-55544',
    email: 'evpower@hub.com',
    profileImage: 'https://ui-avatars.com/api/?name=EV+Power&background=3498DB&color=fff&size=200',
    experience: 4,
    rating: 4.6,
    availability: 'available',
    services: ['EV Battery Service', 'Electric Motor Repair', 'Charging Port Fix', 'Software Update'],
    specialization: 'Electric Vehicle Specialist',
    address: '34, Vasant Kunj, New Delhi',
    location: { type: 'Point', coordinates: [77.1590, 28.5206] },
    reviews: [
      { userName: 'Aakash P.', rating: 5, comment: 'Finally a good EV mechanic in Delhi!' },
      { userName: 'Pooja L.', rating: 4, comment: 'Knowledgeable about EV systems.' }
    ]
  },
  {
    name: 'Highway Auto Rescue',
    phone: '+91-95555-44433',
    email: 'highway@rescue.com',
    profileImage: 'https://ui-avatars.com/api/?name=Highway+Rescue&background=E67E22&color=fff&size=200',
    experience: 9,
    rating: 4.3,
    availability: 'available',
    services: ['Roadside Assistance', 'Towing', 'Jump Start', 'Flat Tyre Fix', 'Fuel Delivery'],
    specialization: 'Roadside Assistance',
    address: '101, GT Karnal Road, New Delhi',
    location: { type: 'Point', coordinates: [77.1855, 28.7340] },
    reviews: [
      { userName: 'Tarun V.', rating: 5, comment: 'Saved me on the highway at midnight!' },
      { userName: 'Anita G.', rating: 4, comment: 'Quick response to my breakdown call.' }
    ]
  },
  {
    name: 'Precision Auto Electricals',
    phone: '+91-94444-33322',
    email: 'precision@auto.com',
    profileImage: 'https://ui-avatars.com/api/?name=Precision+Auto&background=8E44AD&color=fff&size=200',
    experience: 14,
    rating: 4.5,
    availability: 'busy',
    services: ['Electrical Wiring', 'Alternator Repair', 'Starter Motor', 'Light & Horn Fix', 'ECU Repair'],
    specialization: 'Auto Electrician',
    address: '67, Janakpuri, New Delhi',
    location: { type: 'Point', coordinates: [77.0876, 28.6219] },
    reviews: [
      { userName: 'Nikhil H.', rating: 5, comment: 'Expert electrician, fixed complex wiring issue.' },
      { userName: 'Swati M.', rating: 4, comment: 'Good service for starter motor.' }
    ]
  },
  {
    name: 'Turbo AC & Cooling',
    phone: '+91-93333-22211',
    email: 'turbocool@ac.com',
    profileImage: 'https://ui-avatars.com/api/?name=Turbo+AC&background=16A085&color=fff&size=200',
    experience: 7,
    rating: 4.1,
    availability: 'offline',
    services: ['AC Gas Refill', 'Compressor Repair', 'Cooling System', 'Radiator Flush', 'Heater Repair'],
    specialization: 'AC & Cooling System',
    address: '22, Pitampura, New Delhi',
    location: { type: 'Point', coordinates: [77.1340, 28.6980] },
    reviews: [
      { userName: 'Deepak S.', rating: 4, comment: 'AC works great now after servicing.' },
      { userName: 'Kavita R.', rating: 4, comment: 'Reasonable pricing for AC gas refill.' }
    ]
  },
  {
    name: 'Star Bike Repairs',
    phone: '+91-92222-11100',
    email: 'starbike@repairs.com',
    profileImage: 'https://ui-avatars.com/api/?name=Star+Bike&background=D35400&color=fff&size=200',
    experience: 11,
    rating: 4.6,
    availability: 'available',
    services: ['Bike Engine Repair', 'Chain & Sprocket', 'Bike Servicing', 'Custom Modifications'],
    specialization: 'Two-Wheeler Specialist',
    address: '44, Chandni Chowk, New Delhi',
    location: { type: 'Point', coordinates: [77.2307, 28.6562] },
    reviews: [
      { userName: 'Rohan P.', rating: 5, comment: 'Best bike mechanic in Old Delhi!' },
      { userName: 'Simran K.', rating: 5, comment: 'Excellent Bullet repair work.' },
      { userName: 'Manish T.', rating: 4, comment: 'Good custom modification options.' }
    ]
  },
  {
    name: 'GreenTech Auto Solutions',
    phone: '+91-91111-00099',
    email: 'greentech@auto.com',
    profileImage: 'https://ui-avatars.com/api/?name=GreenTech+Auto&background=27AE60&color=fff&size=200',
    experience: 5,
    rating: 4.3,
    availability: 'available',
    services: ['CNG Kit Installation', 'Emission Testing', 'Catalytic Converter', 'Eco Tuning'],
    specialization: 'Green & CNG Specialist',
    address: '90, Nehru Place, New Delhi',
    location: { type: 'Point', coordinates: [77.2509, 28.5491] },
    reviews: [
      { userName: 'Rajat B.', rating: 4, comment: 'Good CNG kit installation.' },
      { userName: 'Nisha F.', rating: 5, comment: 'Passed emission test easily after their service!' }
    ]
  },

  // ─── Mumbai Mechanics ──────────────────────────────────
  {
    name: 'Mumbai Motor Works',
    phone: '+91-98200-11122',
    email: 'mumbaimotor@works.com',
    profileImage: 'https://ui-avatars.com/api/?name=Mumbai+Motor&background=E74C3C&color=fff&size=200',
    experience: 18,
    rating: 4.7,
    availability: 'available',
    services: ['Engine Repair', 'Transmission', 'Brake Service', 'AC Repair', 'Full Servicing'],
    specialization: 'Full-Service Garage',
    address: 'Andheri West, Mumbai',
    location: { type: 'Point', coordinates: [72.8361, 19.1368] },
    reviews: [
      { userName: 'Sachin T.', rating: 5, comment: 'Best garage in Andheri!' },
      { userName: 'Pooja K.', rating: 4, comment: 'Professional and quick service.' }
    ]
  },
  {
    name: 'Bandra Auto Care',
    phone: '+91-98200-33344',
    email: 'bandra@autocare.com',
    profileImage: 'https://ui-avatars.com/api/?name=Bandra+Auto&background=3498DB&color=fff&size=200',
    experience: 10,
    rating: 4.5,
    availability: 'available',
    services: ['Oil Change', 'Tyre Replacement', 'Battery Service', 'Wheel Alignment'],
    specialization: 'Quick Service Center',
    address: 'Bandra East, Mumbai',
    location: { type: 'Point', coordinates: [72.8505, 19.0596] },
    reviews: [
      { userName: 'Aman R.', rating: 5, comment: 'Super fast oil change!' },
      { userName: 'Meena D.', rating: 4, comment: 'Good location, decent pricing.' }
    ]
  },
  {
    name: 'Western Express Garage',
    phone: '+91-98200-55566',
    email: 'western@express.com',
    profileImage: 'https://ui-avatars.com/api/?name=Western+Express&background=9B59B6&color=fff&size=200',
    experience: 13,
    rating: 4.8,
    availability: 'available',
    services: ['Denting', 'Painting', 'Engine Overhaul', 'Suspension', 'Electrical'],
    specialization: 'Body Work & Engine',
    address: 'Goregaon East, Mumbai',
    location: { type: 'Point', coordinates: [72.8628, 19.1550] },
    reviews: [
      { userName: 'Vishal M.', rating: 5, comment: 'Amazing denting and painting work!' },
      { userName: 'Rekha S.', rating: 5, comment: 'Made my old car look new.' }
    ]
  },
  {
    name: 'Dadar Bike Point',
    phone: '+91-98200-77788',
    email: 'dadar@bikepoint.com',
    profileImage: 'https://ui-avatars.com/api/?name=Dadar+Bike&background=E67E22&color=fff&size=200',
    experience: 8,
    rating: 4.4,
    availability: 'busy',
    services: ['Bike Servicing', 'Engine Repair', 'Custom Modifications', 'Chain & Sprocket'],
    specialization: 'Two-Wheeler Specialist',
    address: 'Dadar West, Mumbai',
    location: { type: 'Point', coordinates: [72.8432, 19.0178] },
    reviews: [
      { userName: 'Jay P.', rating: 5, comment: 'Best for Royal Enfield servicing!' },
      { userName: 'Komal V.', rating: 4, comment: 'Reasonable rates for bike repair.' }
    ]
  },

  // ─── Bangalore Mechanics ───────────────────────────────
  {
    name: 'Koramangala Auto Hub',
    phone: '+91-99001-22233',
    email: 'koramangala@autohub.com',
    profileImage: 'https://ui-avatars.com/api/?name=Koramangala+Auto&background=2ECC71&color=fff&size=200',
    experience: 11,
    rating: 4.6,
    availability: 'available',
    services: ['Full Service', 'Engine Repair', 'AC Repair', 'Diagnostics', 'Oil Change'],
    specialization: 'Multi-Brand Service Center',
    address: 'Koramangala 5th Block, Bangalore',
    location: { type: 'Point', coordinates: [77.6166, 12.9352] },
    reviews: [
      { userName: 'Arun K.', rating: 5, comment: 'Excellent service center in Koramangala!' },
      { userName: 'Shruti N.', rating: 4, comment: 'Good diagnostics, found the issue quickly.' }
    ]
  },
  {
    name: 'Indiranagar Quick Fix',
    phone: '+91-99001-44455',
    email: 'indira@quickfix.com',
    profileImage: 'https://ui-avatars.com/api/?name=Indiranagar+Fix&background=1ABC9C&color=fff&size=200',
    experience: 7,
    rating: 4.3,
    availability: 'available',
    services: ['Brake Pads', 'Clutch Repair', 'Suspension', 'Wheel Balancing', 'Car Wash'],
    specialization: 'Brake & Clutch Expert',
    address: '100 Feet Road, Indiranagar, Bangalore',
    location: { type: 'Point', coordinates: [77.6408, 12.9784] },
    reviews: [
      { userName: 'Ravi T.', rating: 4, comment: 'Fixed my brake issue quickly.' },
      { userName: 'Deepa M.', rating: 5, comment: 'Honest pricing and good work.' }
    ]
  },
  {
    name: 'Whitefield EV Experts',
    phone: '+91-99001-66677',
    email: 'whitefield@ev.com',
    profileImage: 'https://ui-avatars.com/api/?name=Whitefield+EV&background=3498DB&color=fff&size=200',
    experience: 3,
    rating: 4.5,
    availability: 'available',
    services: ['EV Battery Service', 'Electric Motor', 'Software Update', 'Charging Station Install'],
    specialization: 'Electric Vehicle Specialist',
    address: 'Whitefield Main Road, Bangalore',
    location: { type: 'Point', coordinates: [77.7510, 12.9698] },
    reviews: [
      { userName: 'Karthik S.', rating: 5, comment: 'Great EV specialist in Whitefield!' },
      { userName: 'Ananya R.', rating: 4, comment: 'Knows Tesla and Tata EV systems well.' }
    ]
  },
  {
    name: 'JP Nagar Tyre House',
    phone: '+91-99001-88899',
    email: 'jpnagar@tyres.com',
    profileImage: 'https://ui-avatars.com/api/?name=JP+Nagar+Tyre&background=F39C12&color=fff&size=200',
    experience: 15,
    rating: 4.7,
    availability: 'available',
    services: ['Tyre Replacement', 'Wheel Alignment', 'Puncture Repair', 'Alloy Wheel Fix'],
    specialization: 'Tyre & Wheel Expert',
    address: 'JP Nagar 2nd Phase, Bangalore',
    location: { type: 'Point', coordinates: [77.5850, 12.9063] },
    reviews: [
      { userName: 'Manoj V.', rating: 5, comment: 'Best tyre shop in JP Nagar!' },
      { userName: 'Latha G.', rating: 5, comment: 'Quick and affordable wheel alignment.' }
    ]
  }
];

const seedDB = async () => {
  await connectDB();

  // Clear existing data
  await Mechanic.deleteMany({});
  console.log('🗑️  Cleared existing mechanic data');

  // Insert sample data
  await Mechanic.insertMany(sampleMechanics);
  console.log(`✅ Inserted ${sampleMechanics.length} sample mechanics`);

  mongoose.connection.close();
  console.log('📦 Database seeded successfully!');
};

seedDB();
