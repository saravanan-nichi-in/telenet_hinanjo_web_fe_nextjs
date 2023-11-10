import React, { useEffect, useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router';
import _ from 'lodash';

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalTable } from "../datatable";
import StaffManagementEditModal from "./StaffManagementEditModal";
import { StaffManagementService } from "@/services/staffmanagement.service";

export default function StaffManagementDetailModal(props) {
    const router = useRouter();
    const { localeJson, locale, setLoader } = useContext(LayoutContext);
    const [admin, setAdmins] = useState([]);
    const { open, close } = props && props;
    const [staffDetail, setStaffDetail] = useState([]);
    const [editStaffOpen, setEditStaffOpen] = useState(false);
    const onStaffClose = () => {
        setEditStaffOpen(!editStaffOpen);
    };
    const onRegister = (values) => {
        setEditStaffOpen(false);
    };

    const staffDetailData = [{ field: 'name', header: translate(localeJson, 'name') },
    { field: 'tel', header: translate(localeJson, 'tel'), textAlign: "right", alignHeader: "center" }];

    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'staff_management_detail_login_history_slno'), className: "sno_class", textAlign: "center" },
        { field: 'name', header: translate(localeJson, 'staff_management_detail_login_history_name'), maxWidth: "2rem" },
        { field: 'login_datetime', header: translate(localeJson, 'staff_management_detail_login_history_login_datetime'), maxWidth: "2rem" }];

    // Main Table listing starts
    const { show } = StaffManagementService;

    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
            "limit": 5
        },
        "id": props.staff
    });

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

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
                            login_datetime: obj.login_datetime ?? "",
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
            await setGetListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getStaffList()
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload, props.staff]);

    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'detail_staff_management')}
        </div>
    );

    return (
        <React.Fragment>
            <StaffManagementEditModal
                open={editStaffOpen}
                close={onStaffClose}
                register={onRegister}
                buttonText={translate(localeJson, 'update')}
                modalHeaderText={translate(localeJson, 'edit_staff_management')}
            />
            <div>
                <Dialog
                    className="custom-modal"
                    header={header}
                    visible={open}
                    style={{ minWidth: "20rem" }}
                    draggable={false}
                    onHide={() => close()}
                    footer={
                        <div className="text-center">
                            <Button buttonProps={{
                                buttonClass: "text-600 w-8rem",
                                bg: "bg-white",
                                hoverBg: "hover:surface-500 hover:text-white",
                                text: translate(localeJson, 'back'),
                                onClick: () => close(),
                            }} parentClass={"inline"} />
                            <Button buttonProps={{
                                buttonClass: "w-8rem",
                                type: "submit",
                                text: translate(localeJson, 'edit'),
                                severity: "primary",
                                onClick: () => setEditStaffOpen(true)
                            }} parentClass={"inline"} />
                        </div>
                    }
                >
                    <div className={`modal-content`}>
                        <div>
                            <div className="flex justify-content-center overflow-x-auto">
                                <NormalTable tableStyle={{ maxWidth: "20rem" }} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={staffDetail} columns={staffDetailData} />
                            </div>
                            <div >
                                <h5 className='page-header2 pt-5 pb-1'>{translate(localeJson, 'history_login_staff_management')}</h5>
                                <div>
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
                                        paginator={true}
                                        first={getListPayload.filters.start}
                                        rows={getListPayload.filters.limit}
                                        paginatorLeft={true}
                                        onPageHandler={(e) => onPaginationChange(e)}
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