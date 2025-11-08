import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Categories from './Categories';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from '../assets/logo1.png'


const SideBar = ({ onCategoryClick, onTopClaimsClick,onHomeClick }) => {
    const categoryRef = useRef(null);
    const [categoryOpen, setCategoryOpen] = useState(false)
    const navigate = useNavigate();
    const [hydrated, setHydrated] = useState(false);

 


    const imgClick = () => {
        navigate('/home')
    }

     useGSAP( () => {
     gsap.to(
       categoryRef.current,
       {
         opacity: categoryOpen ? '1' : '0',
         zIndex: '5',
         duration: 0.3,
         ease: 'power3.inOut',
       }
     )
    },[categoryOpen]);

  return (
    <>
    <div className="h-full w-44  flex flex-col items-center z-10">
              <img onClick={imgClick} src={logo} alt="Logo" className="hover:cursor-pointer h-30 w-32  mt-4 hover:scale-110 transition" />
    
              <div className="text-white text-center text-[40px]  flex flex-col items-center font-[monaco] font-bold mt-16 space-y-8">
                <Link to="/home" className="hover:scale-110 transition  cursor-pointer"style={{ textShadow: '3px 3px 2.5px #51E5F8' }} onClick={onHomeClick}>Home</Link>
                <div
                    className="hover:scale-110 transition leading-8 cursor-pointer "
                    style={{ textShadow: '3px 3px 2.5px #51E5F8' }}
                    onClick={onTopClaimsClick}
                >
                    Top  Claims
                </div>
                <Link to="/verifiedFacts" className="hover:scale-110 transition leading-8 cursor-pointer "style={{ textShadow: '3px 3px 2.5px #51E5F8' }}>Verified <br /> Facts</Link>
                <button
                    onClick={() => {
                        setHydrated(!hydrated);
                        setCategoryOpen(!categoryOpen)
                    }}
                    className="hover:scale-110 transition cursor-pointer "
                    style={{ textShadow: '3px 3px 2.5px #51E5F8' }}
                >
                    Categories
                </button>
                
              </div>
            </div>
            {hydrated &&(
            <div ref={categoryRef} className='z-5 absolute '>
            <Categories onCategoryClick={onCategoryClick} setCategoryOpen={setCategoryOpen} categoryOpen={categoryOpen}/>
            </div>)}
    </>
  )
}

export default SideBar