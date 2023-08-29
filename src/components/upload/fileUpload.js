import React, { useRef } from 'react';
import { FileUpload as Upload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const FileUpload = (props) => {
    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    return (
        <div className={`${props.parentClassName}`}>
            <Toast ref={toast}></Toast>
            <Upload mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="/*"
                id={props.id}
                maxFileSize={1000000}
                onUpload={onUpload}
                className={`${props.uploadClassName}`}
                style={props.style}
            />
        </div>
    );
}
export default FileUpload