import React, { useRef } from 'react';
import { FileUpload as Upload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const FileUpload = (props) => {
    const { parentClass, parentStyle, id, uploadClass, style } = props;
    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <Toast ref={toast}></Toast>
            <Upload mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="/*"
                id={id}
                maxFileSize={1000000}
                onUpload={onUpload}
                className={`${uploadClass}`}
                style={style}
            />
        </div>
    );
}
export default FileUpload