"use client"

export default function Progress(props) {
  return (
    <main>
        <input id="small-range" onChange={(e)=>{
            const rangeInput = document.getElementById('small-range');
            const gradient = `linear-gradient(to right, #00ACFF, #85D6FD ${props.value}%, #282828 ${props.value}%)`;
            rangeInput.style.background = gradient;
            props.setValue(()=>(e.target.value))
        }} 
        type="range" 
        value={props.value} 
        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700" />
    </main>
  )
}