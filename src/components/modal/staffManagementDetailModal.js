import React, { useEffect,useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { StaffDetailService } from '@/helper/StaffDetailService';
import { AdminStaffDetailService } from '@/helper/adminStaffDetail';
import { NormalTable } from "../datatable";
import { loginHistory,staffDetailData } from "@/utils/constant";
import StaffManagementEditModal from "./StaffManagementEditModal";

export default function StaffManagementDetailModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
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

    useEffect(() => {
        StaffDetailService.getStaffMedium().then((data) => setStaffDetail(data));
        AdminStaffDetailService.getAdminsStaffDetailMedium().then((data) => setAdmins(data));
    }, []);

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
                modalHeaderText= {translate(localeJson, 'edit_staff_management')}
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
                                <h5 className='page-header2 pt-5 pb-1'>{translate(localeJson,'history_login_staff_management')}</h5>
                                <div>
                                    <NormalTable tableStyle={{ maxWidth: "30rem" }} paginator={"true"} paginatorLeft={true} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} value={admin} columns={loginHistory} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
}