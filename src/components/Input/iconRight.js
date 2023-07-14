"use client"

export default function IconRight(props) {
  return (
    <main>
      <div>
      <label
        htmlFor={props.for}
        className="block mb-1 text-base font-medium"
        style={{ color: props.labelColor }}
      >
        {props.label}
      </label>
          <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {props.icon()}
              </div>
              <input type={props.type} id={props.id} className={`
                  block w-full ${props.padding} pl-10 text-sm  
                  ${props.border} ${props.borderRound} ${props.focus} ${props.additionalClass}`} 
                  placeholder={props.placeholder} 
                  value={props.value}
                  onChange={(e)=>{props?.onChange(e.target.value)}}
              />
          </div>
      </div>
    </main>
  )
}