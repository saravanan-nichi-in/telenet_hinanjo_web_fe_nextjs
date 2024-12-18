import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import {
  hideOverFlow,
  showOverFlow,
  getValueByKeyRecursively as translate
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, DetailModal, NormalTable } from '@/components';
import { ShortageSuppliesServices } from '@/services';

function HQShortageSupplies() {
  const { locale, localeJson } = useContext(LayoutContext);

  const [tableLoading, setTableLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [frozenArray, setFrozenArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "",
      order_by: "",
    },
    search: "",
  });

  const memoIcon = {
    url: "/layout/images/memo.svg",
  };

  const columnsData = [
    {
      field: 'evacuation_place', header: "", minWidth: '15rem', maxWidth: "15rem", headerClassName: "custom-header", textAlign: 'left'
      , body: (rowData) => {
        return (
          <div className='font-bold' style={{ fontSize: "16px" }}>{rowData.evacuation_place}</div>
        )
      }
    },
  ]

  /* Services */
  const { callExport, getList } = ShortageSuppliesServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await loadShortageSuppliesList();
    };
    fetchData();
  }, [locale, getListPayload]);

  /**
   * Load shortage supplies list
  */
  const loadShortageSuppliesList = () => {
    // Get shortage supplies list
    getList(getListPayload, onloadShortageSuppliesListDone);
  }

  /**
   * Function will get data & update shortage supplies list
   * @param {*} response 
   */
  const onloadShortageSuppliesListDone = (response) => {
    var additionalColumnsArrayWithOldData = [...columnsData];
    var frozenObj = [];
    var preparedList = [];
    var listTotalCount = 0;
    if (response.success && !_.isEmpty(response.data)) {
      const dynamicColumns = response.data.supplies;
      const data = response.data.supplyInfo;
      const totalCountList = response.data.totalCount;
      var additionalColumnsKeys = [];
      // Prepare table dynamic columns
      if (dynamicColumns) {
        dynamicColumns.map((obj, i) => {
          let preparedColumnObjToMerge = {
            field: obj.id,
            header: (
              <div className="table_header_flexColumn">
                <div>{obj.name}</div>
                {obj.unit && <div>{`( ${obj.unit} )`}</div>}
              </div>
            ),
            minWidth: "10rem",
            headerClassName: "custom-header",
            textAlign: "center",
            alignHeader: "center",
          };
          additionalColumnsKeys.push(preparedColumnObjToMerge.field);
          additionalColumnsArrayWithOldData.push(preparedColumnObjToMerge);
        });
      }
      let demoCol = {
        field: "demo_note",
        header: translate(localeJson, "others_memo"),
        minWidth: "5rem",
        maxWidth: "5rem",
        headerClassName: "custom-header",
        textAlign: "center",
        alignHeader: "center",
      };
      additionalColumnsArrayWithOldData.push(demoCol);
      // Preparing row data for specific column to display
      data.map((obj, i) => {
        let preparedObj = {
          evacuation_place: (
            <div>
              {locale === "en" && !_.isNull(obj.place_name_en)
                ? obj.place_name_en
                : obj.place_name}
            </div>
          ),
          demo_note: (
            <div
              className={
                obj.note || obj.comment
                  ? "text-higlight clickable-row"
                  : "clickable-row"
              }
              onClick={() => onClickEvacuationPlace(obj)}
            >
              {(obj.note || obj.comment) ? <img src={memoIcon.url} /> : ""}
            </div>
          ),
        };
        dynamicColumns.map((objSub, i) => {
          preparedObj[objSub.id] = `${obj.supply[objSub.id]}`;
        });
        preparedList.push(preparedObj);
      });
      // Update frozen data
      let preparedFrozenObj = {
        evacuation_place: translate(localeJson, "shortage_total"),
      };
      additionalColumnsKeys.map((frozenObjSub, i) => {
        preparedFrozenObj[frozenObjSub] = `${totalCountList[frozenObjSub]}`;
      });
      frozenObj = [preparedFrozenObj];
      listTotalCount = response.data.total;
    }
    setTableLoading(false);
    setColumns(additionalColumnsArrayWithOldData);
    setFrozenArray(frozenObj);
    setList(preparedList);
    setTotalCount(listTotalCount);
  }

  const rowClassName = (rowData) => {
    return (rowData.evacuation_place === '不足合計' || rowData.evacuation_place == 'Shortage Total') ? 'common_table_bg' : "";
  }

  /**
   * Evacuation place on click display comment & note information
   * @param {*} rowData 
   */
  const onClickEvacuationPlace = (rowData) => {
    setSelectedRow(rowData);
    setShowModal(true);
    document.body.classList.add('dialog-open'); // Add class to block scroll
    hideOverFlow();
  }

  /**
   * Pagination handler
   * @param {*} e 
   */
  const onPaginationChange = async (e) => {
    setTableLoading(true);
    if (!_.isEmpty(e)) {
      const newStartValue = e.first; // Replace with your desired page value
      const newLimitValue = e.rows; // Replace with your desired limit value
      await setGetListPayload(prevState => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue
        }
      }));
    }
  }

  return (
    <React.Fragment>
      <DetailModal detailModalProps={{
        headerContent: locale === "en" && selectedRow?.place_name_en ? selectedRow.place_name_en : selectedRow?.place_name,
        visible: showModal,
        style: { width: '600px' },
        position: 'center',
        onHide: () => {
          setShowModal(false);
          document.body.classList.remove('dialog-open'); // Remove class to enable scroll
          showOverFlow();
        },
        note: selectedRow && selectedRow.note ? selectedRow.note : translate(localeJson, 'not'),
        comment: selectedRow && selectedRow.comment ? selectedRow.comment : translate(localeJson, 'not')
      }} />
      <div className="grid">
        <div className="col-12">
          <div className='card'>
            <div>
              <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "shortage_supplies_list")} />
            </div>
            <div className="col-12 custom-table">
              <div className="flex justify-content-end ">
                <Button buttonProps={{
                  type: 'submit',
                  rounded: "true",
                  export: true,
                  buttonClass: "evacuation_button_height export-button",
                  text: translate(localeJson, 'export'),
                  onClick: () => callExport()
                }} parentClass={"mb-3 export-button"} />
              </div>
              <NormalTable
                lazy
                totalRecords={totalCount}
                loading={tableLoading}
                stripedRows={true}
                className={"custom-table-cell"}
                showGridlines={"true"}
                rowClassName={rowClassName}
                value={list}
                frozenValue={_.size(list) > 0 && frozenArray}
                columns={columns}
                filterDisplay="menu"
                emptyMessage={translate(localeJson, "data_not_found")}
                paginator={true}
                first={getListPayload.filters.start}
                rows={getListPayload.filters.limit}
                paginatorLeft={true}
                onPageHandler={(e) => onPaginationChange(e)}
                parentClass={"custom-table-shortage-supplies-list"}
              />
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default HQShortageSupplies;