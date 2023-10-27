"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AdminManagementImportModal } from "@/components/modal";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  DeleteModal,
  DividerComponent,
  NormalTable,
  CommonDialog
} from "@/components";
import { PlaceServices } from "@/services";
import _ from "lodash";
import { setPlace } from "@/redux/place";
import { useAppDispatch } from "@/redux/hooks";

export default function AdminPlacePage() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [admins, setAdmins] = useState([]);
  const [importPlaceOpen, setImportPlaceOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [placeEditDialogVisible, setPlaceEditDialogVisible] = useState(false);
  const [columns, setColumns] = useState([]);
  const [id, setId] = useState(0)
  const [list, setList] = useState([]);
  const [getPayload, setPayload] = useState({
    filters: {
      start: 0,
      limit: 5,
      sort_by: "id",
      order_by: "asc",
    },
    search: "",
  });
  const [checkedValue, setCheckedValue] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleRowClick = (rowData) => {
    let id = { id: rowData.ID };
    dispatch(setPlace(id));
    router.push({
      pathname: `/admin/place/detail`,
      query: { id: rowData.ID },
    },'/admin/place/detail');
  };
  const columnsData = [
    { field: "index", header: translate(localeJson, "s_no"), className: "sno_class" },
    {
      field: "evacuation_place",
      header: translate(localeJson, "evacuation_place"),
      minWidth: "20rem",
      maxWidth: "20rem",
      body: (rowData) => {
        return (
          <a className="text-link-class cursor-pointer" onClick={() => handleRowClick(rowData)}>
            {rowData.evacuation_place}
          </a>
        );
      },
    },
    {
      field: "address",
      header: translate(localeJson, "address"),
      minWidth: "10rem",
    },
    {
      field: "evacuation_possible_people",
      header: translate(localeJson, "capacity"),
      minWidth: "10rem",
    },
    { field: "phone_number", header: translate(localeJson, "phone_number") },
    {
      field: "status",
      header: translate(localeJson, "status"),
      body: (rowData) => {
        return action(rowData);
      },
    },
    {
      field: 'actions',
      header: translate(localeJson, 'delete'),
      textAlign: "center",
      alignHeader: "center",
      minWidth: "6rem",
      body: (rowData) => {
        return (
          <div className="flex flex-wrap">
            <Button buttonProps={{
              text: translate(localeJson, 'delete'), buttonClass: "text-primary",
              bg: "bg-red-600 text-white",
              hoverBg: "hover:bg-red-500 hover:text-white",
              disabled: rowData.isActive,
              onClick: () => {
                setId(rowData?.ID)
                console.log(id, "id")
                setPlaceEditDialogVisible(true)
              }
            }} />
          </div>
        )
      },
    }
  ];

  /* Services */
  const { getList, updateStatus, exportData, importData, deletePlace } = PlaceServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await onGetPlaceListOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale, getPayload]);

  /**
   * Get place list on mounting
   */
  const onGetPlaceListOnMounting = async () => {
    // Get places list
    getList(getPayload, fetchData);
  };

  const onStaffImportClose = () => {
    setImportPlaceOpen(!importPlaceOpen);
  };

  const importFileApi = (file) => {
    const formData = new FormData()
    formData.append('file', file)
    importData(formData)
    setImportPlaceOpen(false);
  };

  function fetchData(response) {
    if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
      setLoader(true)
      const data = response.data.model.list;
      var additionalColumnsArrayWithOldData = [...columnsData];
      let preparedList = [];
      data.map((obj, i) => {
        let preparedObj = {
          index: getPayload.filters.start + i + 1,
          ID: obj.id,
          evacuation_place: obj.name,
          address: obj.address,
          evacuation_possible_people: obj.total_place,
          phone_number: obj.tel,
          active_flg: obj.active_flg,
          isActive: obj.is_active,
          status: obj.is_active ? "place-status-cell" : "",
        };
        preparedList.push(preparedObj);
      });
      setList(preparedList);
      setColumns(additionalColumnsArrayWithOldData);
      setTotalCount(response.data.model.total);
      setTableLoading(false);
      setLoader(false)
    }
    setTableLoading(false);
  }

  /**
   * Action column for dashboard list
   * @param {*} obj
   * @returns
   */
  const action = (obj) => {
    return (
      <div className="input-switch-parent">
        <DeleteModal
          header={translate(localeJson, "confirmation_information")}
          content={translate(localeJson, "update_isActive_status")}
          data={obj}
          checked={obj.active_flg == 1 || false}
          parentClass={"custom-switch"}
          cancelButton={true}
          updateButton={true}
          cancelButtonClass="text-600 w-8rem font-bold"
          updateButtonClass="w-8rem font-bold"
          setCheckedValue={setCheckedValue}
          updateCalBackFunction={(rowDataReceived) =>
            getDataFromRenewButtonOnClick(rowDataReceived)
          }
        />
      </div>
    );
  };

  /**
   * Update full status by row id
   * @param {*} rowDataReceived
   */
  const getDataFromRenewButtonOnClick = (rowDataReceived) => {
    if (rowDataReceived) {
      setTableLoading(true);
      let updateFullStatusPayload = {
        place_id: rowDataReceived.ID,
        active_flg: checkedValue ? 1 : 0,
      };
      updateStatus(updateFullStatusPayload, onGetPlaceListOnMounting);
    }
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
      await setPayload(prevState => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue
        }
      }));
    }
  }

  const cellClassName = (data) =>
    data == "place-status-cell" ? "p-disabled surface-400" : "";

  const isCellSelectable = (event) =>
    !(
      event.data.field === "status" && event.data.value === "place-status-cell"
    );

  const deleteContent = (
    <div className="text-center">
      <div className="mb-3">
        {translate(localeJson, "Place_Delete_Content_1")}
      </div>
      <div>{translate(localeJson, "Place_Delete_Content_2")}</div>
    </div>
  );

  const isDeleted = ((res) => {
    if (res) {
      setPlaceEditDialogVisible(false);
      onGetPlaceListOnMounting()
    }
  })

  return (
    <>
      <CommonDialog
        open={placeEditDialogVisible}
        dialogBodyClassName="p-3"
        header={translate(localeJson, "confirmation")}
        content={deleteContent}
        position={"center"}
        footerParentClassName={"text-center"}
        footerButtonsArray={[
          {
            buttonProps: {
              buttonClass: "text-600 w-8rem",
              bg: "bg-white",
              hoverBg: "hover:surface-500 hover:text-white",
              text: translate(localeJson, "cancel"),
              onClick: () => {
                setPlaceEditDialogVisible(false);
              },
            },
            parentClass: "inline",
          },
          {
            buttonProps: {
              buttonClass: "w-8rem",
              text: translate(localeJson, "ok"),
              severity: "danger",
              onClick: () => {
                setLoader(true);
                deletePlace(id, isDeleted);
                setLoader(false);
              },
            },
            parentClass: "inline",
          },
        ]}
        close={() => {
          setPlaceEditDialogVisible(false);
        }}
      />
      <AdminManagementImportModal
        open={importPlaceOpen}
        close={onStaffImportClose}
        importFile={importFileApi}
        modalHeaderText={translate(localeJson, "place_csv_import")}
      />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <h5 className="page-header1">{translate(localeJson, "places")}</h5>
            <hr />
            <div>
              <div
                className="flex"
                style={{ justifyContent: "flex-end", flexWrap: "wrap" }}
              >
                <Button
                  buttonProps={{
                    rounded: "true",
                    buttonClass: "evacuation_button_height",
                    text: translate(localeJson, "import"),
                    severity: "primary",
                    onClick: () => setImportPlaceOpen(true),
                  }}
                  parentClass={"mr-1 mt-1"}
                />
                <Button
                  buttonProps={{
                    rounded: "true",
                    buttonClass: "evacuation_button_height",
                    text: translate(localeJson, "export"),
                    severity: "primary",
                    onClick: () => exportData(getPayload),
                  }}
                  parentClass={"mr-1 mt-1"}
                />

                <Button
                  buttonProps={{
                    rounded: "true",
                    buttonClass: "evacuation_button_height",
                    text: translate(localeJson, "create_place"),
                    onClick: () => router.push("/admin/place/create"),
                    severity: "success",
                  }}
                  parentClass={"mr-1 mt-1"}
                />
              </div>
              <div className="mt-3">
                <NormalTable
                  lazy
                  totalRecords={totalCount}
                  loading={tableLoading}
                  showGridlines={"true"}
                  paginator={"true"}
                  columnStyle={{ textAlign: "center" }}
                  className={"custom-table-cell"}
                  value={list}
                  columns={columns}
                  cellClassName={cellClassName}
                  emptyMessage={translate(localeJson, "data_not_found")}
                  isDataSelectable={isCellSelectable}
                  first={getPayload.filters.start}
                  rows={getPayload.filters.limit}
                  paginatorLeft={true}
                  onPageHandler={(e) => onPaginationChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
