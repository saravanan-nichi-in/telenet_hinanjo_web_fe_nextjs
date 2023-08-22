import React from 'react';
import ReactDragListView from 'react-drag-listview';

const DND = (props) => {
    return (


        <div className="col-12 dargDrop_view">
            <div className="dargDrop_view-inner">
                <ReactDragListView {...props.dragProps}>
                    {React.Children.map(props.children, (child, index) => (
                        <div key={index}>
                            {child}
                        </div>
                    ))}

                </ReactDragListView>
            </div>
        </div>

    );
};

export default DND;
