'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from "react-webcam";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Spin, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Cropper from './react-cropper'

import './crop.module.css'

const { Dragger } = Upload

const ImageCropper = () => {
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

    useEffect(() => {
        setSelectUtil('camera');
        setCompleted(false);
        setImg(undefined);
        setCropState();
        setLoader(false);
    }, [])

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
        setSelectUtil('camera');
    }

    const onCapture = (name) => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
    }

    const onFileSelectionBtnClick = (name) => {
        setSelectUtil('file');
    }

    const submit = (name) => {
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setSelectUtil('camera');
        setCompleted(false);
        setImg(undefined);
        setCropState();
        setLoader(false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                {!cropState ? (
                    <>
                        {selectUtil == "file" ? (
                            <Button label="Camera" onClick={() => onCameraBtnClick()} />
                        ) : (
                            <>
                                <Button label="File" onClick={() => onFileSelectionBtnClick()} />
                                <Button label="Capture" onClick={() => onCapture()} />
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Button label="Back" onClick={() => {
                            cropperRef.current.backToCrop();
                            setCompleted(false);
                        }} />
                        <Button
                            label='Reset'
                            onClick={() => {
                                setSelectUtil('camera');
                                setCompleted(false);
                                setImg(undefined);
                                setCropState();
                            }}
                        />
                        {!completed ? (
                            <Button label="Done" onClick={() => doSomething()} />
                        ) : (
                            <Button
                                label='Submit'
                                onClick={() => {
                                    submit();
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        );
    }

    const onDragStop = useCallback((s) => setCropState(s), [])
    const onChange = useCallback((s) => setCropState(s), [])

    const doSomething = async () => {
        try {
            const res = await cropperRef.current.done({
                preview: true,
                filterCvParams: {
                    grayScale: false,
                    th: false,
                    thMode: window.cv.ADAPTIVE_THRESH_GAUSSIAN_C
                }
            })
            setCompleted(true);
        } catch (e) {
            console.error('error', e)
        }
    }

    const onImgSelection = async (e) => {
        setLoader(true);
        if (e.file) {
            // It can also be a http or base64 string for example
            setTimeout(() => {
                setLoader(false);
                setImg(e.file.originFileObj);
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
            <div className="col-12">
                <div className="card dialogDemo">
                    <h5 className='text-3xl font-bold'>PERSPECTIVE IMAGE CROPPING</h5>
                    <hr />
                    <Button label="Webcam" onClick={() => onClickOpenModal('displayPosition', 'top')} />
                    <Dialog className='dialogDemo' header="Perspective Image Cropping" maximizable visible={displayPosition} position={position} onHide={() => onHide('displayPosition')} breakpoints={{ '960px': '95vw' }} style={{ width: '50vw', height: img ? '100vw' : 'auto' }} footer={renderFooter('displayPosition')}>
                        {loader ? (
                            <div
                                className='py-4'
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
                            <div ref={webcamContainerRef}
                                className='py-4'
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Cropper
                                    // openCvPath='./CROP/opencv/opencv.js'
                                    ref={cropperRef}
                                    image={img}
                                    onChange={onChange}
                                    onDragStop={onDragStop}
                                    maxWidth={webcamContainerRef.current?.offsetWidth - 65}
                                    maxHeight={"100%"}
                                />
                            </div>
                        ) : null}
                        <div className='p-4'>
                            {selectUtil == "camera" ? (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    screenshotQuality={1}
                                    className="webcam"
                                />
                            ) : !img && !loader ? (
                                <Dragger {...draggerProps} >
                                    <p>
                                        <PlusOutlined />
                                    </p>
                                    <p>Upload</p>
                                </Dragger>
                            ) : null}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
