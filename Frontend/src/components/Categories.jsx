import React from 'react'
import { FaGlobe, FaHeartbeat, FaFlask, FaGraduationCap, FaChartLine, FaFilm, FaFutbol, FaEllipsisH } from 'react-icons/fa'

const categories = [
  { label: 'Politics', icon: <FaGlobe /> },
  { label: 'Health', icon: <FaHeartbeat /> },
  { label: 'Science & Tech', icon: <FaFlask /> },
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Finance', icon: <FaChartLine /> },
  { label: 'Entertainment', icon: <FaFilm /> },
  { label: 'Sports', icon: <FaFutbol /> },
  { label: 'Miscellaneous', icon: <FaEllipsisH /> },
]

const Categories = () => {
  return (
    <div className='h-auto w-48 rounded-2xl border-4 ml-1 border-purple-800  bg-white absolute left-44 top-1/2 z-20 p-3 flex flex-col font-[spaceMono-Bold] items-start justify-center text-md animate-fade-in'>
      {categories.map((cat, idx) => (
        <button
          key={idx}
          className='w-full flex items-center gap-3 text-left mb-2 hover:scale-105 hover:bg-purple-100 hover:text-purple-700 transition duration-150 ease-in-out drop-shadow cursor-pointer'
        >
          <span className='text-cyan-500'>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default Categories
