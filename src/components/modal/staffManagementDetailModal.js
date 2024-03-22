import React, { useEffect, useContext, useState } from "react";
import { Dialog } from "primereact/dialog";
import _ from "lodash";
import { TabView, TabPanel } from "primereact/tabview";

import {Button} from "../button";
import {
  getEnglishDateTimeDisplayActualFormat,
  getJapaneseDateTimeDayDisplayActualFormat,
  getJapaneseDateTimeDisplayActualFormat,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalTable } from "../datatable";
import { StaffManagementService } from "@/services/staffmanagement.service";
import { Button as Btn } from "primereact/button";

export default function StaffManagementDetailModal(props) {
  const { localeJson, locale } = useContext(LayoutContext);
  const { open, close } = props && props;
  const [staffDetail, setStaffDetail] = useState([]);
  const staffDetailData = [
    { field: "name", header: translate(localeJson, "name") },
    {
      field: "tel",
      header: translate(localeJson, "tel"),
      textAlign: "center",
      alignHeader: "center",
    },
  ];
  const columnsData = [
    { field: 'slno', header: translate(localeJson, 'staff_management_detail_login_history_slno'), className: "sno_class", textAlign: "center",alignHeader:"center" },
    { field: 'name', header: translate(localeJson, 'staff_management_detail_login_history_name'), maxWidth: "2rem" },
    { field: 'login_datetime', header: translate(localeJson, 'staff_management_detail_login_history_login_datetime'), maxWidth: "2rem" }];
  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
      // limit: 10,
    },
    id: props.staff,
  });
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  // Main Table listing starts
  const { show } = StaffManagementService;
  const getStaffList = () => {
    // Get dashboard list
    show(getListPayload, (response) => {
        if (response.success && !_.isEmpty(response.data)) {
            if (response.data.login_history.total > 0) {
                const data = response.data.login_history.list;
                var additionalColumnsArrayWithOldData = [...columnsData];
                let preparedList = [];
                // Update prepared list to the state
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        name: obj.name ?? "",
                        login_datetime: obj.login_datetime ? locale == "ja" ? getJapaneseDateTimeDisplayActualFormat(obj.login_datetime) : getEnglishDateTimeDisplayActualFormat(obj.login_datetime) : ""
                    }
                    preparedList.push(preparedObj);
                })
                setList(preparedList);
                setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.login_history.total);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setList([]);
            }
            if (response.data.model) {
                setStaffDetail([{ name: response.data.model.name, tel: response.data.model.tel }]);
            }
        } else {
            setTableLoading(false);
            setList([]);
        }
    });

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
      await setGetListPayload((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue,
        },
      }));
    }
  };

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await getStaffList();
    };
    fetchData();
  }, [locale, getListPayload, props.staff]);

  const header = (
    <>
      {translate(localeJson, "history_login_staff_management")}
    </>
  );

  return (
    <React.Fragment>
      <div>
        <Dialog
          className="new-custom-modal lg:w-6 md:w-9 sm:w-10"
          header={header}
          visible={open}
          draggable={false}
          blockScroll={true}
          onHide={() => close()}
          footer={
            <div className="text-center">
              <Button
                buttonProps={{
                  buttonClass: "w-8rem back-button",
                  text: translate(localeJson, "back"),
                  onClick: () => close(),
                }}
                parentClass={"inline back-button"}
              />
            </div>
          }
        >
          <div className={`modal-content staff_modal`}>
            <div>
              <div className="modal-header">
                {translate(localeJson, "detail_staff_management")}
              </div>
              <div className="modal-field-bottom-space">
                <NormalTable
                  loading={tableLoading}
                  tableStyle={{ maxWidth: "w-full" }}
                  showGridlines={"true"}
                  columnStyle={{ textAlign: "center" }}
                  customActionsField="actions"
                  value={staffDetail}
                  columns={staffDetailData}
                  emptyMessage={translate(localeJson, "data_not_found")}
                />
              </div>
              <div>
              <NormalTable
                        lazy
                        totalRecords={totalCount}
                        loading={tableLoading}
                        tableStyle={{ maxWidth: "w-full" }}
                        stripedRows={true}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        value={list}
                        columns={columns}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                        // paginator={true}
                        first={getListPayload.filters.start}
                        rows={getListPayload.filters.limit}
                        // paginatorLeft={true}
                        scrollable
                        scrollHeight="400px"
                        onPageHandler={(e) => onPaginationChange(e)}
                      />
              </div>
              <div className="text-center">
                <div className="modal-button-footer-space-back">
                  <Button
                    buttonProps={{
                      buttonClass: "w-full back-button",
                      text: translate(localeJson, "back"),
                      onClick: () => close(),
                    }}
                    parentClass={"inline back-button"}
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
