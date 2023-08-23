import React, { useRef } from 'react';
import { FileUpload as Upload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const FileUpload = () => {
    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    return (
        <div>
            <Toast ref={toast}></Toast>
            <Upload mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="/*"
                maxFileSize={1000000}
                onUpload={onUpload}
            />
        </div>
    );
}
export default FileUpload