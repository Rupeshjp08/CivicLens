import React from 'react';
import { Outlet } from 'react-router-dom';

export default function CitizenLayout() {
  return (
    <div className="citizen-layout">
      <Outlet />
    </div>
  );
}
