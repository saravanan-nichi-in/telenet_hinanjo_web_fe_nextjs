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
} from "@/components";
import { PlaceServices } from "@/services";
import _ from "lodash";

export default function AdminPlacePage() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [admins, setAdmins] = useState([]);
  const [importPlaceOpen, setImportPlaceOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
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
  const handleRowClick = (rowData) => {
    router.push({
      pathname: `/admin/place/detail`,
      query: { id: rowData.ID },
    });
  };
  const columns = [
    { field: "ID", header: translate(localeJson, "s_no"),minWidth:"4rem" },
    {
      field: "evacuation_place",
      header: translate(localeJson, "evacuation_place"),
      minWidth: "20rem",
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
  ];

  /* Services */
  const { getList, updateStatus, exportData,importData } = PlaceServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await onGetPlaceListOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale,getPayload]);

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
      formData.append('file',file)
      importData(formData)
      setImportPlaceOpen(false);
  };
  


  function fetchData(response) {
    setLoader(true)

    const mappedData = response.data?.model?.list.map((item) => {
      return {
        ID: item.id,
        evacuation_place: item.name,
        address: item.address,
        evacuation_possible_people: item.total_place,
        phone_number: item.tel,
        active_flg: item.active_flg,
        isActive: item.active_flg,
        status: item.is_active? "place-status-cell" : "",
      };
    });
    setTotalCount(response.data.model.total);
    // Sorting the data by ID
    setAdmins(mappedData);
    setLoader(false)
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

  return (
    <>
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
                    value={admins}
                    columns={columns}
                    cellClassName={cellClassName}
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
