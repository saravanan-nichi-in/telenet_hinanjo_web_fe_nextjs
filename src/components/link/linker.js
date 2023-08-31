import React from "react";
import Link from "next/link";

const Linker = (props) => {
    const { ParentClass, linkProps = {} } = props;
    const { textWithUnderline, linkClass, href, text } = linkProps;
    const linkStyles = { textDecoration: "underline" };

    return (
        <div className={`${ParentClass}`}>
            {textWithUnderline ? (
                <>
                    <Link className={`${linkClass}`} style={linkStyles} href={href}>
                        {textWithUnderline}
                    </Link>
                </>
            ) : (
                <Link className={`${linkClass}`} href={href}>
                    {text}
                </Link>
            )}
        </div>
    )
}
export default Linker