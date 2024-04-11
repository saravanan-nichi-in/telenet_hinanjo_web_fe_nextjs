import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import _ from "lodash";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { CustomHeader, NormalTable } from "@/components";
import { UserPlaceListServices } from "@/services";
import { useAppDispatch } from "@/redux/hooks";
import { setUserDetails } from "@/redux/layout";

export default function PublicEvacuees() {
  const { locale, localeJson } = useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Getting storage data with help of reducers
  const layoutReducer = useSelector((state) => state.layoutReducer);

  const [tableLoading, setTableLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "refugee_name",
      order_by: "asc",
    },
    search: "",
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
      field: "refugee_name",
      header: translate(localeJson, "place_name_list"),
      sortable: true,
      alignHeader: "left",
      body: (rowData) => {
        return (
          <div className="flex flex-column">
            <div className="custom-header">{rowData.refugee_name}</div>
            <div className="table-body-sub">{rowData.address_place}</div>
          </div>
        );
      },
    },
    {
      field: "total_person",
      header: translate(localeJson, "place_capacity"),
      headerClassName: "custom-header",
      minWidth: "6rem",
      sortable: false,
      textAlign: "center",
      alignHeader: "center",
    },
    {
      field: "total_place",
      header: translate(localeJson, "capacity_limit"),
      headerClassName: "custom-header",
      minWidth: "6rem",
      sortable: false,
      textAlign: "center",
      alignHeader: "center",
    },
    {
      field: "percent",
      header: translate(localeJson, "accommodation_status_p"),
      headerClassName: "custom-header",
      minWidth: "6rem",
      sortable: false,
      textAlign: "center",
      alignHeader: "center",
    },
    {
      field: "active_flg",
      header: translate(localeJson, "status_public_evacuees"),
      headerClassName: "custom-header",
      textAlign: "center",
      sortable: false,
      alignHeader: "center",
    },
  ];

  /* Services */
  const { getList, getActiveList } = UserPlaceListServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await getPublicEvacueesList();
    };
    fetchData();

    // Development
    // Listening for messages from the popup
    // window.addEventListener("message", (event) => {
    //   if (event.origin === window.origin) {
    //     const receivedData = event.data;
    // console.warn("Received from popup:", receivedData);
    //   }
    // });
  }, [locale, getListPayload]);

  /**
   * Get public evacuees list
   */
  const getPublicEvacueesList = () => {
    let payload = {
      filters: {
        start: getListPayload.filters.start,
        limit: getListPayload.filters.limit,
        sort_by: getListPayload.filters.sort_by,
        order_by: getListPayload.filters.order_by,
      },
      search: "",
    };
    getList(payload, onGetPublicEvacueesList);
  };

  /**
   * Function will get data & update dashboard list
   * @param {*} response
   */
  const onGetPublicEvacueesList = (response) => {
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
            number: getListPayload.filters.start + i + 1,
            refugee_name: (
              <div
                className={`${obj.active_flg
                  ? "text-highlighter-user-list clickable-row"
                  : "bg-gray"
                  }`}
              >
                {locale === "en" && !_.isNull(obj.name_en)
                  ? obj.name_en
                  : obj.name}
              </div>
            ),
            address_place: obj.address_place,
            total_person: obj.total_person,
            total_place: obj.total_place,
            percent:
              obj.full_status == 1
                ? "100%"
                : obj.percent > 100
                  ? "100%"
                  : `${obj.percent}%`,
            active_flg: action(obj),
            entire_data: obj,
          };
          preparedList.push(preparedObj);
        });
      }
      preparedTotalCount = response.data.model.total;
    }

    setTableLoading(false);
    setColumns(additionalColumnsArrayWithOldData);
    setList(preparedList);
    setTotalCount(preparedTotalCount);
  };

  /**
   * Place name callback function
   * @param {*} obj
   * @returns
   */
  const onClickPlaceName = async (obj) => {
    if (obj) {
      let payload = Object.assign({}, layoutReducer?.user);
      payload["place"] = obj;
      await dispatch(setUserDetails(payload));
      router.push("/user/dashboard");
    }
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
          className={`${obj.active_flg
            ? "border-circle userListActive mr-2"
            : "border-circle userListNotActive mr-2"
            }`}
        ></div>
        <div className="line-height-1">
          {obj.active_flg
            ? translate(localeJson, "active")
            : translate(localeJson, "inactive")}
        </div>
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
      await setGetListPayload((prevState) => ({
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
              header={translate(
                localeJson,
                "evacuation_center_management_system_list"
              )}
            />
            {/* Development */}
            {/* <button className="p-5 mt-2" onClick={() => {
                            const popupWidth = screen.width;
                            const popupHeight = screen.height;
                            const popup = window.open(`${window.origin}/user/event-list`, 'Popup', `width=${popupWidth},height=${popupHeight}`);
                            console.warn("Popup Loaded");
                            popup.parent_information = {
                                data: "Hello popup"
                            }
                        }}>
                            Click
                        </button> */}
            {/* Development */}
            <div className="mt-3">
              <NormalTable
                lazy
                parentClass={""}
                totalRecords={totalCount}
                loading={tableLoading}
                stripedRows={true}
                className={"custom-table-cell"}
                value={list}
                columns={columns}
                filterDisplay="menu"
                showGridlines={true}
                rowHover
                emptyMessage={translate(localeJson, "data_not_found")}
                paginator={true}
                first={getListPayload.filters.start}
                rows={getListPayload.filters.limit}
                paginatorLeft={true}
                tableStyle={{ minWidth: "70rem" }}
                onPageHandler={(e) => onPaginationChange(e)}
                selectionMode="single"
                // Development
                // Row Hover only for active flag
                // rowClassName={(rowData) => {
                //     return rowData.entire_data.active_flg ? "" : "bg:white hover:bg-white pointer-events-none";
                // }}
                onSelectionChange={async (e) => {
                  if (e.value.entire_data) {
                    let payload = { id: e.value.entire_data.id }
                    getActiveList(payload, async (res) => {
                      if (res?.data?.model?.active_flg == "1") {
                        let payload = Object.assign({}, layoutReducer?.user);
                        payload["place"] = e.value.entire_data;
                        await dispatch(setUserDetails(payload));
                        localStorage.setItem("redirect", "/user/list");
                        router.push("/user/dashboard");
                      }
                      else {
                        getPublicEvacueesList()
                      }
                    })

                  }
                }}
                onSort={(data) => {
                  setGetListPayload({
                    ...getListPayload,
                    filters: {
                      ...getListPayload.filters,
                      sort_by: data.sortField,
                      order_by: getListPayload.filters.order_by === 'desc' ? 'asc' : 'desc'
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