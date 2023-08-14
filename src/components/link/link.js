import React from "react";
import Link from "next/link";
const Linker=(props)=> {
    const linkStyles = {
        textDecoration: "underline"
    };
    
    return (
        <div className={`${props.additionalClass}`}>
        {props.textWithUnderline ? (
            <>
        
            <Link className={`${props.linkClass}` } style={linkStyles} href={props.link}>{props.textWithUnderline}</Link>
        
        </>
        ):(
            <Link className={`${props.linkClass}` } href={props.link}>{props.text}</Link>

        )}
        </div>
    )
}
export default Linker