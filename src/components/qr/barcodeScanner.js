import { useState } from "react";
import { useZxing } from "react-zxing";

const BarcodeScanner = (props) => {
    const [result, setResult] = useState("");
    const { ref,
        torch: { on, off, isOn, isAvailable },
    } = useZxing({
        onResult(result) {
            setResult(result.getText());
        },
    });

    return (
        <>
            <video ref={ref} width={props.width} />
        </>
    );
};

export default BarcodeScanner; 
