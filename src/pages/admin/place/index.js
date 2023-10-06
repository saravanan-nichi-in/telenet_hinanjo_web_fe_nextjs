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
// import { AdminPlaceService } from "@/helper/adminPlaceService";
import { PlaceServices } from "@/services";

export default function AdminPlacePage() {
  const { locale, localeJson } = useContext(LayoutContext);
  const [admins, setAdmins] = useState([]);
  const [checked1, setChecked1] = useState(false);
  const [importStaffOpen, setImportStaffOpen] = useState(false);
  const [getPayload, setPayload] = useState({
    filters: {
      start: 0,
      limit: 5,
      sort_by: "id",
      order_by: "desc",
    },
    search: "",
  });
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
      body: (rowData) => (
        <a onClick={() => handleRowClick(rowData)}>
          {rowData.evacuation_place}
        </a>
      ),
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
      body: (rowData) => (
        <div
          onClick={(event) => event.stopPropagation()}
          className={rowData.isActive == 1 ? "surface-200" : ""}
        ></div>
      ),
    },
  ];

  /* Services */
  const { getList, updateStatus, exportData } = PlaceServices;

  useEffect(() => {
    onGetPlaceListOnMounting();
  }, [locale]);

  /**
   * Get place list on mounting
   */
  const onGetPlaceListOnMounting = () => {
    // Get places list
    getList(getPayload, fetchData);
  };

  const onStaffImportClose = () => {
    setImportStaffOpen(!importStaffOpen);
  };

  const onRegister = (values) => {
    values.file && setImportStaffOpen(false);
  };

  function exportPlaceData(response) {
    alert("exportedData");
    console.log(response);
  }

  function fetchData(response) {
    const mappedData = response.data?.model?.list.map((item) => {
      return {
        ID: item.id,
        evacuation_place: item.name,
        address: item.address,
        evacuation_possible_people: item.total_place,
        phone_number: item.tel,
        status: action(item),
        isActive: item.active_flg,
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
          reNewButton={true}
          reNewCalBackFunction={(rowDataReceived) =>
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
        place_id: rowDataReceived.id,
        active_flg: 1,
      };
      updateStatus(updateFullStatusPayload, onGetPlaceListOnMounting);
    }
  };

  return (
    <>
      <AdminManagementImportModal
        open={importStaffOpen}
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
                      onClick: () => setImportStaffOpen(true),
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
