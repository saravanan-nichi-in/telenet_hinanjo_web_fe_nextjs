"use client";

import React from 'react';
import { Table, Pagination, Select } from "antd";

export default function DataTable(props) {
  const selectionType = "checkbox";

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      props.onSelectRow(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const [page, setPage] = React.useState(10);
  const [current, setCurrent] = React.useState(1);

  const handleChange = (value) => {
    setPage(value);
  };

  const onChangePage = (page) => {
    setCurrent(page);
  };

  const getPrevIcon = () =>{
    return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.6882 7.75811L4.1145 7.75811L7.40742 11.1852C7.59532 11.3813 7.70088 11.6474 7.70088 11.9248C7.70088 12.2022 7.59532 12.4682 7.40742 12.6644C7.21952 12.8605 6.96468 12.9707 6.69895 12.9707C6.43322 12.9707 6.17837 12.8605 5.99047 12.6644L1.0012 7.45602C0.910354 7.35696 0.839142 7.24014 0.791649 7.11227C0.691846 6.85867 0.691846 6.57421 0.791649 6.32061C0.839142 6.19274 0.910354 6.07592 1.0012 5.97686L5.99047 0.768526C6.08323 0.670893 6.1936 0.593396 6.31519 0.540512C6.43679 0.487629 6.56722 0.460402 6.69895 0.460402C6.83067 0.460402 6.9611 0.487629 7.0827 0.540512C7.20429 0.593396 7.31466 0.670893 7.40742 0.768526C7.50095 0.865362 7.57518 0.980571 7.62584 1.10751C7.6765 1.23444 7.70259 1.3706 7.70259 1.50811C7.70259 1.64562 7.6765 1.78177 7.62584 1.90871C7.57518 2.03565 7.50095 2.15085 7.40742 2.24769L4.1145 5.67477L11.6882 5.67477C11.9529 5.67477 12.2067 5.78452 12.3938 5.97987C12.5809 6.17522 12.6861 6.44017 12.6861 6.71644C12.6861 6.99271 12.5809 7.25766 12.3938 7.45301C12.2067 7.64836 11.9529 7.75811 11.6882 7.75811Z" fill="white"/>
    </svg>    
  }

  const nextIcon = () =>{
    return <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.89968 5.95869L9.47339 5.95869L6.18047 2.53161C5.99257 2.33546 5.88701 2.06942 5.88701 1.79202C5.88701 1.51463 5.99257 1.24859 6.18047 1.05244C6.36837 0.85629 6.62321 0.746094 6.88895 0.746094C7.15468 0.746094 7.40952 0.85629 7.59742 1.05244L12.5867 6.26077C12.6775 6.35984 12.7487 6.47666 12.7962 6.60452C12.896 6.85813 12.896 7.14258 12.7962 7.39619C12.7487 7.52406 12.6775 7.64087 12.5867 7.73994L7.59742 12.9483C7.50466 13.0459 7.3943 13.1234 7.2727 13.1763C7.1511 13.2292 7.02067 13.2564 6.88895 13.2564C6.75722 13.2564 6.62679 13.2292 6.50519 13.1763C6.3836 13.1234 6.27323 13.0459 6.18047 12.9483C6.08694 12.8514 6.01271 12.7362 5.96205 12.6093C5.91139 12.4824 5.88531 12.3462 5.88531 12.2087C5.88531 12.0712 5.91139 11.935 5.96205 11.8081C6.01271 11.6812 6.08694 11.5659 6.18047 11.4691L9.47339 8.04202L1.89968 8.04202C1.63503 8.04202 1.38122 7.93228 1.19409 7.73693C1.00695 7.54158 0.901822 7.27662 0.901822 7.00036C0.901822 6.72409 1.00695 6.45914 1.19409 6.26379C1.38122 6.06844 1.63503 5.95869 1.89968 5.95869Z" fill="white"/>
    </svg>    
  }

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <div class="flex bg-customBlue mt-[2px] rounded-md" style={{height:"30px"}}>
        <div class="flex-none pt-2 pl-4 pr-2">
          {getPrevIcon()}
        </div>
        <div class="flex-initial text-white pl-2 pr-4">
          {"前"}
        </div>
      </div>
    }
    if (type === 'next') {
      return <div class="flex bg-customBlue mt-[2px] rounded-md" style={{height:"30px"}}>
        <div class="flex-initial text-white pl-4 pr-2">
          {"次"}
        </div>
        <div class="flex-none pt-2 pl-2 pr-4">
          {nextIcon()}
        </div>
        
      </div>
    }
    return originalElement;
  };

  return (
    <main>
      <div>
        <Table
          rowSelection={ props?.rowSelectionFlag ? {
            type: selectionType,
            ...rowSelection,
          } : false}
          columns={props.columns}
          dataSource={props.dataSource}
          pagination={{
            pageSize: page,
            current: current,
            style: { display: "none" }
          }}
          sticky={true}
          scroll={{ x: '1400' }} // Adjust width and height as needed
          onRow={(record, rowIndex) => {
            return {
                onClick: event => {
                    event.stopPropagation();
                    props.onRowClick(record, rowIndex);
                },
            };
          }}
        />
        <div class="flex mt-2 float-right">
          <div class="flex-initial">
            <Select
                defaultValue={10}
                style={{ width: 80 }}
                onChange={handleChange}
                options={props.defaultPaeSizeOptions}
            />
          </div>
          <div class="flex-initial pl-2">
            <Pagination
                current={current}
                pageSize={page}
                onChange={onChangePage}
                total={props.dataSource.length}
                itemRender={itemRender}
              />
          </div>
        </div>
      </div>
    </main>
  );
}
