import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Categories from './Categories'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import logo from '../assets/logo1.png'

const SideBar = ({ onCategoryClick, onTopClaimsClick, onHomeClick }) => {
  const categoryRef = useRef(null)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const navigate = useNavigate()

  useGSAP(() => {
    gsap.to(categoryRef.current, {
      opacity: categoryOpen ? 1 : 0,
      zIndex: 5,
      duration: 0.3,
      ease: 'power3.inOut',
    })
  }, [categoryOpen])

  const glowStyle = {
    textShadow: '2px 2px 3px rgba(123,108,255,0.55)',
  }

  return (
    <>
      <div className="h-full w-44 flex flex-col items-center z-10">
        <img
          src={logo}
          alt="Logo"
          onClick={() => {
            navigate('/home')
            onHomeClick()
          }}
          className="hover:cursor-pointer h-30 w-32 mt-4 hover:scale-110 transition"
        />

        <div className="text-[#E6E8EE] text-[40px] font-[monaco] font-bold mt-16 space-y-7 text-center">
          <Link
            to="/home"
            onClick={onHomeClick}
            className="hover:scale-110 flex justify-center transition-all delay-100 ease-in-out hover:text-[#B8B2FF] cursor-pointer"
            style={glowStyle}
          >
            Home
          </Link>

          <div
            onClick={() => {
              navigate('/home')
              onTopClaimsClick()
            }}
            className="hover:scale-110 -mt-1.5 transition-all delay-100 ease-in-out cursor-pointer hover:text-[#B8B2FF]"
            style={glowStyle}
          >
            Top Claims
          </div>

          <Link
            to="/verifiedFacts"
            className="hover:scale-110 leading-[1]  flex justify-center  transition-all delay-100  ease-in-out hover:text-[#B8B2FF] cursor-pointer"
            style={glowStyle}
          >
            Verified <br/> Facts
          </Link>

          <button
            onClick={() => {
              setHydrated(!hydrated)
              setCategoryOpen(!categoryOpen)
            }}
            className="hover:scale-110 transition-all delay-100 ease-in-out hover:text-[#B8B2FF] cursor-pointer "
            style={glowStyle}
          >
            Categories
          </button>
        </div>
      </div>

      {hydrated && (
        <div ref={categoryRef} className="absolute z-20">
          <Categories
            onCategoryClick={onCategoryClick}
            setCategoryOpen={setCategoryOpen}
            categoryOpen={categoryOpen}
          />
        </div>
      )}
    </>
  )
}

export default SideBar
