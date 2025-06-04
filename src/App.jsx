import React from 'react';
import ForgeBoardLayout from './components/layout/forgeboard/ForgeBoardLayout';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <main className="min-h-screen bg-zinc-900 text-white">
        <ForgeBoardLayout />
      </main>
    </>
  );
}

export default App;
