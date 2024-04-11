import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  getValueByKeyRecursively as translate,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getEnglishDateDisplayFormat,
  getGeneralDateTimeDisplayFormat,
  removeDuplicatesByKey,
  getYYYYMMDDHHSSSSDateTimeFormat,
} from "@/helper";
import { Button, Calendar, CustomHeader, NormalTable, Input, InputDropdown } from "@/components";
import { StockpileHistoryServices } from "@/services";

function StockpileHistory() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  // Getting storage data with help of reducers
  const layoutReducer = useSelector((state) => state.layoutReducer);

  const [inspectionDateTime, setInspectionDateTime] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [productType, setProductType] = useState("");
  const [productNames, setProductNames] = useState([]);
  const [productName, setProductName] = useState("");
  const [inCharge, setInCharge] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [getHistoryListPayload, setGetHistoryListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      order_by: "",
    },
    place_id: !_.isNull(layoutReducer?.user?.place?.id)
      ? layoutReducer?.user?.place?.id
      : "",
    Inspection_date_time: "",
    category: "",
    product_name: "",
    incharge: "",
  });

  const columnsData = [
    {
      field: "number",
      header: translate(localeJson, "s_no"),
      headerClassName: "custom-header",
      className: "sno_class",
      textAlign: "center",
    },
    {
      field: "created_at",
      header: translate(localeJson, "working_date"),
      headerClassName: "custom-header",
      minWidth: "7rem",
      textAlign: "left",
    },
    {
      field: "inspection_date_time",
      header: translate(localeJson, "inventory_date"),
      headerClassName: "custom-header",
      minWidth: "9rem",
      textAlign: "left",
    },
    {
      field: "category",
      header: translate(localeJson, "product_type"),
      headerClassName: "custom-header",
      sortable: true,
      minWidth: "5rem",
      textAlign: "left",
    },
    {
      field: "product_name",
      header: translate(localeJson, "product_name"),
      headerClassName: "custom-header",
      minWidth: "7rem",
      textAlign: "left",
    },
    {
      field: "before_count",
      header: translate(localeJson, "quantity_before"),
      headerClassName: "custom-header",
      minWidth: "5rem",
      textAlign: "center",
      alignHeader: "center",
    },
    {
      field: "after_count",
      header: translate(localeJson, "quantity_after"),
      headerClassName: "custom-header",
      minWidth: "5rem",
      textAlign: "center",
      alignHeader: "center",
    },
    {
      field: "incharge",
      header: translate(localeJson, "confirmer"),
      headerClassName: "custom-header",
      minWidth: "5rem",
      textAlign: "left",
    },
    {
      field: "expiry_date",
      header: translate(localeJson, "expiry_date"),
      headerClassName: "custom-header",
      minWidth: "9rem",
      textAlign: "left",
    },
    {
      field: "remarks",
      header: translate(localeJson, "remarks"),
      headerClassName: "custom-header",
      textAlign: "left",
      minWidth: "5rem",
    },
  ];

  /* Services */
  const { getProductTypes, getProductNames, getHistoryList, exportStockpileHistoryCSVList } = StockpileHistoryServices;

  useEffect(() => {
    const fetchData = async () => {
      await retrieveProductTypes();
      await retrieveProductNames();
    };
    fetchData();
  }, [locale]);

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      retrieveHistoryList();
    };
    fetchData();
  }, [locale, getHistoryListPayload]);

  /**
   * Retrieve product types
   */
  const retrieveProductTypes = () => {
    let payload = {
      place_id: !_.isNull(layoutReducer?.user?.place?.id)
        ? layoutReducer?.user?.place?.id
        : "",
    };
    getProductTypes(payload, (response) => {
      let productTypesArray = [
        {
          name: "--",
          product_name: "",
          category: "",
        },
      ];
      if (response.data && response.data.data) {
        const data = response.data.data;
        data.map((obj, i) => {
          let preparedObj = {
            name: obj.category,
            product_name: obj.product_name,
            category: obj.category,
          };
          productTypesArray.push(preparedObj);
        });
      }
      setProductTypes(removeDuplicatesByKey(productTypesArray, "name"));
    });
  };

  /**
   * Retrieve product names
   */
  const retrieveProductNames = () => {
    let payload = {
      place_id: !_.isNull(layoutReducer?.user?.place?.id)
        ? layoutReducer?.user?.place?.id
        : "",
    };
    getProductNames(payload, (response) => {
      let productNamesArray = [
        {
          name: "--",
          product_id: "",
          category: "",
          product_name: "",
        },
      ];
      if (response.data && response.data.model) {
        const data = response.data.model;
        data.map((obj, i) => {
          let preparedObj = {
            name: obj.product_name,
            product_id: obj.product_id,
            category: obj.category,
            product_name: obj.product_name,
          };
          productNamesArray.push(preparedObj);
        });
      }
      setProductNames(removeDuplicatesByKey(productNamesArray, "name"));
    });
  };

  /**
   * Get history list
   */
  const retrieveHistoryList = () => {
    getHistoryList(getHistoryListPayload, onGetHistoryList);
  };

  /**
   * Function will get data & update history list
   * @param {*} response
   */
  const onGetHistoryList = (response) => {
    var additionalColumnsArrayWithOldData = [...columnsData];
    var preparedList = [];
    var totalCount;
    if (
      response.success &&
      !_.isEmpty(response.data) &&
      response.data.total > 0
    ) {
      const data = response.data.list;
      // Preparing row data for specific column to display
      data.map((obj, i) => {
        let preparedObj = {
          number: getHistoryListPayload.filters.start + i + 1,
          created_at: obj.created_at
            ? locale == "ja"
              ? getJapaneseDateDisplayYYYYMMDDFormat(obj.created_at)
              : getEnglishDateDisplayFormat(obj.created_at)
            : "",
          inspection_date_time: obj.Inspection_date_time
            ? locale == "ja"
              ? getJapaneseDateDisplayYYYYMMDDFormat(obj.Inspection_date_time)
              : getEnglishDateDisplayFormat(obj.Inspection_date_time)
            : "",
          category: obj.category,
          product_name: obj.product_name,
          before_count: obj.before_count,
          after_count: obj.after_count,
          incharge: obj.incharge,
          expiry_date: obj.expiry_date
            ? locale == "ja"
              ? getJapaneseDateDisplayYYYYMMDDFormat(obj.expiry_date)
              : getEnglishDateDisplayFormat(obj.expiry_date)
            : "",
          remarks: obj.remarks,
        };
        preparedList.push(preparedObj);
      });
      // Update total count
      totalCount = response.data.total;
    }

    setColumns(additionalColumnsArrayWithOldData);
    setList(preparedList);
    setTotalCount(totalCount);
    setTableLoading(false);
    setLoader(false);
  };

  /**
   * Search functionality
   */
  const onSearchButtonClick = async () => {
    setTableLoading(true);
    await setGetHistoryListPayload((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        start: 0,
      },
      place_id: !_.isNull(layoutReducer?.user?.place?.id)
        ? layoutReducer?.user?.place?.id
        : "",
      Inspection_date_time: inspectionDateTime
        ? getGeneralDateTimeDisplayFormat(inspectionDateTime)
        : "",
      category: productType.category,
      product_name: productName.product_name,
      incharge: inCharge,
    }));
  };

  /**
   * Pagination handler
   * @param {*} e
   */
  const onPaginationChange = async (e) => {
    setTableLoading(true);
    if (!_.isEmpty(e)) {
      const newStartValue = e.first; // Replace with your desired page value
      const newLimitValue = e.rows; // Replace with your desired limit value
      await setGetHistoryListPayload((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue,
        },
      }));
    }
  };

  const downloadStockpileHistoryListCSV = () => {
    exportStockpileHistoryCSVList(getHistoryListPayload, exportStockpileHistoryCSV);
  }

  const exportStockpileHistoryCSV = (response) => {
    if (response.success) {
      const downloadLink = document.createElement("a");
      const fileName = "Stockpile_History_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
      downloadLink.href = response.result.filePath;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <CustomHeader
            headerClass={"page-header1"}
            header={translate(localeJson, "stockpile_history")}
          />
          <div>
            <div>
              <form>
                <div className="flex justify-content-end align-items-end flex-wrap">
                  <Button
                    buttonProps={{
                      type: "button",
                      rounded: "true",
                      export: true,
                      buttonClass: "evacuation_button_height export-button",
                      text: translate(localeJson, "export"),
                      onClick: () => downloadStockpileHistoryListCSV(),
                    }}
                    parentClass={"mr-1 mt-1 export-button"}
                  />
                </div>
                <div className="modal-field-top-space modal-field-bottom-space flex flex-wrap float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input">
                  <Calendar
                    calendarProps={{
                      calendarParentClassName:
                        "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                      labelProps: {
                        text: translate(localeJson, "inventory_date"),
                        calendarLabelClassName: "block",
                      },
                      calendarClassName: "w-full",
                      name: "inventoryDate",
                      id: "inventoryDate",
                      // placeholder: "yyyy-mm-dd",
                      value: inspectionDateTime,
                      onChange: (e) => setInspectionDateTime(e.target.value),
                    }}
                  />
                  <InputDropdown
                    inputDropdownProps={{
                      inputDropdownParentClassName:
                        "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                      labelProps: {
                        text: translate(localeJson, "product_type"),
                        inputDropdownLabelClassName: "block",
                      },
                      inputDropdownClassName:
                        "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                      customPanelDropdownClassName: "w-10rem",
                      options: productTypes,
                      optionLabel: "name",
                      value: productType,
                      onChange: (e) => setProductType(e.target.value),
                      emptyMessage: translate(localeJson, "data_not_found"),
                    }}
                  />
                  <InputDropdown
                    inputDropdownProps={{
                      inputDropdownParentClassName:
                        "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                      labelProps: {
                        text: translate(localeJson, "product_name"),
                        inputDropdownLabelClassName: "block",
                      },
                      inputDropdownClassName:
                        "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                      customPanelDropdownClassName: "w-10rem",
                      options: productNames,
                      optionLabel: "name",
                      value: productName,
                      onChange: (e) => setProductName(e.target.value),
                      emptyMessage: translate(localeJson, "data_not_found"),
                    }}
                  />
                  <Input
                    inputProps={{
                      inputParentClassName:
                        "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                      labelProps: {
                        text: translate(localeJson, "confirmer"),
                        inputLabelClassName: "block",
                      },
                      inputClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                      value: inCharge,
                      onChange: (e) => setInCharge(e.target.value),
                    }}
                  />
                  <div className="flex align-items-end">
                    <Button
                      buttonProps={{
                        buttonClass: "w-12 search-button",
                        text: translate(localeJson, "search_text"),
                        icon: "pi pi-search",
                        type: "button",
                        onClick: () => onSearchButtonClick(),
                      }}
                      parentClass={"search-button"}
                    />
                  </div>

                </div>
              </form>
              <div className="mt-3">
                <NormalTable
                  lazy
                  totalRecords={totalCount}
                  loading={tableLoading}
                  stripedRows={true}
                  className={"custom-table-cell"}
                  showGridlines={"true"}
                  value={list}
                  columns={columns}
                  filterDisplay="menu"
                  emptyMessage={translate(localeJson, "data_not_found")}
                  paginator={_.size(list) > 0 ? true : false}
                  first={getHistoryListPayload.filters.start}
                  rows={getHistoryListPayload.filters.limit}
                  paginatorLeft={true}
                  onPageHandler={(e) => onPaginationChange(e)}
                  onSort={(data) => {
                    setTableLoading(true);
                    setGetHistoryListPayload({
                      ...getHistoryListPayload,
                      filters: {
                        ...getHistoryListPayload.filters,
                        order_by:
                          getHistoryListPayload.filters.order_by === "desc"
                            ? "asc"
                            : "desc",
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockpileHistory;
