import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children, openLoginModal }) {
  return (
    <div className="min-h-screen bg-[#0A0B10] text-slate-100 flex flex-col">
      <Navbar openLoginModal={openLoginModal} />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
