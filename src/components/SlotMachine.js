import { useRef, useState} from 'react';
import './slot.css';


export default function SlotMachine({questions}){
  const [fruit1,setFruit1] = useState("🍒");
  const [fruit2,setFruit2] = useState("🍒");
  const [fruit3,setFruit3] = useState("🍒");
  const [rolling,setRolling] = useState(false);
  let slotRef = useRef(null);

  // to trigger roolling and maintain state
  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
    }, 700);

    const selected = triggerSlotRotation(slotRef.current);

    // console.log(selected);
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
      <div className="SlotMachine">
        <div className="w-full relative inline-block">
          <section className='w-full'>
            <div className="absolute top-0.5 w-full ease-in-out duration-700" ref={slotRef}>
              {questions.map((item, i) => (
                <div key={i}>
                  <span>{item.question}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div
          className="roll rolling mt-20"
          onClick={roll}
          >
          ROLL
        </div>
      </div>
    ); 
}