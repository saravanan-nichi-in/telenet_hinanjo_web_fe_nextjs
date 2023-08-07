import React from 'react'
import Canvas from '@/utils/js/crop/lib/Canvas'
import T from 'prop-types'

const Cropper = React.forwardRef((props, ref) => {
    if (!props.image) {
        return undefined
    }

    return (
        <Canvas {...props} cropperRef={ref} />
    )
})

Cropper.displayName = "Cropper";

export default Cropper;

Cropper.propTypes = {
    openCvPath: T.string
}