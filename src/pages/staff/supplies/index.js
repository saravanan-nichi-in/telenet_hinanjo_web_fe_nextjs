import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import _ from "lodash";
import { useSelector } from "react-redux";
import { Formik } from "formik";

import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Button, CounterSupplies, CustomHeader, NormalTable, ValidationError, TextArea } from "@/components";
import { StaffSuppliesServices } from "@/services";

export default function Supplies() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const layoutReducer = useSelector((state) => state.layoutReducer);

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [getListPayload, setGetListPayload] = useState({
    place_id: layoutReducer?.user?.place?.id,
  });

  const schema = Yup.object().shape({
    comment: Yup.string().notRequired(),
    remarks: Yup.string().notRequired(),
  });

  const initialValues = {
    comment: "",
    remarks: "",
  };

  const columnsData = [
    {
      field: "slno",
      header: translate(localeJson, "staff_supply_table_heading_id"),
      className: "sno_class",
      minWidth: "8rem",
      maxWidth: "8rem",
      textAlign: "left",
      alignHeader: "left",
    },
    {
      field: "name",
      header: translate(localeJson, "staff_supply_table_heading_material_name"),
      minWidth: "13rem",
      maxWidth: "13rem",
      textAlign: "left",
      alignHeader: "left",
    },
    {
      field: "current_quantity",
      header: translate(localeJson, "staff_supply_table_heading_current_quantity"),
      minWidth: "10rem",
      maxWidth: "10rem",
      textAlign: "left",
      alignHeader: "left",
    },
    {
      field: "adjuster",
      header: translate(localeJson, "staff_supply_table_heading_counter"),
      minWidth: "13rem",
      maxWidth: "13rem",
      alignHeader: "left",
      body: (rowData, tableObj) => (
        <div className="border-top-none checkIn-group-border">
          <CounterSupplies
            inputClass={"text-center"}
            onValueChange={(value, flag) => {
              let tempArray = list.filter((item, index) => {
                if (index == tableObj.rowIndex) {
                  if (flag == "increment") {
                    item['number'] = parseInt(rowData.current_quantity) + parseInt(value);
                  } else if (flag == "decrement") {
                    let tempVal = parseInt(rowData.current_quantity) - parseInt(value);
                    item['number'] = (tempVal < 0) ? 0 : tempVal;
                  }
                }
                return { ...item }
              })
              setList([...tempArray])
            }}
            value={0}
            leftDisabled={rowData.current_quantity <= 0}
            style={{ fontWeight: "bold", padding: "8px" }}
            min={0}
            max={999999999}
          />
        </div>
      ),
    },
    {
      field: "number",
      header: translate(localeJson, "staff_supply_table_heading_quantity_after_change"),
      minWidth: "10rem",
      maxWidth: "10rem",
      textAlign: "left",
      alignHeader: "left",
    },
  ];

  /* Services */
  const { getList, create } = StaffSuppliesServices;

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
        response.data.supplies?.length > 0
      ) {
        const data = response.data.supplies;
        const supplies_notes = response.data.supplyNotes;
        if (supplies_notes) {
          initialValues.comment = supplies_notes.comment;
          initialValues.remarks = supplies_notes.note;
        }
        let preparedList = [];
        data.map((obj, i) => {
          let preparedObj = {
            slno: i + 1,
            id: obj.id ?? "",
            name: obj.name ?? "",
            unit: obj.unit ?? "",
            adjuster: obj.number ?? "",
            number: obj.number ?? "",
            current_quantity: (obj.number ?? "") + " " + (obj.unit ? obj.unit : ""),
          };
          preparedList.push(preparedObj);
        });
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
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoader(true)
          let payload = {
            place_id: layoutReducer?.user?.place?.id,
            supply: list?.map((item) => {
              return {
                m_supply_id: item.id,
                number: item.number,
              };
            }),
            comment: values.comment,
            note: values.remarks,
          };
          create(payload, isCreated);
          resetForm();
          setList([]);
          setTableLoading(true);
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "staff_supplies")} />
                <form onSubmit={handleSubmit}>
                  <div>
                    <h5 className="sub-header hidden">
                      {translate(localeJson, "supplies_registration")}
                    </h5>
                    <div className="mt-3">
                      <NormalTable
                        lazy
                        totalRecords={totalCount}
                        loading={tableLoading}
                        stripedRows={true}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        value={list}
                        columns={columnsData}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                      />
                    </div>
                    <div className="m-0 pl-0 pr-0">
                      <div className="col-12 pl-0 ">
                        <TextArea textAreaProps={{
                          textAreaParentClassName: `${errors.comment && touched.comment && 'p-invalid w-full'}`,
                          labelProps: {
                            text: translate(localeJson, 'staff_supplies_comment'),
                            textAreaLabelClassName: "block",
                          },
                          textAreaClass: "w-full",
                          row: 5,
                          cols: 30,
                          name: "comment",
                          value: values.comment,
                          onChange: handleChange,
                          onBlur: handleBlur
                        }} />
                        <ValidationError errorBlock={errors.comment && touched.comment && errors.comment} />
                      </div>
                      <div className="col-12 pl-0">
                        <TextArea textAreaProps={{
                          textAreaParentClassName: `${errors.remarks && touched.remarks && 'p-invalid w-full'}`,
                          labelProps: {
                            text: translate(localeJson, 'staff_supplies_remarks'),
                            textAreaLabelClassName: "block",
                          },
                          textAreaClass: "w-full",
                          row: 5,
                          cols: 50,
                          name: "remarks",
                          value: values.remarks,
                          onChange: handleChange,
                          onBlur: handleBlur
                        }} />
                        <ValidationError errorBlock={errors.remarks && touched.remarks && errors.remarks} />
                      </div>
                    </div>
                    <div className="text-center">
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
                          buttonClass: "update-button",
                          type: "submit",
                          text: translate(localeJson, "staff_supplies_save_main"),
                        }}
                        parentClass={"inline pl-2 update-button"}
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