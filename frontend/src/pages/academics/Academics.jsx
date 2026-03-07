// src/pages/client/academics/AcademicsIndex.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Academics() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/academics/grades', { replace: true });
  }, [navigate]);

  return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-300">
    Loading academics...
  </div>;
}