import React from 'react';
import Header from './Header';
import ContestList from './ContestList';

const MainCommunity = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <ContestList />
      </main>
    </div>
  );
};

export default MainCommunity;