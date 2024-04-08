import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import _ from "lodash";

import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  getValueByKeyRecursively as translate,
  getJapaneseDateTimeDisplayActualFormat,
  getEnglishDateTimeDisplayFormat,
} from "@/helper";
import { NormalTable } from "@/components";
import { UserDashboardServices, UserEventListServices } from "@/services";
import { useAppDispatch } from "@/redux/hooks";
import { setUserDetails } from "@/redux/layout";
import CustomHeader from "@/components/customHeader";

export default function EventList() {
  const { locale, localeJson } = useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Getting storage data with help of reducers
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const { getEventListByID } = UserDashboardServices;
  const columnsData = [
    {
      field: "number",
      header: translate(localeJson, "event_list_column_header_slno"),
      headerClassName: "custom-header",
      className: "sno_class",
      textAlign: "center",
    },
    {
      field: "name",
      header: translate(localeJson, "event_list_column_header_name"),
      headerClassName: "custom-header",
      minWidth: "6rem",
      sortable: true,
      alignHeader: "left",
      body: (rowData) => {
        return (
          <div className="flex flex-column">
            <div className="custom-header">{rowData.name}</div>
            <div>{rowData.address_place}</div>
          </div>
        );
      },
    },
    {
      field: "start_date",
      header: translate(localeJson, "event_list_column_header_start_date"),
      headerClassName: "custom-header",
      minWidth: "6rem",
      textAlign: "left",
      alignHeader: "left",
      sortable: true,
    },
    {
      field: "end_date",
      header: translate(localeJson, "event_list_column_header_end_date"),
      headerClassName: "custom-header",
      textAlign: "left",
      alignHeader: "left",
      minWidth: "6rem",
      sortable: true,
    },
    {
      field: "is_q_active",
      header: translate(localeJson, "status_public_evacuees"),
      headerClassName: "custom-header",
      textAlign: "center",
      alignHeader: "center",
    },
  ];
  const [getEventsListPayload, setEventsListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "name",
      order_by: "asc",
    },
    search: "",
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  /* Services */
  const { getEventsList } = UserEventListServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await getPublicEventsList();
    };
    fetchData();
  }, [locale, getEventsListPayload]);

  /**
   * Get public events list
   */
  const getPublicEventsList = () => {
    getEventsList(getEventsListPayload, onGetPublicEventsList);
  };

  /**
   * Function will get data & update events list
   * @param {*} response
   */
  const onGetPublicEventsList = (response) => {
    var additionalColumnsArrayWithOldData = [...columnsData];
    var preparedList = [];
    var preparedTotalCount = 0;
    if (
      response.success &&
      !_.isEmpty(response.data) &&
      response.data.model.total > 0
    ) {
      const data = response.data.model.list;
      // Preparing row data for specific column to display
      if (data.length > 0) {
        data.map((obj, i) => {
          let preparedObj = {
            ...obj,
            number: getEventsListPayload.filters.start + i + 1,
            start_date:
              locale === "ja"
                ? getJapaneseDateTimeDisplayActualFormat(obj.start_date)
                : getEnglishDateTimeDisplayFormat(obj.start_date),
            end_date:
              locale === "ja"
                ? getJapaneseDateTimeDisplayActualFormat(obj.end_date)
                : getEnglishDateTimeDisplayFormat(obj.end_date),
            name: (
              <div
                className={
                  "text-highlighter-user-list " +
                  (obj.is_q_active == 1 ? "clickable-row" : "")
                }
              >
                {locale === "en" && !_.isNull(obj.name_en)
                  ? obj.name_en
                  : obj.name}
              </div>
            ),
            name_en: obj.name_en,
            remarks: obj.remarks,
            is_q_active: action(obj),
            is_q_active_value: obj.is_q_active,
            entireObj: obj,
          };
          preparedList.push(preparedObj);
        });
      }
      preparedTotalCount = response.data.model.total;
    }

    setColumns(additionalColumnsArrayWithOldData);
    setEventList(preparedList);
    setTotalCount(preparedTotalCount);
    setTableLoading(false);
  };

  /**
   * Action column for dashboard list
   * @param {*} obj
   * @returns view
   */
  const action = (obj) => {
    return (
      <div className={`flex justify-content-center`}>
        <div
          className={`${obj.is_q_active
            ? "border-circle userListActive mr-2"
            : "border-circle userListNotActive mr-2"
            }`}
        ></div>
        <div className="line-height-1">{translate(localeJson, "active")}</div>
      </div>
    );
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
      await setEventsListPayload((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue,
        },
        search: "",
      }));
    }
  };

  return (
    <div>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <CustomHeader
              headerClass={"page-header1"}
              header={translate(localeJson, "event_list_main_header")}
            />
            <div className="mt-3">
              <NormalTable
                lazy
                totalRecords={totalCount}
                loading={tableLoading}
                stripedRows={true}
                className={"custom-table-cell"}
                value={eventList}
                columns={columns}
                filterDisplay="menu"
                emptyMessage={translate(localeJson, "data_not_found")}
                paginator={true}
                first={getEventsListPayload.filters.start}
                rows={getEventsListPayload.filters.limit}
                paginatorLeft={true}
                tableStyle={{ minWidth: "70rem" }}
                onPageHandler={(e) => onPaginationChange(e)}
                selectionMode="single"
                // Development
                // Row Hover only for active flag
                //  rowClassName={(rowData) => {
                //     return rowData.entireObj.is_q_active ? "" : "bg:white hover:bg-white pointer-events-none";
                // }}
                onSelectionChange={(e) => {
                  if (e.value) {
                    if (e.value.is_q_active_value == 1) {
                      let payload = {
                        event_id: e.value.id
                    }
                    getEventListByID(payload, (response) => {
                      if (response && response.data) {
                      let obj = response.data.model;
                      if(obj.is_q_active=="1")
                      {
                      let payload = Object.assign({}, layoutReducer?.user);
                      payload["place"] = e.value.entireObj;
                      payload["event"] = e.value.entireObj;
                      dispatch(setUserDetails(payload));
                      localStorage.setItem("redirect", "/user/event-list");
                      router.push("/user/dashboard");
                        }
                        else {
                          getEventsList(getEventsListPayload, onGetPublicEventsList);
                        }
                      }
                      })
                    }
                  }
                }}
                onSort={(data) => {
                  setEventsListPayload({
                    ...getEventsListPayload,
                    filters: {
                      ...getEventsListPayload.filters,
                      sort_by: data.sortField,
                      order_by: getEventsListPayload.filters.order_by === 'desc' ? 'asc' : 'desc'
                    }
                  }
                  )
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}