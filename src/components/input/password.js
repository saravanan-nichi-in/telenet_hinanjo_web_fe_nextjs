import React from "react";
import { Password } from "primereact/password";

export default function PasswordInput(props) {
    return (
        <div className={`p-inputgroup ${props.additionalClass}`}>
            {props.antdLeftIcon || props.leftIcon ? (
                <>
                    <span className={`p-inputgroup-addon ${props.additionalClasses}`}>
                        <i className={`${props.leftIcon} `}>{props.antdLeftIcon}</i>
                    </span>
                    <Password
                        name="password"
                        placeholder={props.placeholder}
                        className={`${props.additionalPasswordClass}`}
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        value={props.value}
                    />
                </>
            ) : (
                <>
                    <Password
                        name="password"
                        placeholder={props.placeholder}
                        className={`${props.additionalPasswordClass}`}
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        value={props.value}
                    />
                    <span className={`p-inputgroup-addon ${props.additionalClasses}`}>
                        <i className={`${props.rightIcon} `}>{props.antdRightIcon}</i>
                    </span>
                </>
            )}
        </div>
    );
}
