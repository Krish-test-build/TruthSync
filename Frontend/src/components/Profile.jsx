import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCircle, FaEnvelope, FaLock, FaImage, FaSignOutAlt, FaUserEdit } from 'react-icons/fa'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-0 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.15 } }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
        className="bg-white p-6 rounded-2xl shadow-lg w-96 relative border-5 border-cyan-400"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-gray-600 hover:text-black hover:cursor-pointer hover:scale-110 text-xl"
        >
          <div className='bg-red-400 px-1 w-6 h-6 rounded-full blur-sm'></div>
          <span className='absolute top-0 left-0.5 font-extrabold'>✕</span>
        </button>
        <h2 className="text-xl font-[spaceMono] font-bold mb-4 text-black">{title}</h2>
        {children}
      </motion.div>
    </div>
  )
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Profile = () => {
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [picModalOpen, setPicModalOpen] = useState(false)
  const [infoModalOpen, setInfoModalOpen] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')

  const submitHandler =  (e) => {
    e.preventDefault()
    setEmail('')
    setPassword('')
    setProfilePic(null)
    setFullName('')
    setUsername('')
  }
   

  return (
    <>
      <div className="w-64 bg-white border-4 border-cyan-300 rounded-2xl p-4 space-y-4 text-black font-[spaceMono] z-10 absolute right-53 top-20">
        <div className="flex items-center space-x-3">
          <FaUserCircle size={40} className="text-cyan-400" />
          <div>
            <h2 className="text-lg font-bold">John Doe</h2>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 hover:scale-105 transition hover:cursor-pointer" onClick={async () =>  {await delay(200); setEmailModalOpen(true)}}>
          <FaEnvelope />
          <span>Update Email</span>
        </div>

        <div className="flex items-center space-x-3 hover:scale-105 transition hover:cursor-pointer" onClick={async () => {await delay(200); setPasswordModalOpen(true)}}>
          <FaLock />
          <span>Change Password</span>
        </div>

        <div className="flex items-center space-x-3 hover:scale-105 transition hover:cursor-pointer" onClick={async () => {await delay(200); setPicModalOpen(true)}}>
          <FaImage />
          <span>Change Profile Picture</span>
        </div>

        <div className="flex items-center space-x-3 hover:scale-105 transition hover:cursor-pointer" onClick={async () => {await delay(200); setInfoModalOpen(true)}}>
          <FaUserEdit />
          <span>Edit Personal Info</span>
        </div>

        <button className="w-full bg-red-600 text-white py-2 rounded-xl flex items-center justify-center space-x-2 hover:bg-red-500 transition hover:cursor-pointer hover:scale-105 duration-250 ease-in-out">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

       <AnimatePresence>
        <Modal 
        key="email"
        isOpen={emailModalOpen}  
        onClose={() => {
            setEmailModalOpen(false);
            setEmail('');
            }} 
        title="Update Email">

            <form  onSubmit={(e) => {
                submitHandler(e);
                setEmailModalOpen(false);}}>

                <input
                required
                type="email"
                placeholder="New email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl p-2 mb-3"
                />

                <button className="bg-blue-600 active:bg-blue-500 hover:scale-105 transition duration-250 ease-in-out active:scale-90 hover:cursor-pointer text-white w-full py-1.5 rounded-xl font-[spaceMono] text-lg hover:bg-blue-700">Submit</button>
            </form>
        </Modal>
      

     
        <Modal 
        key="password"
        isOpen={passwordModalOpen} 
        onClose={() =>{ 
            setPasswordModalOpen(false);
            setPassword('');
        }} 
        title="Change Password">

            <form onSubmit={(e) => {
                submitHandler(e); 
                setPasswordModalOpen(false)
                }}>

                <input
                    type="password"
                    required
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-xl p-2 mb-3"
                />

                <button className="bg-blue-600 active:bg-blue-500 hover:scale-105 transition duration-250 ease-in-out active:scale-90 hover:cursor-pointer text-white w-full py-1.5 rounded-xl font-[spaceMono] text-lg hover:bg-blue-700">Submit</button>
            </form>
        </Modal>
      

      
        <Modal 
        key="pic"
        isOpen={picModalOpen} 
        onClose={() => {
            setPicModalOpen(false);
            setProfilePic(null);
            }} 
            title="Change Profile Picture">
          <div className="w-full flex flex-col items-center justify-center space-y-3">
            <form onSubmit={(e) => {
                submitHandler(e);
                setPicModalOpen(false);
            }}
            action="">

            <input
              type="file"
              required
              className="w-30 flex h-30 text-wrap border rounded-xl p-2 mb-3"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
            
            <button className="bg-blue-600 active:bg-blue-500 hover:scale-105 transition duration-250 ease-in-out active:scale-90 hover:cursor-pointer text-white w-full py-1.5 rounded-xl font-[spaceMono] text-lg hover:bg-blue-700">Upload</button>
            </form>
          </div>
        </Modal>
      

      
        <Modal 
        key="personal-info"
        isOpen={infoModalOpen} 
        onClose={() => {
            setInfoModalOpen(false);
            setUsername('');
            setFullName('');
            }} 
            title="Edit Personal Info">
                <form onSubmit={(e) => {
                    submitHandler(e);
                    setInfoModalOpen(false);
                }}
                action="">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border rounded-xl p-2 mb-3"
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded-xl p-2 mb-3"
                />
                <button className="bg-blue-600 active:bg-blue-500 hover:scale-105 transition duration-250 ease-in-out active:scale-90 hover:cursor-pointer text-white w-full py-1.5 rounded-xl font-[spaceMono] text-lg hover:bg-blue-700">Save Changes</button>
          </form>
        </Modal>
      </AnimatePresence>
    </>
  )
}

export default Profile
