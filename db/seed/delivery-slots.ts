export async function seedDeliverySlots(payload: any) {
  const slots = [
    { label: '10:00–12:00', startTime: '10:00', endTime: '12:00', capacity: 5, sortOrder: 1 },
    { label: '12:00–14:00', startTime: '12:00', endTime: '14:00', capacity: 5, sortOrder: 2 },
    { label: '14:00–16:00', startTime: '14:00', endTime: '16:00', capacity: 5, sortOrder: 3 },
    { label: '16:00–18:00', startTime: '16:00', endTime: '18:00', capacity: 5, sortOrder: 4 },
    { label: '18:00–20:00', startTime: '18:00', endTime: '20:00', capacity: 5, sortOrder: 5 },
    { label: '20:00–21:00', startTime: '20:00', endTime: '21:00', capacity: 3, sortOrder: 6 },
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
