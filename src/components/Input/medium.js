"use client"

export default function Medium(props) {
  return (
    <main>
      <div>
          <div className="relative">
              <input 
                type={props.type} 
                id="default-search" 
                className={
                 `${props.padding} ${props.additionalClass}  
                  ${props.border} ${props.borderRound}
                  ${props.focus} ${props.bg}`
                } 
                placeholder={props.placeholder}  
                value={props.value}
                onChange={(e)=>{props.onChange(e.target.value)}}
              />
          </div>
      </div>
    </main>
  )
}