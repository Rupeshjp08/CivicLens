import React from 'react';
import { useParams } from 'react-router-dom';
import TrackComplaint from '../TrackComplaint';

export default function CitizenComplaintDetail() {
  const { id } = useParams();
  return <TrackComplaint lookupId={id} />;
}
