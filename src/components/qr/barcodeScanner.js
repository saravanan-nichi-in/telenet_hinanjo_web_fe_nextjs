import { useState } from "react";
import { useZxing } from "react-zxing";

const BarcodeScanner = () => {
    const [result, setResult] = useState("");
    const { ref,
        torch: { on, off, isOn, isAvailable },
    } = useZxing({
        onResult(result) {
            setResult(result.getText());
            console.log(result);
        },
    });

    return (
        <>
            <video ref={ref} />
        </>
    );
};
export default BarcodeScanner; 
