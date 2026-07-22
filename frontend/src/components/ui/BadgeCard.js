import React from 'react';
import { BADGES } from '../../utils/constants';

export default function BadgeCard({ badgeKey }) {
  const badge = BADGES[badgeKey];
  if (!badge) return null;
  return (
    <div className={`badge ${badge.color} border border-current/20`}>
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </div>
  );
}
