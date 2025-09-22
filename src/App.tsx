import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer isLoggedIn={false} />
    </div>;
}