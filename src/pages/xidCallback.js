import React from 'react';

const XidCallBack = () => {
    const style = {
        height: '100vh',          // Full view height
        display: 'flex',          // Use Flexbox
        justifyContent: 'center', // Center horizontally
        alignItems: 'center',      // Center vertically
        fontSize: '25PX',
    };

    return (
        <div style={style}>XID TESTING, BOOM !!!</div>
    );
};

XidCallBack.getLayout = function getLayout(page) {
    return page;
};

export default XidCallBack;
