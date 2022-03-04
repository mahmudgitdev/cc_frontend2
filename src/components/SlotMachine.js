import { useRef, useState} from 'react';
import { motion } from 'framer-motion';

export default function SlotMachine({handleSpin,questions,currentRound}){
  let slotRef = [useRef(null),useRef(null),useRef(null)];
  
  // to trigger roolling and maintain state
  const roll = () => {
    
    slotRef.forEach((slot, i) => {
      // this will trigger rolling effect
      const selected = triggerSlotRotation(slot.current);
      if(i== 0){
        setTimeout(()=>{
          handleSpin(selected);
        },2000);
      }
     });
  };

  // this will create a rolling effect and return random selected option
  const triggerSlotRotation = ref => {
    function setTop(top) {
      ref.style.top = `${top}px`;
    }

    let options = ref.children;
    let randomOption = Math.floor(
      Math.random() * questions.length
    );

    let choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return questions[randomOption];
  };

  return (
      <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen overflow-hidden flex justify-center items-center">
        <div className='w-full flex flex-col items-center px-2 md:px-20 lg:px-40'>
        <div className="bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 w-full relative inline-block h-32 rounded">
          <div className='w-full absolute h-12 overflow-hidden text-center cursor-default leading-10 mt-10'>
            <div className="absolute top-3 w-full ease-in-out duration-700" ref={slotRef[0]}>
              {questions.filter((item)=> {return item.round === currentRound.toString()}).map((item, i) => (
                <div key={i} className='flex justify-center items-center shadow-md'>

                    <motion.div
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1.3 }}
                      transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 40
                    }} 
                    >
                    <span className='text-white font-bold text-lg'>{item.question}</span>
                  </motion.div>
                
                </div>
              ))}
            </div>
          </div>
          <div className='w-full absolute h-12 overflow-hidden text-center cursor-default leading-10 mt-20'>
            <div className="absolute top-3 w-full ease-in-out duration-700" ref={slotRef[1]}>
              {questions.map((item, i) => (
                <div key={i} className='flex justify-center items-center'>
                  <div>
                    <span className='text-base font-medium text-gray-200'>{item.question}</span>
                  </div>
                
                </div>
              ))}
            </div>
          </div>
          <div className='w-full absolute h-12 overflow-hidden text-center cursor-default leading-10 mt-30'>
            <div className="absolute top-3 w-full ease-in-out duration-700" ref={slotRef[2]}>
              {questions.map((item, i) => (
                <div key={i} className='flex justify-center items-center'>
                  <div>
                    <span className='text-base font-medium text-gray-200'>{item.question}</span>
                  </div>
                
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="w-36 py-3 mt-5 text-white rounded font-bold text-2xl bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={roll}
          >
          Spin
        </button>
        </div>
      </div>
    ); 
}