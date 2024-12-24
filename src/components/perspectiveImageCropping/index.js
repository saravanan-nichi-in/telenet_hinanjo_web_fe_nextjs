'use client'

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from "@/components";
import Cropper from '@/components/perspectiveCropping/cropper';

export const PerspectiveImageCropping = (props) => {
    const cropperRef = useRef();
    const [cropState, setCropState] = useState();
    const [img, setImg] = useState(props.base64Image || ""); // Accept base64 image through props
    const [completed, setCompleted] = useState(false);
    const [rotateAngel, setRotateAngel] = useState(0);
    const [result, setResult] = useState("");

    useEffect(() => {
        if (props.base64Image) {
            setImg(props.base64Image);
        }
    }, [props.base64Image]);

    const renderFooter = () => {
        return (
            <div className={`${!cropState ? 'footer-view' : 'footer-view1'} `}>
                <Button
                    parentStyle={{ display: "inline" }}
                    buttonProps={{
                        type: "button",
                        style: {
                            backgroundColor: "var(--red-500)",
                            borderColor: "var(--red-500)"
                        },
                        icon: "Reset",
                        buttonClass: "px-3",
                        onClick: () => {
                            setCompleted(false);
                            setImg(props.base64Image);
                            setCropState();
                            setRotateAngel(0);
                            setResult("");
                        },
                    }}
                />
                <div>
                    {!cropState ? (
                        <Button
                            parentStyle={{ display: "inline" }}
                            buttonProps={{
                                type: "button",
                                text: "Process",
                                buttonClass: "px-3 mt-2",
                                style: {
                                    backgroundColor: "var(--gray-700)",
                                    borderColor: "var(--gray-700)"
                                },
                                onClick: () => {
                                    processImage();
                                },
                            }}
                        />
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
                                    props.callback(result);
                                    setCompleted(true);
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        );
    };

    const onDragStop = useCallback((s) => setCropState(s), []);
    const onChange = useCallback((s) => setCropState(s), []);

    const processImage = async () => {
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
                    const img = new Image();

                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        const pngDataUrl = canvas.toDataURL('image/png');
                        setResult(pngDataUrl);
                    };

                    img.src = base64Data;
                };

                reader.readAsDataURL(blob);
            }

            setCompleted(true);
        } catch (e) {
            console.error('error', e);
        }
    };

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
                    setCompleted(false);
                    setImg(props.base64Image);
                    setCropState();
                    setResult("");
                    setRotateAngel(0);
                }}
                footer={renderFooter()}
                className="custom-modal ocr-modal m-0 sm:m-2 lg:m-2 md:m-2"
                modal
                contentStyle={{ overflow: 'hidden' }}
            >
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
                    {img ? (
                        <Cropper
                            ref={cropperRef}
                            image={img}
                            onChange={onChange}
                            onDragStop={onDragStop}
                            maxWidth="300"
                            maxHeight="450"
                            pointBgColor={"var(--primary-color)"}
                            pointBorder={"var(--primary-color)"}
                        />
                    ) : (
                        <p>No image provided</p>
                    )}
                </div>
            </Dialog>
        </div>
    );
};
