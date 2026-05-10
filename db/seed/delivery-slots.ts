export async function seedDeliverySlots(payload: any) {
  const slots = [
    { label: '10:00–11:00', startTime: '10:00', endTime: '11:00', capacity: 3, sortOrder: 1 },
    { label: '11:00–12:00', startTime: '11:00', endTime: '12:00', capacity: 3, sortOrder: 2 },
    { label: '12:00–13:00', startTime: '12:00', endTime: '13:00', capacity: 3, sortOrder: 3 },
    { label: '13:00–14:00', startTime: '13:00', endTime: '14:00', capacity: 3, sortOrder: 4 },
    { label: '14:00–15:00', startTime: '14:00', endTime: '15:00', capacity: 3, sortOrder: 5 },
    { label: '15:00–16:00', startTime: '15:00', endTime: '16:00', capacity: 3, sortOrder: 6 },
    { label: '16:00–17:00', startTime: '16:00', endTime: '17:00', capacity: 3, sortOrder: 7 },
    { label: '17:00–18:00', startTime: '17:00', endTime: '18:00', capacity: 3, sortOrder: 8 },
    { label: '18:00–19:00', startTime: '18:00', endTime: '19:00', capacity: 3, sortOrder: 9 },
    { label: '19:00–20:00', startTime: '19:00', endTime: '20:00', capacity: 3, sortOrder: 10 },
    { label: '20:00–21:00', startTime: '20:00', endTime: '21:00', capacity: 2, sortOrder: 11 },
  ];

  const allDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  for (const s of slots) {
    const existing = await payload.find({
      collection: 'delivery-slots',
      where: { label: { equals: s.label } } as any,
      limit: 1,
    });
    if (existing.docs[0]) continue;
    await payload.create({
      collection: 'delivery-slots',
      data: { ...s, daysOfWeek: allDays as any, isActive: true },
    });
  }
  console.log(`  ✓ ${slots.length} delivery slots`);
}
