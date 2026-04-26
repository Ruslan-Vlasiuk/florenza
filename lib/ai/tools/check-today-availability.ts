import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';

export const checkTodayAvailability: ToolDef = {
  name: 'check_today_availability',
  description:
    'Чи доступна термінова доставка зараз, чи аварійний режим, що сьогодні недоступне (з адмінки).',
  input_schema: { type: 'object', properties: {} },
  handler: async (_input, _ctx) => {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: 'brand-settings' as any });
    const liyaRules = await payload.findGlobal({ slug: 'liya-rules' as any });
    return {
      emergencyMode: (settings as any)?.emergencyMode ?? false,
      emergencyMessage: (settings as any)?.emergencyMessage,
      urgentDeliveryEnabled: (settings as any)?.urgentDeliveryEnabled ?? true,
      todayCutoffTime: (settings as any)?.todayCutoffTime ?? '19:00',
      holidayMode: (settings as any)?.holidayMode ?? 'none',
      todayUnavailable: (liyaRules as any)?.todayUnavailable ?? '',
      currentTimeUkr: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' }),
    };
  },
};
