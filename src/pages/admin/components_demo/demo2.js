import React, { useState, useEffect } from 'react';
import { TreeTable, RowExpansionTable, DND } from '@/components';
import { NodeService } from '@/helper/treeTableService';
import { ProductService } from '@/helper/rowExpandTableService';

export default function ComponentDemo() {
    const [nodes, setNodes] = useState([]);
    const [data, setData] = useState([]);

    const columns = [
        { field: 'name', header: 'Name', expander: true },
        { field: 'size', header: 'Type' },
        { field: 'type', header: 'Size' }
    ];

    const Outercolumn = [
        { field: "name", header: "name" },
        { field: "price", header: "Price" },
        { field: "description", header: "description" },
        { field: "category", header: "category" }
    ]

    const innerColumn = [
        { field: "productCode", header: "productCode" },
        { field: "date", header: "date" }
    ]

    const [products, setProducts] = useState([]);

    useEffect(() => {
        NodeService.getTreeTableNodes().then((data) => setNodes(data));
        let prepareData = [];
        for (let i = 1, len = 7; i < len; i++) {
            prepareData.push({
                title: `Data${i}`,
            });
        }
        setData(prepareData);
        ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));
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

    const handleMoveUp = (index) => {
        if (index > 0) {
            const items = [...data];
            const movedItem = items.splice(index, 1)[0];
            items.splice(index - 1, 0, movedItem);
            setData(items);
        }
    };

    const handleMoveDown = (index) => {
        if (index < data.length - 1) {
            const items = [...data];
            const movedItem = items.splice(index, 1)[0];
            items.splice(index + 1, 0, movedItem);
            setData(items);
        }
    };

    const map = (
        <ol>
            {data.map((item, index) => (
                <li key={index}>
                    {/* <InputSwitcher parentClass={"custom-switch mr-2"} checked={checked1} onChange={(e) => setChecked1(e.value)} /> */}
                    <button className="mr-4" onClick={() => handleMoveUp(index)}>▲</button>
                    <div className='xl:w-10 mr-4 '>
                        {item.title}
                    </div>
                    <a href="#" style={{ position: "inherit" }}>
                        drag
                    </a>
                    <button className="arrow-button ml-19rem" onClick={() => handleMoveDown(index)}>▼</button>

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
                            <TreeTable columns={columns} value={nodes} paginator="true" />
                        </div>
                        <div class="card">
                            <h2>Drag and Drop</h2>
                            <DND dragProps={dragProps}
                            >
                                {map}
                            </DND>
                        </div>
                        <div class="card">
                            <h2>Row expand table</h2>
                            <RowExpansionTable paginator="true" rows={3} value={products} innerColumn={innerColumn} outerColumn={Outercolumn} rowExpansionField="orders" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

