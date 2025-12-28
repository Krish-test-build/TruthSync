import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Moon from '../components/Moon';
import Galaxy from '../components/Galaxy';
import { Link } from 'react-router-dom';
import { EffectComposer, Bloom } from '@react-three/postprocessing';


const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModelReady(true);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (modelReady) {
      setLoaded(true);
    }
  }, [modelReady]);

  return (
    <>
      {!loaded ? (
        <div className="flex justify-center items-center h-screen">
          <div className="loader">Loading...</div> 
        </div>
      ) : (
        <>
          
          <div className='flex flex-col justify-center items-center p-0 overflow-hidden'>
            <div className="shadow-lg shadow-gray-500 h-screen w-full relative overflow-hidden">
              <video
                autoPlay loop muted className="w-full h-full object-cover relative top-0"
                src="https:video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
              ></video>
            </div>

            <div className="absolute bg-black brightness-110 border-6  border-white h-45 w-250 flex rounded-2xl items-center text-[#dbdbdb] font-bold z-5 text-center mix-blend-lighten -translate-y-1/2">
              <h1
                className="relative left-1/2 -translate-x-1/2  font-bold text-[150px] uppercase font-[monaco] tracking-widest"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.6)',
                }}
              >
                TruthSync
              </h1>
            </div>

            <div className="absolute bg-transparent drop-shadow-xl drop-shadow-cyan-300 -translate-y-1/2 border-6 border-white h-45 w-250 flex rounded-2xl items-center text-white text-2xl font-bold z-5 text-center">
            </div>
          </div>

          <div className='z-3 h-screen w-screen absolute top-0 left-1/2 -translate-x-1/2'>
            <Canvas camera={{ fov: 50, position: [0, 5, 30] }}>
              <Galaxy />
              <EffectComposer>
                <Bloom intensity={1} luminanceThreshold={0} luminanceSmoothing={1.2} height={300} />
              </EffectComposer>
            </Canvas>
          </div>

          <div className='inline-flex justify-around'>
            <Link
              to="/SignUp"
              className="group tracking-wider text-center absolute bottom-5 bg-transparent drop-shadow-md opacity-85 drop-shadow-cyan-300 border-6 border-white h-25 w-[40%] rounded-2xl text-white text-[60px] font-bold z-5 left-15 font-[monaco] 
              hover:bg-white hover:text-black transition ease-in-out delay-300 hover:shadow-2xl hover:shadow-cyan-300 hover:-translate-y-1 hover:scale-110 duration-250 overflow-hidden"
            >
              SignUp
              <span className="shine-overlay"></span>
            </Link>
            <Link
              to="/Login"
              className="group tracking-wider text-center absolute bottom-5 bg-transparent drop-shadow-md opacity-85 drop-shadow-cyan-300 border-6 border-white h-25 w-[40%] rounded-2xl text-white text-[60px] font-bold z-5 right-15 font-[monaco] 
              hover:bg-white hover:text-black transition ease-in-out delay-300 hover:shadow-2xl hover:shadow-cyan-300 hover:-translate-y-1 hover:scale-110 duration-250 overflow-hidden"
            >
              Login
              <span className="shine-overlay"></span>
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
