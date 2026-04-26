/**
 * Custom dashboard widget for the Payload admin home page.
 * Shows: today's stats, escalations, AI budget.
 *
 * Wired into payload.config.ts via admin.components.beforeDashboard.
 * (Phase 2 will expand into full custom-view system. For Phase 1 we rely on
 * Payload's default collection UIs and add this single widget on top.)
 */
'use client';

import { useEffect, useState } from 'react';

interface Stats {
  todayOrders: number;
  todayRevenue: number;
  unreadEscalations: number;
  pendingPayments: number;
  aiSpentThisMonthUSD: number;
  aiBudgetUSD: number;
}

export default function DashboardWidget() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div style={{ padding: '24px', borderRadius: 16, background: '#F5F0E8', marginBottom: 24 }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#2C3E2D', marginBottom: 16 }}>
        Florenza · сьогодні
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <Stat label="Замовлень сьогодні" value={String(stats.todayOrders)} />
        <Stat label="Обіг сьогодні, грн" value={String(stats.todayRevenue)} />
        <Stat label="Ескалації відкриті" value={String(stats.unreadEscalations)} highlight={stats.unreadEscalations > 0} />
        <Stat label="Очікують оплати" value={String(stats.pendingPayments)} />
        <Stat label="AI витрати ($) у мiсяцi" value={`${stats.aiSpentThisMonthUSD.toFixed(2)} / ${stats.aiBudgetUSD}`} />
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ padding: 16, background: highlight ? '#FFE4DC' : '#fff', borderRadius: 8 }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6B6B', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#2C3E2D' }}>{value}</div>
    </div>
  );
}
