import React, { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const UploadFile = () => {
    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };
    return (
        <div>


            <Toast ref={toast}></Toast>
            <FileUpload mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="/*"
                maxFileSize={1000000}
                onUpload={onUpload}
            />

        </div>
    );
}
export default UploadFile