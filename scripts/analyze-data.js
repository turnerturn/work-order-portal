#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the mock data
const dataPath = path.join(__dirname, '..', 'src', 'data', 'mockWorkOrders.json');
const workOrders = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Current date context
const now = new Date('2025-07-03');
const thisWeekStart = new Date('2025-06-30'); // Monday
const thisWeekEnd = new Date('2025-07-06'); // Sunday
const thisMonthStart = new Date('2025-07-01');
const thisMonthEnd = new Date('2025-07-31');

// Categorize work orders
let newCount = 0;
let thisWeekCount = 0;
let thisMonthCount = 0;
let overdueCount = 0;
let futureCount = 0;

const categories = {
  new: [],
  thisWeek: [],
  thisMonth: [],
  overdue: [],
  future: []
};

workOrders.forEach(wo => {
  if (!wo.activity || wo.activity.length === 0) {
    newCount++;
    categories.new.push(wo);
  } else {
    // For demo purposes, categorize based on frequency and activity count
    // In a real app, you'd have actual due dates to work with
    const hasRecentActivity = wo.activity.some(activity => {
      const activityDate = new Date(activity.date);
      const daysSinceActivity = (now - activityDate) / (1000 * 60 * 60 * 24);
      return daysSinceActivity < 7; // Activity in last week
    });

    if (hasRecentActivity) {
      thisWeekCount++;
      categories.thisWeek.push(wo);
    } else if (wo.schedule.frequency === 'weekly') {
      overdueCount++;
      categories.overdue.push(wo);
    } else {
      thisMonthCount++;
      categories.thisMonth.push(wo);
    }
  }
});

console.log('🏊 Pool Maintenance Work Orders Summary');
console.log('=====================================');
console.log(`Total Work Orders: ${workOrders.length}\n`);

console.log(`📋 New Orders (${newCount}):`);
categories.new.forEach(wo => {
  console.log(`   • ${wo.name} - ${wo.address.split(',')[0]}`);
});

console.log(`\n⏰ Due This Week (${thisWeekCount}):`);
categories.thisWeek.forEach(wo => {
  console.log(`   • ${wo.name} - Recent activity`);
});

console.log(`\n📅 Due This Month (${thisMonthCount}):`);
categories.thisMonth.forEach(wo => {
  console.log(`   • ${wo.name} - Based on frequency: ${wo.schedule.frequency}`);
});

console.log(`\n🚨 Overdue (${overdueCount}):`);
categories.overdue.forEach(wo => {
  console.log(`   • ${wo.name} - Weekly service needs attention`);
});

if (futureCount > 0) {
  console.log(`\n🔮 Future (${futureCount}):`);
  categories.future.forEach(wo => {
    console.log(`   • ${wo.name} - Future scheduling`);
  });
}

// Show restrictions breakdown
const restrictionsBreakdown = {
  weekends: 0,
  weekdays: 0,
  business_hours: 0,
  morning_hours: 0,
  afternoon_hours: 0,
  specificDays: 0
};

workOrders.forEach(wo => {
  const restrictions = wo.schedule.restrictions;
  if (restrictions.weekends) restrictionsBreakdown.weekends++;
  if (restrictions.weekdays) restrictionsBreakdown.weekdays++;
  if (restrictions.business_hours) restrictionsBreakdown.business_hours++;
  if (restrictions.morning_hours) restrictionsBreakdown.morning_hours++;
  if (restrictions.afternoon_hours) restrictionsBreakdown.afternoon_hours++;
  if (restrictions.monday || restrictions.tuesday || restrictions.wednesday ||
      restrictions.thursday || restrictions.friday) restrictionsBreakdown.specificDays++;
});

console.log('\n⏰ Scheduling Restrictions Breakdown:');
Object.entries(restrictionsBreakdown).forEach(([restriction, count]) => {
  console.log(`   • ${restriction.replace('_', ' ')}: ${count} orders`);
});

// Show frequency breakdown
const frequencyBreakdown = {};
workOrders.forEach(wo => {
  const freq = wo.schedule.frequency;
  frequencyBreakdown[freq] = (frequencyBreakdown[freq] || 0) + 1;
});

console.log('\n📊 Service Frequency Breakdown:');
Object.entries(frequencyBreakdown).forEach(([freq, count]) => {
  console.log(`   • ${freq}: ${count} orders`);
});

// Show location breakdown
const locationBreakdown = {};
workOrders.forEach(wo => {
  const area = wo.name.split(' - ')[1] || 'Unknown';
  locationBreakdown[area] = (locationBreakdown[area] || 0) + 1;
});

console.log('\n🗺️  Service Area Breakdown:');
Object.entries(locationBreakdown)
  .sort((a, b) => b[1] - a[1])
  .forEach(([area, count]) => {
    console.log(`   • ${area}: ${count} orders`);
  });
