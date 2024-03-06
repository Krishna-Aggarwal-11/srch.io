import React from 'react'
import SearchBar from '../components/SearchBar'
import Footer from './../components/Footer';
import Header from './../components/Header';

const Home = () => {
  return (
<div className="absolute inset-0 min-h-[500px] flex items-center justify-center">
      <div className="relative flex flex-col gap-8 px-4 -mt-24">
        <Header></Header>
        <SearchBar></SearchBar>
        
        <div className="flex gap-2 flex-wrap justify-center">
        </div>
        <Footer></Footer>
      </div>
    </div>
  )
}

export default Home