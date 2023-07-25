import React, { useState, useEffect } from 'react'
import { OpenCvProvider } from 'opencv-react'
import Canvas from './lib/Canvas'
import T from 'prop-types'

const Cropper = React.forwardRef((props, ref) => {
    // const [getRef, updateRef] = useState();
    if (!props.image) {
        console.log(props);
        return null
    }

    // useEffect(() => {
    //     if (ref) {
    //         updateRef(ref);
    //     }
    // }, [ref]);

    return (
        <OpenCvProvider openCvPath={props.openCvPath}>
            <Canvas {...props} cropperRef={ref} />
        </OpenCvProvider>
    )
})

export default Cropper

Cropper.propTypes = {
    openCvPath: T.string
}