export async function seedDeliveryZones(payload: any) {
  const zones = [
    {
      name: 'Ірпінь, Буча, Гостомель, Ворзель',
      slug: 'ibgv',
      areas: [
        { place: 'Ірпінь' },
        { place: 'Буча' },
        { place: 'Гостомель' },
        { place: 'Ворзель' },
      ],
      tariff: 200,
      freeFromAmount: 3000,
      timeFrom: '09:00',
      timeTo: '21:00',
      urgentAvailable: true,
      urgentSurcharge: 150,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Ближній Київ',
      slug: 'kyiv-near',
      areas: [
        { place: 'Святошинський р-н' },
        { place: 'Поділ-захід' },
        { place: 'Академмістечко' },
        { place: 'Беличі' },
      ],
      tariff: 350,
      freeFromAmount: 5000,
      timeFrom: '10:00',
      timeTo: '20:00',
      urgentAvailable: false,
      urgentSurcharge: 0,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Дальній Київ',
      slug: 'kyiv-far',
      areas: [{ place: 'Печерськ' }, { place: 'Поділ' }, { place: 'Лівий берег' }],
      tariff: 500,
      freeFromAmount: 10000,
      timeFrom: '10:00',
      timeTo: '19:00',
      urgentAvailable: false,
      urgentSurcharge: 0,
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const z of zones) {
    const existing = await payload.find({
      collection: 'delivery-zones',
      where: { slug: { equals: z.slug } },
      limit: 1,
    });
    if (existing.docs[0]) continue;
    await payload.create({ collection: 'delivery-zones', data: z });
  }
  console.log(`  ✓ ${zones.length} delivery zones`);
}
