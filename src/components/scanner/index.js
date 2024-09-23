'use client'

import React, { useState, useRef, useCallback } from 'react';
import Webcam from "react-webcam";
import { Dialog } from 'primereact/dialog';
import { Spin, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FaFileUpload } from 'react-icons/fa';
import { IoMdReverseCamera } from 'react-icons/io';
import { AiOutlineCamera, AiOutlineRotateRight } from 'react-icons/ai';
import { MdSettingsBackupRestore } from 'react-icons/md';

import { Button } from "@/components";
import Cropper from '@/components/perspectiveCropping/cropper'

const { Dragger } = Upload

export const DocumentScanner = (props) => {
    const webcamRef = useRef(null);
    const cropperRef = useRef();
    const [displayPosition, setDisplayPosition] = useState(false);
    const [position, setPosition] = useState('center');
    const webcamContainerRef = useRef(null);
    const [cropState, setCropState] = useState();
    const [img, setImg] = useState();
    const [loader, setLoader] = useState(false);
    const [selectUtil, setSelectUtil] = useState('camera');
    const [completed, setCompleted] = useState(false);
    const [toggleCameraMode, setToggleCameraMode] = useState("environment");
    const [rotateAngel, setRotateAngel] = useState(0);
    const onDragStop = useCallback((s) => setCropState(s), [])
    const onChange = useCallback((s) => setCropState(s), [])
    const [result, setResult] = useState("")

    const onFileSelectionBtnClick = (name) => {
        props?.callback(img);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <div className='mt-2'>
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            type: "button",
                            icon: <FaFileUpload className='text-2xl' />,
                            buttonClass: "px-3",
                            style: {
                                backgroundColor: "var(--yellow-500)",
                                borderColor: "var(--yellow-500)"
                            },
                            onClick: () => onFileSelectionBtnClick(),
                        }}
                    />
                </div>
            </div>
        );
    }

    const onImgSelection = async (e) => {
        setLoader(true);
        if (e.file) {
            // It can also be a http or base64 string for example
            setTimeout(() => {
                setLoader(false);
                setImg(e.file.originFileObj);
                setCompleted(false);
            }, 2000);
        }
    }

    const draggerProps = {
        name: 'file',
        multiple: false,
        onChange: onImgSelection
    }

    return (
        <div className="grid">
            <Dialog
                header="身分証明書をスキャンします"
                visible={props.visible}
                position={"top"}
                draggable={false}
                blockScroll={true}
                onHide={() => {
                    props.hide();
                }}
                footer={renderFooter('displayPosition')}
                className="custom-modal ocr-modal m-0 sm:m-2 lg:m-2 md:m-2"
                modal
                contentStyle={{ overflow: 'hidden' }}
            >
                <Dragger {...draggerProps} >
                    <p>
                        <PlusOutlined />
                    </p>
                    <p>Upload</p>
                </Dragger>
            </Dialog >
        </div >
    );
};