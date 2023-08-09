import React,{useState} from "react"
import IconPosBtn from "../Buttons/iconPositionBtn";
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from "primereact/inputswitch";
export default function DeleteModal(props) {
    const [visible, setVisible] = useState(false);
    const footer = (
        <div className="text-center">
            <IconPosBtn additionalClasses={"h-3rem"} additionalClass={"inline"} text={"キャンセル"}/>
            <IconPosBtn additionalClasses={"h-3rem"} additionalClass={"inline"} text={props.btntext} severity={"danger"}/> 
        </div>
    );
    
    return (
        <div>
            {props.text ? (
                <>
            <IconPosBtn text={props.text} icon={props.icon} iconpos={props.iconpos} onClick={() => setVisible(true)} />
            <Dialog header={props.header} footer={footer} visible={visible} onHide={() => setVisible(false)}>
            <div class="text-center">
                    <p>{props.content1}</p>
                    <p>{props.content2}</p>
                </div>
            </Dialog> 
            </> ):(
                <>
                <InputSwitch className={`${props.bgcolor} ${props.additionalclass}`} checked={props.checked} onChange={() => setVisible(true)}/>
                <Dialog header={props.header} footer={footer} visible={visible} onHide={() => setVisible(false)}>
                <div class="text-center">
                        <p>{props.content}</p>
                    </div>
                </Dialog> 
                </>)}
        </div>
    ) 
}