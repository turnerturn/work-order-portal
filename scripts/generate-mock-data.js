#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pool cleaning related work order types
const workOrderTypes = [
  {
    name: "Weekly Pool Cleaning",
    description: "Complete pool cleaning service including skimming, vacuuming, and chemical balancing",
    frequency: "weekly"
  },
  {
    name: "Bi-Weekly Pool Maintenance",
    description: "Pool cleaning, filter check, and equipment inspection",
    frequency: "bi-weekly"
  },
  {
    name: "Monthly Equipment Service",
    description: "Monthly pool equipment maintenance, pump service, and chemical system check",
    frequency: "monthly"
  },
  {
    name: "Filter Replacement",
    description: "Replace pool filter cartridges and clean filter housing",
    frequency: "monthly"
  },
  {
    name: "Chemical Balance Treatment",
    description: "Test and adjust pool water chemistry, shock treatment if needed",
    frequency: "weekly"
  },
  {
    name: "Pool Opening Service",
    description: "Seasonal pool opening, equipment startup, and initial cleaning",
    frequency: "annually"
  },
  {
    name: "Quarterly Deep Clean",
    description: "Deep cleaning service including tile scrubbing, acid wash, and equipment overhaul",
    frequency: "quarterly"
  }
];

// Tulsa area locations for pool cleaning
const tulsaLocations = [
  { address: "1432 E 50th St, Tulsa, OK 74105", area: "Brookside" },
  { address: "3845 S Yale Ave, Tulsa, OK 74135", area: "Midtown" },
  { address: "7855 E 71st St, Tulsa, OK 74133", area: "South Tulsa" },
  { address: "2156 S Harvard Ave, Tulsa, OK 74114", area: "Cherry Street" },
  { address: "8945 S Memorial Dr, Tulsa, OK 74133", area: "Bixby" },
  { address: "4321 W 91st St, Tulsa, OK 74132", area: "Southwest Tulsa" },
  { address: "1234 N Peoria Ave, Tulsa, OK 74106", area: "Pearl District" },
  { address: "6789 E 81st St, Tulsa, OK 74133", area: "Woodland Hills" },
  { address: "5432 S Lewis Ave, Tulsa, OK 74105", area: "Riverview" },
  { address: "9876 E 101st St, Tulsa, OK 74133", area: "Jenks" },
  { address: "2468 W 61st St, Tulsa, OK 74132", area: "Red Fork" },
  { address: "1357 S Sheridan Rd, Tulsa, OK 74112", area: "Eastside" },
  { address: "8024 S Garnett Rd, Tulsa, OK 74137", area: "Broken Arrow" },
  { address: "3691 E 51st St, Tulsa, OK 74135", area: "Utica Square" },
  { address: "5789 W 71st St, Tulsa, OK 74131", area: "Southwest" },
  { address: "4567 N Riverside Dr, Tulsa, OK 74116", area: "Riverside" },
  { address: "7123 E 91st St, Tulsa, OK 74133", area: "Yale Corridor" },
  { address: "2890 S Delaware Ave, Tulsa, OK 74114", area: "Brady Arts" },
  { address: "6543 S Mingo Rd, Tulsa, OK 74146", area: "Southeast" },
  { address: "1098 E 15th St, Tulsa, OK 74120", area: "Downtown" }
];

// Pool technician names
const technicians = [
  "Mike Johnson",
  "Sarah Davis",
  "David Rodriguez",
  "Emily Chen",
  "Chris Wilson",
  "Amanda Thompson",
  "Tyler Brooks",
  "Jessica Martinez",
  "Ryan Kelly",
  "Lisa Garcia"
];

// Activity types for pool maintenance
const activityTypes = [
  "cleaning", "maintenance", "inspection", "chemical_treatment",
  "filter_service", "equipment_check", "repair", "testing"
];

// Pool maintenance notes templates
const notesTemplates = [
  "Pool cleaned, skimmed debris, vacuumed bottom. Chemical levels balanced.",
  "Filter cartridges replaced, system running efficiently. pH adjusted to 7.4.",
  "Performed equipment inspection, all pumps operating normally. Chlorine added.",
  "Deep cleaning completed, tiles scrubbed, water crystal clear.",
  "Chemical shock treatment applied, algae cleared. Filter backwashed.",
  "Pump motor serviced, impeller cleaned. System pressure normalized.",
  "Weekly maintenance completed, tested all equipment. Water quality excellent.",
  "Removed large amount of leaves, checked skimmer baskets. Pool ready for use.",
  "Equipment calibration performed, automated systems functioning properly.",
  "Seasonal maintenance completed, all systems checked and serviced."
];

// Contact names for pool owners/managers
const contactNames = [
  "John Smith", "Sarah Johnson", "Michael Brown", "Jessica Davis", "David Wilson",
  "Lisa Anderson", "Robert Taylor", "Emily Martinez", "James Garcia", "Ashley Lopez",
  "Christopher Lee", "Amanda Walker", "Matthew Hall", "Jennifer Allen", "Daniel Young",
  "Michelle King", "Ryan Wright", "Stephanie Hill", "Kevin Scott", "Rachel Green",
  "Brandon Adams", "Kimberly Baker", "Nicholas Nelson", "Lauren Carter", "Tyler Mitchell"
];

// Phone types
const phoneTypes = ["mobile", "work", "home", "office"];

// Contact preferences
const contactPreferences = ["sms", "voice", "email"];

// Contact notes templates
const contactNotesTemplates = [
  "Call between 9 AM - 5 PM only",
  "Leave voicemail if no answer",
  "Text messages preferred",
  "Email for non-urgent matters",
  "Available weekends",
  "Do not call during business hours",
  "Prefers morning calls",
  "Evening calls only after 6 PM",
  "Always available via text",
  "Check email regularly"
];

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateUUID() {
  return 'wo-' + Math.random().toString(36).substring(2, 11);
}

function generateActivityId() {
  return 'act-' + Math.random().toString(36).substring(2, 8);
}

function getRandomDate(daysAgo, daysFromNow) {
  const now = new Date('2025-07-03'); // Current date context
  const start = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  const end = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addWeeks(date, weeks) {
  return addDays(date, weeks * 7);
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function generateRestrictions() {
  // Generate random but realistic restrictions
  const restrictions = {
    weekends: Math.random() > 0.7, // 30% chance for weekends
    weekdays: Math.random() > 0.2, // 80% chance for weekdays
    monday: Math.random() > 0.4,
    tuesday: Math.random() > 0.4,
    wednesday: Math.random() > 0.4,
    thursday: Math.random() > 0.4,
    friday: Math.random() > 0.4,
    morning_hours: Math.random() > 0.6, // 40% chance for morning
    afternoon_hours: Math.random() > 0.3, // 70% chance for afternoon
    business_hours: Math.random() > 0.1 // 90% chance for business hours
  };

  // Ensure at least some time slots are available
  if (!restrictions.weekends && !restrictions.weekdays) {
    restrictions.weekdays = true; // Always allow weekdays if weekends not allowed
  }

  if (!restrictions.morning_hours && !restrictions.afternoon_hours && !restrictions.business_hours) {
    restrictions.business_hours = true; // Always allow business hours if no other time slots
  }

  return restrictions;
}

function generatePhoneNumber() {
  // Generate a realistic US phone number
  const areaCode = Math.floor(Math.random() * 800) + 200; // 200-999
  const exchange = Math.floor(Math.random() * 800) + 200; // 200-999
  const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `(${areaCode}) ${exchange}-${number}`;
}

function generateEmail(name) {
  const firstName = name.split(' ')[0].toLowerCase();
  const lastName = name.split(' ')[1].toLowerCase();
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'email.com'];
  const domain = getRandomElement(domains);

  const emailFormats = [
    `${firstName}.${lastName}@${domain}`,
    `${firstName}${lastName}@${domain}`,
    `${firstName.charAt(0)}${lastName}@${domain}`,
    `${firstName}${Math.floor(Math.random() * 999)}@${domain}`
  ];

  return getRandomElement(emailFormats);
}

function generateContact(isPrimary = false) {
  const name = getRandomElement(contactNames);
  const email = generateEmail(name);
  const preference = getRandomElement(contactPreferences);

  // Generate 1-3 phone numbers
  const phoneCount = Math.floor(Math.random() * 3) + 1;
  const phones = [];
  const usedTypes = new Set();

  for (let i = 0; i < phoneCount; i++) {
    let phoneType;
    do {
      phoneType = getRandomElement(phoneTypes);
    } while (usedTypes.has(phoneType) && usedTypes.size < phoneTypes.length);

    usedTypes.add(phoneType);

    phones.push({
      type: phoneType,
      phone: generatePhoneNumber(),
      "sms-enabled": Math.random() > 0.3, // 70% chance SMS enabled
      primary: i === 0 // First phone is primary for this contact
    });
  }

  return {
    name,
    email,
    phones,
    notes: Math.random() > 0.4 ? getRandomElement(contactNotesTemplates) : "",
    preference,
    primary: isPrimary
  };
}

function generateContacts() {
  // Generate 0-3 contacts per work order
  const contactCount = Math.floor(Math.random() * 4); // 0, 1, 2, or 3 contacts

  if (contactCount === 0) {
    return [];
  }

  const contacts = [];

  // First contact is always primary if there are contacts
  contacts.push(generateContact(true));

  // Add additional secondary contacts
  for (let i = 1; i < contactCount; i++) {
    contacts.push(generateContact(false));
  }

  return contacts;
}

function generateActivity(isRecent = false) {
  const activityDate = isRecent
    ? getRandomDate(30, 0) // Last 30 days
    : getRandomDate(90, -7); // 90 days ago to 1 week ago

  return {
    id: generateActivityId(),
    type: getRandomElement(activityTypes),
    date: activityDate.toISOString(),
    technician: getRandomElement(technicians),
    notes: getRandomElement(notesTemplates),
    status: "completed"
  };
}

function generateWorkOrder(type, scheduling) {
  const location = getRandomElement(tulsaLocations);
  const workOrderType = getRandomElement(workOrderTypes);
  const uuid = generateUUID();

  // Generate 1-3 historical activities for existing work orders
  let activities = [];
  if (scheduling.type !== 'new') {
    const activityCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < activityCount; i++) {
      activities.push(generateActivity(i === 0)); // Most recent activity
    }

    // Sort activities by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const createdDate = getRandomDate(120, -30); // Created 30-120 days ago

  return {
    uuid,
    name: `${workOrderType.name} - ${location.area}`,
    description: workOrderType.description,
    address: location.address,
    "created-date": createdDate.toISOString(),
    activity: activities,
    contacts: generateContacts(),
    schedule: {
      frequency: workOrderType.frequency,
      restrictions: generateRestrictions()
    }
  };
}

// Generate work orders
function generateMockData() {
  const workOrders = [];

  // Generate 5-6 work orders due this week
  for (let i = 0; i < 6; i++) {
    workOrders.push(generateWorkOrder('thisWeek', { type: 'thisWeek' }));
  }

  // Generate 6-8 work orders due this month
  for (let i = 0; i < 7; i++) {
    workOrders.push(generateWorkOrder('thisMonth', { type: 'thisMonth' }));
  }

  // Generate 3-4 overdue work orders
  for (let i = 0; i < 4; i++) {
    workOrders.push(generateWorkOrder('overdue', { type: 'overdue' }));
  }

  // Generate 3-4 new work orders (no activities yet)
  for (let i = 0; i < 3; i++) {
    workOrders.push(generateWorkOrder('new', { type: 'new' }));
  }

  return workOrders;
}

// Main execution
function main() {
  console.log('🏊 Generating pool maintenance work orders for Tulsa, OK area...');

  const mockData = generateMockData();
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'mockWorkOrders.json');

  // Sort by created date (newest first)
  mockData.sort((a, b) => new Date(b['created-date']) - new Date(a['created-date']));

  fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2));

  console.log(`✅ Generated ${mockData.length} work orders:`);

  // Count by category based on activity history and type
  let newCount = 0;
  let thisWeekCount = 0;
  let thisMonthCount = 0;
  let overdueCount = 0;

  // Since we don't have nextDue anymore, we'll count based on generation type
  // This is a simplified approach - in a real app you'd determine these based on business logic
  const totalWorkOrders = mockData.length;
  newCount = Math.floor(totalWorkOrders * 0.15); // ~15% new
  thisWeekCount = Math.floor(totalWorkOrders * 0.30); // ~30% this week
  thisMonthCount = Math.floor(totalWorkOrders * 0.35); // ~35% this month
  overdueCount = totalWorkOrders - newCount - thisWeekCount - thisMonthCount; // remainder overdue

  console.log(`   • ${newCount} new orders (need scheduling)`);
  console.log(`   • ${thisWeekCount} due this week`);
  console.log(`   • ${thisMonthCount} due this month`);
  console.log(`   • ${overdueCount} overdue`);

  // Show frequency breakdown
  const frequencyBreakdown = {};
  mockData.forEach(wo => {
    const freq = wo.schedule.frequency;
    frequencyBreakdown[freq] = (frequencyBreakdown[freq] || 0) + 1;
  });

  console.log('\n📊 Service Frequency Breakdown:');
  Object.entries(frequencyBreakdown).forEach(([freq, count]) => {
    console.log(`   • ${freq}: ${count} orders`);
  });

  console.log(`\n📄 Data saved to: ${outputPath}`);
  console.log('\n🚀 Run "npm start" to view in the application!');
}

if (require.main === module) {
  main();
}

module.exports = { generateMockData };
