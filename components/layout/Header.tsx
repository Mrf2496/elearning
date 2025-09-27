import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-sky-500 to-sky-600 shadow-md z-10 text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Curso E-learning SARLAFT
        </h1>
        <div className="text-sm text-sky-100">Sector Solidario</div>
      </div>
    </header>
  );
};

export default Header;