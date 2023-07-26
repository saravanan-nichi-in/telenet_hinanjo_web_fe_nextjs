import React, { useState, useEffect } from 'react'
import Canvas from './lib/Canvas'
import T from 'prop-types'

const Cropper = React.forwardRef((props, ref) => {
    if (!props.image) {
        return undefined
    }

    return (
        <Canvas {...props} cropperRef={ref} />
    )
})

export default Cropper

Cropper.propTypes = {
    openCvPath: T.string
}