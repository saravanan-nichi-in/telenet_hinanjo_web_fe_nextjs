'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from "react-webcam";
import { Dialog } from 'primereact/dialog';
import { Spin, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FaFileUpload } from 'react-icons/fa';
import { IoMdReverseCamera, IoIosArrowBack } from 'react-icons/io';
import { AiOutlineCamera, AiOutlineRotateRight } from 'react-icons/ai';
import { MdSettingsBackupRestore } from 'react-icons/md';
import {
    Button,
} from "@/components";

import Cropper from './cropper'
import './crop.module.css'

const { Dragger } = Upload

export const PerspectiveCropping = (props) => {
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

    const [videoStream, setVideoStream] = useState(null);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);

    useEffect(() => {
        setLoader(true);
        setSelectUtil('camera');
        setCompleted(false);
        setImg(undefined);
        setCropState();
        setResult("")
        getCameraDimensions();
    }, [])

    const getCameraDimensions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoTrack = stream.getVideoTracks()[0];
            const settings = videoTrack.getSettings();
            let tempHeight = settings.height * 0.7;
            let tempWidth = settings.width * 0.7;
            //   setVideoWidth(parseInt(tempWidth-(tempWidth*0.4)));
            //   setVideoHeight(parseInt(tempHeight-(tempHeight*0.4)));
            setVideoWidth(tempWidth)
            setVideoHeight(tempHeight)
            setVideoStream(stream);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }


    useEffect(() => {
        const startWebcam = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setLoader(false);
            } catch (err) {
                console.error('Error accessing the camera:', err);
            }
        };
        startWebcam();
    }, [selectUtil]);

    const dialogFuncMap = {
        'displayPosition': setDisplayPosition,
    }

    const onClickOpenModal = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onCameraBtnClick = (name) => {
        setLoader(true);
        setSelectUtil('camera');
    }

    const onCapture = (name) => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
        setCompleted(false)
    }

    const onFileSelectionBtnClick = (name) => {
        setSelectUtil('file');
    }

    const renderFooter = (name) => {
        return (
            <div className={`${!cropState && selectUtil == "camera" ? 'footer-view' : 'footer-view1'} `}>
                <div className='mt-2'>
                    {!cropState &&
                        <>
                            {selectUtil == "camera" ? (
                                <>
                                    <Button
                                        parentStyle={{ display: "inline" }}
                                        buttonProps={{
                                            type: "button",
                                            icon: <IoMdReverseCamera className='text-4xl' />,
                                            buttonClass: "px-3",
                                            style: {
                                                backgroundColor: "var(--blue-700)",
                                                borderColor: "var(--blue-700)"
                                            },
                                            onClick: () => {
                                                if (toggleCameraMode == "user") {

                                                    setToggleCameraMode("environment");
                                                } else {
                                                    setToggleCameraMode("user");
                                                }
                                            },
                                        }}

                                    />
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
                                </>
                            ) : (
                                <Button
                                    parentStyle={{ display: "inline" }}
                                    buttonProps={{
                                        type: "button",
                                        icon: <AiOutlineCamera className='text-3xl' />,
                                        buttonClass: "px-3",
                                        style: {
                                            backgroundColor: "var(--orange-500)",
                                            borderColor: "var(--orange-500)"
                                        },
                                        onClick: () => {
                                            onCameraBtnClick()
                                        },
                                    }}
                                />
                            )}
                        </>
                    }
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            type: "button",
                            style: {
                                backgroundColor: "var(--red-500)",
                                borderColor: "var(--red-500)"
                            },
                            icon: <MdSettingsBackupRestore className='text-3xl' />,
                            iconPos: 'left',
                            buttonClass: "px-3",
                            onClick: () => {
                                // cropperRef.current.backToCrop();
                                // setCompleted(false);
                                setSelectUtil('camera');
                                setCompleted(false);
                                setImg(undefined);
                                setCropState();
                            },
                        }}
                    />
                </div>
                <div>
                    {!cropState ? (
                        <>
                            <Button
                                parentStyle={{ display: "inline" }}
                                buttonProps={{
                                    type: "button",
                                    text: "撮影する",
                                    buttonClass: "px-3 mt-2",
                                    style: {
                                        backgroundColor: "var(--gray-700)",
                                        borderColor: "var(--gray-700)"
                                    },
                                    onClick: () => {
                                        onCapture()
                                    },
                                }}
                            />
                        </>
                    ) : (
                        <>
                            {!completed ? (
                                <div>
                                    <Button
                                        parentStyle={{ display: "inline" }}
                                        buttonProps={{
                                            type: "button",
                                            style: {
                                                backgroundColor: "var(--red-500)",
                                                borderColor: "var(--red-500)"
                                            },
                                            icon: <AiOutlineRotateRight className='text-3xl' />,
                                            iconPos: 'left',
                                            buttonClass: "px-3 mt-2",
                                            onClick: () => {
                                                if (rotateAngel == 0) {
                                                    setRotateAngel(-90);
                                                } else if (rotateAngel == -90) {
                                                    setRotateAngel(-180);
                                                } else if (rotateAngel == -180) {
                                                    setRotateAngel(-270);
                                                } else {
                                                    setRotateAngel(0);
                                                }
                                            },
                                        }}
                                    />
                                    <Button
                                        parentStyle={{ display: "inline" }}
                                        buttonProps={{
                                            type: "button",
                                            text: "四角を合わせる",
                                            style: {
                                                backgroundColor: "var(--gray-700)",
                                                borderColor: "var(--gray-700)",
                                                marginBottom: ".2rem",
                                            },
                                            onClick: () => {
                                                doSomething()
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <Button
                                    parentStyle={{ display: "inline" }}
                                    buttonProps={{
                                        type: "button",
                                        text: "OK",
                                        style: {
                                            backgroundColor: "var(--gray-700)",
                                            borderColor: "var(--gray-700)"
                                        },
                                        buttonClass: "mt-2",
                                        onClick: () => {
                                            setSelectUtil('camera');
                                            setCompleted(true)
                                            setImg(undefined);
                                            setCropState();
                                            props.callback(result);
                                        },
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            </div >
        );
    }

    const onDragStop = useCallback((s) => setCropState(s), [])
    const onChange = useCallback((s) => setCropState(s), [])
    const [result, setResult] = useState("")

    const doSomething = async () => {
        try {
            const res = await cropperRef.current.done({
                preview: true,
                filterCvParams: {
                    grayScale: false,
                    th: false,
                    thMode: window.cv.ADAPTIVE_THRESH_GAUSSIAN_C
                }
            });

            if (res) {
                const blob = new Blob([res]);
                const reader = new FileReader();

                reader.onload = () => {
                    const base64Data = reader.result;

                    // Create an image element
                    const img = new Image();

                    img.onload = () => {
                        // Create a canvas element
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // Set the canvas dimensions to the image dimensions
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // Draw the image on the canvas
                        ctx.drawImage(img, 0, 0);

                        // Convert the canvas content to a data URL (PNG format)
                        const pngDataUrl = canvas.toDataURL('image/png');

                        // Set the result with the PNG data URL
                        setResult(pngDataUrl);
                    };

                    // Set the image source to the base64 data
                    img.src = base64Data;
                };

                reader.readAsDataURL(blob);
            }

            setCompleted(true);
        } catch (e) {
            console.error('error', e);
        }
    };


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
                    setSelectUtil("camera");
                    setCompleted(false);
                    setImg(undefined);
                    setCropState();
                    setResult("");
                    setRotateAngel(0);
                }}
                footer={renderFooter('displayPosition')}
                className="custom-modal ocr-modal m-0 sm:m-2 lg:m-2 md:m-2"

                // style={{ width: '40vw' }} // Adjust the width based on responsiveness
                // breakpoints={{ '960px': '52vw', '640px': '100vw', '370px': '100vw' }}
                modal
                contentStyle={{ overflow: 'hidden' }}
            >
                <div ref={webcamContainerRef}>
                    {loader ? (
                        <div
                            className=''
                            style={{
                                height: "100%",
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Spin />
                        </div>
                    ) : !loader && img ? (
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingBottom: '1rem',
                                paddingTop: '1rem',
                            }}
                        >
                            <Cropper
                                ref={cropperRef}
                                image={img}
                                onChange={onChange}
                                onDragStop={onDragStop}
                                maxWidth="300"
                                maxHeight="450"
                                // maxHeight={"100%"}
                                pointBgColor={"var(--primary-color)"}
                                pointBorder={"var(--primary-color)"}
                                lineColor={"var(--primary-color)"}
                                lineWidth={5}
                                pointSize={20}
                                rotateAngel={rotateAngel}
                            />
                        </div>
                    ) : (
                        <>
                            {selectUtil == "camera" ? (
                                <div className="webcam-container">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef && webcamRef}
                                        screenshotFormat="image/jpeg"
                                        screenshotQuality={1}
                                        className="webcam-element"
                                        videoConstraints={{
                                            facingMode: toggleCameraMode
                                        }}
                                    />
                                    <div className="overlay"></div>
                                    <div className="overlay-text">
                                        身分証明書を四角の枠内におさまるようにして撮影するボタンを押してください
                                    </div>
                                </div>
                            ) : !img && !loader ? (
                                <Dragger {...draggerProps} >
                                    <p>
                                        <PlusOutlined />
                                    </p>
                                    <p>Upload</p>
                                </Dragger>
                            ) : null}
                        </>
                    )}
                </div>
            </Dialog >
        </div >
    );
};