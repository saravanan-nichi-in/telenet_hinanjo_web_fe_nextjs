import React,{useState} from "react"
import IconPosBtn from "../button/iconPositionBtn";
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from "primereact/inputswitch";
const DeleteModal=(props)=> {
    const [visible, setVisible] = useState(false);
    const footer = (
        <div className="text-center">
            <IconPosBtn buttonClass={"h-3rem"} parentClass={"inline"} text={"キャンセル"}/>
            <IconPosBtn buttonClass={"h-3rem"} parentClass={"inline"} text={props.btnText} severity={"danger"}/> 
        </div>
    );
    
    return (
        <div>
            {props.text ? (
                <>
            <IconPosBtn text={props.text} icon={props.icon} iconPos={props.iconPos} onClick={() => setVisible(true)} />
            <Dialog className={`${props.modalClass}`} position={props.position} header={props.header} footer={footer} visible={visible} onHide={() => setVisible(false)}>
            <div class="text-center">
                    <p>{props.content1}</p>
                    <p>{props.content2}</p>
                </div>
            </Dialog> 
            </> ):(
                <>
                <InputSwitch className={`${props.bgColor} ${props.parentClass}`} checked={props.checked} onChange={() => setVisible(true)}/>
                <Dialog className={`${props.modalClass}`} position={props.position} header={props.header} footer={footer} visible={visible} onHide={() => setVisible(false)}>
                <div class="text-center">
                        <p>{props.content}</p>
                    </div>
                </Dialog> 
                </>)}
        </div>
    ) 
}
export default DeleteModal