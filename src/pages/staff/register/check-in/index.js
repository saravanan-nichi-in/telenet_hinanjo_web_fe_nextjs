import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import _ from "lodash";
import { useSelector } from "react-redux";

import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Button, NormalTable, Counter, CustomHeader } from "@/components";
import { StaffRegisterServices } from "@/services/register_check_in.services";

export default function RegisterCheckIn() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const layoutReducer = useSelector((state) => state.layoutReducer);

  const [frozenArray, setFrozenArray] = useState([]);
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [getListPayload, setGetListPayload] = useState({
    place_id: layoutReducer?.user?.place?.id,
  });

  const initialValues = {};

  const columnsData = [
    // {
    //   field: "slno",
    //   header: translate(localeJson, "supplies_slno"),
    //   className: "sno_class",
    //   textAlign: "center",
    //   alignHeader: "center"
    // },
    {
      field: "name",
      headerStyle: { fontSize: "16px", background: "white" },
      // header: translate(localeJson, "supplies_name"),
      minWidth: "10rem",
      maxWidth: "10rem",

    },
    {
      field: "count",
      headerStyle: { fontSize: "16px", background: "white" },
      header: translate(localeJson, "residence_with_information"),
      minWidth: "5rem",
      maxWidth: "5rem",
      alignHeader: "center",
      body: (rowData) => (
        <div className="border-top-none register-checkIn-group-border ">
          <Counter
            inputClass={"text-center"}
            onValueChange={(value) => {
              rowData.count = value;
            }}
            value={rowData?.count}
            min={0}
            max={9999}
            style={{ fontWeight: "bold", padding: "8px" }}
            leftStyle={{ fontWeight: "bold", padding: "8px" }}
            rightStyle={{ fontWeight: "bold", padding: "8px" }}
          />
        </div>
      ),
    },
    {
      field: "specialCarePersonsCount",
      headerStyle: { fontSize: "16px", background: "white" },
      header: translate(localeJson, "residence_with_out_information"),
      minWidth: "10rem",
      maxWidth: "10rem",
      textAlign: "center",
      alignHeader: "center",
    },
  ];

  /* Services */
  const { getList, create } = StaffRegisterServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await onGetMaterialListOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale, getListPayload]);

  /**
   * Get supplies list on mounting
   */
  const onGetMaterialListOnMounting = () => {
    // Get supplies list
    getList(getListPayload, (response) => {
      if (
        response.success &&
        !_.isEmpty(response.data) &&
        response.data.detail?.length > 0
      ) {
        const data = response.data.detail;
        let preparedList = [];
        let frozenData = []
        data.map((obj, i) => {
          let preparedObj = {
            slno: i > 0 ? i : "",
            special_care_id: obj.id ?? "",
            name: locale == 'ja' ? obj.name ?? "" : obj.name_en ?? "",
            count: obj.count ?? "",
            unit: obj.unit ?? "",
            number: obj.number ?? "",
            specialCarePersonsCount: obj.person_total || obj.specialCarePersonsCount,
            frozenCount: obj.count ?? "",
          };
          if (i == 0) {
            preparedObj['count'] =
              <div className="register-checkIn-group-border ">
                <Counter
                  inputClass={"text-center"}
                  onValueChange={(value) => {
                    if (frozenArray && frozenArray.length > 0) {
                      let updateFrozenArray = frozenArray;
                      updateFrozenArray[0]['frozenCount'] = value;
                      setFrozenArray(updateFrozenArray);
                    } else {
                      preparedObj['frozenCount'] = value;
                    }
                  }}
                  value={obj.count ?? ""}
                  min={0}
                  max={9999}
                  style={{ fontWeight: "bold", padding: "8px" }}
                  leftStyle={{ fontWeight: "bold", padding: "8px" }}
                  rightStyle={{ fontWeight: "bold", padding: "8px" }}
                />
              </div>;
            preparedObj['specialCarePersonsCount'] = <>
              {obj.person_total || obj.specialCarePersonsCount}
            </>
            frozenData.push(preparedObj)
          } else {
            preparedList.push(preparedObj);
          }
        });
        setFrozenArray([frozenData[0]])
        setList(preparedList);
        setTableLoading(false);
      } else {
        setTableLoading(false);
        setList([]);
      }
    });
  };

  const isCreated = (res) => {
    setLoader(false)
    if (res) {
      onGetMaterialListOnMounting();
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {

          let payload = {
            place_id: layoutReducer?.user?.place?.id,
            people_checkin: [],
          };

          if (list) {
            payload.people_checkin.push(
              ...list.map((item) => {
                return {
                  special_care_id: item.special_care_id,
                  count: item.count,
                };
              })
            );
          }

          if (frozenArray) {
            payload.people_checkin.push(
              ...frozenArray.map((item) => {
                return {
                  special_care_id: item.special_care_id,
                  count: item.frozenCount,
                };
              })
            );
          }
          setTableLoading(true);
          StaffRegisterServices.bulkUpdateRegisterCheckIn(payload, () => {
            setTableLoading(false);
          })
        }}
      >
        {({
          values,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "manual_registration_of_evacuees")} />
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="mt-3 sub-heading hidden">{translate(localeJson, "staff_support")}</div>
                    <div className="custom-card-no-shadow mt-3">
                      <NormalTable
                        lazy
                        totalRecords={totalCount}
                        loading={tableLoading}
                        stripedRows={true}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        parentClass={"custom-registerCheckIn-table"}
                        value={list}
                        frozenValue={_.size(list) > 0 && frozenArray}
                        columns={columnsData}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                      />
                    </div>
                    <div className="text-center mt-3">
                      <Button
                        buttonProps={{
                          type: "button",
                          buttonClass: "w-8rem back-button hidden",
                          text: translate(localeJson, "back_to_top"),
                          onClick: () => router.push("/staff/dashboard"),
                        }}
                        parentClass={"inline back-button"}
                      />
                      <Button
                        buttonProps={{
                          buttonClass: "w-8rem update-button",
                          type: "submit",
                          text: translate(localeJson, "staff_supplies_save"),
                        }}
                        parentClass={"inline update-button"}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}
