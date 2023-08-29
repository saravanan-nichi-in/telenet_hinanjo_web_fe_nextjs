import React, { useState } from "react";
import { HiMicrophone } from "react-icons/hi";
import Btn from "./btn";

const MicroPhoneBtn = (props) => {
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);

    const handleMicrophoneClick = () => {
        setIsMicrophoneActive(!isMicrophoneActive);
    };

    return (
        <div>
            <Btn parentClass={props.parentClass} btnProps={{
                onClick: handleMicrophoneClick,
                bg: "bg-white",
                buttonClass: "border-none border-white",
                icon: <HiMicrophone size={props.size} color={isMicrophoneActive ? "red" : "black"} />
            }} />
        </div>
    );
};
export default MicroPhoneBtn;