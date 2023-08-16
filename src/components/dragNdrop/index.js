import React from 'react';
import ReactDragListView from 'react-drag-listview';

const DND = (props) => {
    return (


        <div className="col-12 dargDrop_view">
            <div className="dargDrop_view-inner">
                <ReactDragListView {...props.dragProps}>
                    {props.map}
                </ReactDragListView>
            </div>
        </div>

    );
};

export default DND;
