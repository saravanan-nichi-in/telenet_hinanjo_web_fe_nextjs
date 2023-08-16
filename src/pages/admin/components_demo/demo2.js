import React, { useState, useEffect } from 'react';
import TreeTab from '@/components/datatable/treeTable';
import { NodeService } from '@/helper/treeTableService';
import DND from '@/components/dragNdrop';
// import { Button } from 'antd/es/radio';
import CheckBox from '@/components/input/checkbox';
import InputSwitcher from '@/components/switch/inputSwitch';

export default function ComponentDemo() {
    const [nodes, setNodes] = useState([]);
    const [data, setData] = useState([]);
   
    const [checked1, setChecked1] = useState(false);
    const columns = [
        { field: 'name', header: 'Name', expander: true },
        { field: 'size', header: 'Type' },
        { field: 'type', header: 'Size' }
    ];
    useEffect(() => {
        NodeService.getTreeTableNodes().then((data) => setNodes(data));
        let prepareData = [];
        for (let i = 1, len = 7; i < len; i++) {
            prepareData.push({
                title: `Data${i}`,
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

    

const map= (
    <ol>
    {data.map((item, index) => (
        <li key={index}>
    <InputSwitcher parentClass={"custom-switch mr-2"} checked={checked1} onChange={(e) => setChecked1(e.value)} /> 

            {item.title}
            <a href="#">Drag</a>
        </li>
    ))}
    </ol>
)
    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className={"page_header"}
                        // borderBottom: "1px solid black",
                        >
                            不足物資一覧
                        </h5>

                        <div class="card">
                            <h2>Tree Table with pagination</h2>
                            <TreeTab columns={columns} value={nodes} paginator="true" />
                        </div>
                        <div class="card">
                            <h2>Drag and Drop</h2>
                           <DND dragProps={dragProps}
                                 map={map} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

