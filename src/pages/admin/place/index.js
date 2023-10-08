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

export default function AdminPlacePage() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [admins, setAdmins] = useState([]);
  const [importPlaceOpen, setImportPlaceOpen] = useState(false);
  const [getPayload, setPayload] = useState({
    filters: {
      start: 0,
      limit: 5,
      sort_by: "id",
      order_by: "desc",
    },
    search: "",
  });
  const [checkedValue, setCheckedValue] = useState(false);
  const router = useRouter();
  const handleRowClick = (rowData) => {
    router.push({
      pathname: `/admin/place/detail/${rowData.ID}`,
    });
  };
  const columns = [
    { field: "ID", header: translate(localeJson, "ID") },
    {
      field: "evacuation_place",
      header: translate(localeJson, "evacuation_place"),
      minWidth: "20rem",
      body: (rowData) => {
        return (
          <a onClick={() => handleRowClick(rowData)}>
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
      header: translate(localeJson, "evacuation_possible_people"),
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
  const { getList, updateStatus, exportData } = PlaceServices;

  useEffect(() => {
    const fetchData = async () => {
      await onGetPlaceListOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale]);

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

  const onRegister = (values) => {
    values.file && setImportPlaceOpen(false);
  };

  function exportPlaceData(response) {
    try {
      const base64Data = response.result.file; // Replace with your base64 encoded file
      if (base64Data.startsWith("data:csv;base64,")) {
        // Remove the prefix
        const base64String = base64Data.slice("data:csv;base64,".length);
        console.log(base64String);
        const binaryData = atob(base64String);
        const blob = new Blob([binaryData], {
          type: "application/octet-stream",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "downloadedFile.csv"; // Set the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function fetchData(response) {
    const mappedData = response.data?.model?.list.map((item) => {
      return {
        ID: item.id,
        evacuation_place: item.name,
        address: item.address,
        evacuation_possible_people: item.total_place,
        phone_number: item.tel,
        active_flg: item.active_flg,
        isActive: item.active_flg,
        status: item.active_flg == 1 ? "place-status-cell" : "",
      };
    });

    // Sorting the data by ID
    mappedData.sort((a, b) => a.ID - b.ID);

    setAdmins(mappedData);
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
          content={translate(localeJson, "change_active_place")}
          data={obj}
          checked={obj.active_flg == 1 || false}
          parentClass={"custom-switch"}
          cancelButton={true}
          updateButton={true}
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
      let updateFullStatusPayload = {
        place_id: rowDataReceived.ID,
        active_flg: checkedValue ? 1 : 0,
      };
      updateStatus(updateFullStatusPayload, onGetPlaceListOnMounting);
    }
  };

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
        register={onRegister}
        modalHeaderText={translate(localeJson, "shelter_csv_import")}
      />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <section className="col-12">
              <h5 className="page_header">{translate(localeJson, "places")}</h5>
              <DividerComponent />
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
                      onClick: () => exportData(getPayload, exportPlaceData),
                    }}
                    parentClass={"mr-1 mt-1"}
                  />

                  <Button
                    buttonProps={{
                      rounded: "true",
                      buttonClass: "evacuation_button_height",
                      text: translate(localeJson, "signup"),
                      onClick: () => router.push("/admin/place/create"),
                      severity: "success",
                    }}
                    parentClass={"mr-1 mt-1"}
                  />
                </div>
                <div className="mt-3">
                  <NormalTable
                    showGridlines={"true"}
                    rows={10}
                    paginator={"true"}
                    columnStyle={{ textAlign: "center" }}
                    value={admins}
                    columns={columns}
                    paginatorLeft={true}
                    cellClassName={cellClassName}
                    isDataSelectable={isCellSelectable}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
