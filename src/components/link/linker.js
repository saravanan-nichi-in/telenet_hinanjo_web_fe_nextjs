import React from "react";
import Link from "next/link";

const Linker = (props) => {
    const {
        ParentClass,
        custom,
        linkProps = {}
    } = props;
    const {
        textWithUnderline,
        linkClass,
        href,
        text,
        customStyle,
        onClick
    } = linkProps;
    const linkStyles = { textDecoration: "underline" };

    return (
        <div className={`${ParentClass}  ${custom || 'text-link-class'}`}>
            {textWithUnderline ? (
                <>
                    <Link onClick={onClick} className={`${linkClass}`} style={linkStyles || customStyle} href={href}>
                        {textWithUnderline}
                    </Link>
                </>
            ) : (
                <Link onClick={onClick} className={`${linkClass}`} style={customStyle} href={href}>
                    {text}
                </Link>
            )}
        </div>
    )
}

export default Linker;