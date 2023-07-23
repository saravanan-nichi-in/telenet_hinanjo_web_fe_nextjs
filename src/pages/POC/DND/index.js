import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDragListView from 'react-drag-listview';

const DND = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Drag & Drop
        let prepareData = [];
        for (let i = 1, len = 7; i < len; i++) {
            prepareData.push({
                title: `Rows${i}`
            });
        }
        setData(prepareData);
    }, []);

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const prepareData = [...data];
            const item = prepareData.splice(fromIndex, 1)[0];
            prepareData.splice(toIndex, 0, item);
            setData(prepareData);
        },
        nodeSelector: 'li',
        handleSelector: 'a'
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5 className='text-3xl font-bold'>DRAG AND DROP</h5>
                    <div className="col-12 simple1">
                        <div className="simple-inner">
                            <ReactDragListView {...dragProps}>
                                <ol>
                                    {data.map((item, index) => (
                                        <li key={index}>
                                            {item.title}
                                            <a href="#">Drag</a>
                                        </li>
                                    ))}
                                </ol>
                            </ReactDragListView>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DND;
