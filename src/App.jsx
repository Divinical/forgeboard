import React from 'react';
import ForgeBoardLayout from './components/layout/forgeboard/ForgeBoardLayout';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="w-full max-w-screen overflow-x-hidden">
      <Toaster position="top-center" />
      <main className="min-h-screen bg-zinc-900 text-white w-full max-w-screen overflow-x-hidden">
        <ForgeBoardLayout />
      </main>
    </div>
  );
}

export default App;