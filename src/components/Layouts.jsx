// src/components/Layout.jsx

import React from 'react';
import Header from './../layout/Header';
import Footer from './../layout/Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
