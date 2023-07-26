'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from "react-webcam";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { fabric } from "fabric";
import './crop.module.css'
import Cropper from './react-cropper'
import { Spin, Upload } from 'antd'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'

const { Dragger } = Upload

const ImageCropper = () => {
    const webcamRef = useRef(null);
    const cropperRef = useRef();
    const [capturedImage, setCapturedImage] = useState(null);
    const [displayPosition, setDisplayPosition] = useState(false);
    const [position, setPosition] = useState('center');
    const webcamContainerRef = useRef(null);
    const [cropState, setCropState] = useState();
    const [img, setImg] = useState();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setCapturedImage(null);
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

    const captureImage = (name) => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    };

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        setImg(undefined);
        setCropState();
        setLoader(false);
    }

    const submit = (name) => {
        captureImage(name);
    }

    const reset = () => {
        setCapturedImage(null);
    }

    const renderFooter = (name) => {
        return (
            <div>
                {!cropState ? (
                    <>
                        <Button label="Submit" onClick={() => submit()} />
                    </>
                ) : (
                    <>
                        <Button label="Done" onClick={() => doSomething()} />
                        <Button label="Back" onClick={() => {
                            cropperRef.current.backToCrop()
                        }} />
                        <Button
                            label='Reset'
                            onClick={() => {
                                setImg(undefined);
                                setCropState();
                            }}
                        />
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
            console.log(res);
        } catch (e) {
            console.log('error', e)
        }
    }

    const onImgSelection = async (e) => {
        console.log(e);
        // if (e.target.files && e.target.files.length > 0) {
        //     // it can also be a http or base64 string for example
        //     setImg(e.target.files[0])
        // }
        setLoader(true);
        if (e.file) {
            // it can also be a http or base64 string for example
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
                                {/* {!capturedImage && (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    screenshotQuality={1}
                                    className="webcam"
                                />
                            )} */}
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
                        {!img && !loader && (
                            <div className='py-4'>
                                <Dragger {...draggerProps} >
                                    <p>
                                        <PlusOutlined />
                                    </p>
                                    <p>Upload</p>
                                </Dragger>
                            </div>
                        )}
                        {/* <input
                            type='file'
                            onChange={onImgSelection}
                            accept='image/*'
                        /> */}
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
