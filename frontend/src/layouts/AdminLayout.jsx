import React from 'react';
import OfficerLayout from './OfficerLayout';

/**
 * Legacy AdminLayout fallback
 * Maps directly to OfficerLayout in accordance with 2-role architecture
 */
export default function AdminLayout() {
  return <OfficerLayout />;
}
