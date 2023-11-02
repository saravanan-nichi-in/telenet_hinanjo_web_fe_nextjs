import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CommonDialog, NormalTable, RowExpansionTable } from '@/components';
import { StaffDetailColumnService } from '@/helper/staffFamilyDetailColumnService';
import { StaffFamilyAdmissionService } from '@/helper/staffFamilyAdmissionService';
import { TemporaryFamilyRowExpansionService } from '@/helper/staffFamilyDetailService';
import { StaffFamilyDetailQuestionsService } from '@/helper/staffFamilyDetailQuestionsService';

export default function StaffFamilyDetail() {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const [basicFamilyDetail, setBasicFamilyDetail] = useState([]);
    const [familyAdmission, setFamilyAdmission] = useState([]);
    const [familyDetails, setFamilyDetails] = useState([]);
    const [familyDetailQue, setFamilyDetailQue] = useState([]);
    const [staffFamilyDialogVisible, setStaffFamilyDialogVisible] = useState(false);

    /**
     * CommonDialog modal close
     */
    const onClickCancelButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    /**
     * CommonDialog modal open
     */
    const onClickOkButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    const familyDetailColumns = [
        { field: 'evacuation_date_time', header: translate(localeJson, 'evacuation_date_time'), minWidth: "10rem", textAlign: 'left' },
        { field: 'address', header: translate(localeJson, 'address'), minWidth: "10rem", textAlign: 'left' },
        { field: 'representative_number', header: translate(localeJson, 'representative_number'), minWidth: "10rem", textAlign: 'left' },
        { field: 'registered_lang_environment', header: translate(localeJson, 'registered_lang_environment'), minWidth: "10rem", textAlign: 'left' },
    ];

    const familyAdmissionColumns = [
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'shelter_place', header: translate(localeJson, 'shelter_place'), minWidth: "10rem" },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time'), minWidth: "10rem", textAlign: 'left' },
        { field: 'discharge_date_time', header: translate(localeJson, 'discharge_date_time'), minWidth: "10rem", textAlign: 'left' },
    ];

    const houseHoldListOuterColumn = [
        { field: 'id', header: translate(localeJson, 's_no'), headerClassName: "custom-header", className: "sno_class" },
        { field: 'representative', header: translate(localeJson, 'representative'), headerClassName: "custom-header", minWidth: "9rem" },
        { field: 'name_phonetic', header: translate(localeJson, 'name_phonetic'), headerClassName: "custom-header", minWidth: "9rem" },
        { field: 'name_kanji', header: translate(localeJson, 'name_kanji'), headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'dob', header: translate(localeJson, 'dob'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'age', header: translate(localeJson, 'age'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'age_m', header: translate(localeJson, 'age_m'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'gender', header: translate(localeJson, 'gender'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'created_date', header: translate(localeJson, 'created_date'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'updated_date', header: translate(localeJson, 'updated_date'), headerClassName: "custom-header", minWidth: "8rem" },
    ];

    const houseHoldListInnerColumn = [
        { field: 'street_address', header: translate(localeJson, 'address'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'special_Care_type', header: translate(localeJson, 'special_Care_type'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'connecting_code', header: translate(localeJson, 'connecting_code'), headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: "current_place_of_stay", header: translate(localeJson, 'current_location') },
    ]

    const QuestionColumn = [
        { field: 'neighborhood_association_name', header: "町内会名", headerClassName: "custom-header", minWidth: "8rem" },
        { field: "test_payload", header: "test payload" }
    ]

    useEffect(() => {
        StaffDetailColumnService.getStaffDetailColumnDetailMedium().then((data) => setBasicFamilyDetail(data));
        StaffFamilyAdmissionService.getStaffFamilyAdmissionDetailMedium().then((data) => setFamilyAdmission(data))
        StaffFamilyDetailQuestionsService.getStaffFamilyDetailQuestionsDetailMedium().then((data) => setFamilyDetailQue(data))
        TemporaryFamilyRowExpansionService.getTemporaryFamilyRowExpansionWithOrdersSmall().then((data) => setFamilyDetails(data))
    }, []);

    return (
        <>
            <CommonDialog
                open={staffFamilyDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'confirmation_information')}
                content={
                    <div>
                        <p>{translate(localeJson, 'do_you_want_to_exit_the_shelter')}</p>
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => onClickCancelButton(),
                        },
                        parentClass: "inline"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-8rem",
                            type: "submit",
                            text: translate(localeJson, 'submit'),
                            severity: "danger",
                            onClick: () => onClickOkButton(),
                        },
                        parentClass: "inline"
                    }
                ]}
                close={() => {
                    setStaffFamilyDialogVisible(false);
                }}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page_header'>{translate(localeJson, 'house_hold_information_details')}</h5>
                        <hr />
                        <div>
                            <div className='mb-2'>
                                <div className='flex justify-content-end'>
                                    {translate(localeJson, 'household_number')} 001-012
                                </div>
                            </div>
                            <NormalTable
                                id="evacuee-family-detail"
                                size={"small"}
                                // tableLoading={tableLoading}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                stripedRows={true}
                                paginator={false}
                                showGridlines={true}
                                value={basicFamilyDetail}
                                columns={familyDetailColumns}
                                parentClass="mb-3"
                            />
                            <div className='mb-2'>
                                <h5>{translate(localeJson, 'household_list')}</h5>
                            </div>
                            <div className='flex mt-2 mb-2' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    severity: "primary",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'exit'),
                                    onClick: () => setStaffFamilyDialogVisible(true)
                                    // onClick: () => router.push('/staff/family'),
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <RowExpansionTable
                                paginator="true"
                                customRowExpansionActionsField="actions"
                                value={familyDetails}
                                paginatorLeft={true}
                                innerColumn={houseHoldListInnerColumn}
                                outerColumn={houseHoldListOuterColumn}
                                rowExpansionField="orders"
                            />
                            <div className='mt-3'>
                                <NormalTable
                                    size={"small"}
                                    stripedRows={true}
                                    paginator={false}
                                    showGridlines={true}
                                    value={familyDetailQue}
                                    columns={QuestionColumn}
                                    parentClass="pb-2 mb-2"
                                />
                            </div>
                            <div className='flex mt-2 mb-2' style={{ justifyContent: "center", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    bg: "bg-white",
                                    hoverBg: "hover:surface-500 hover:text-white",
                                    buttonClass: "text-600 evacuation_button_height",
                                    text: translate(localeJson, 'cancel'),
                                    onClick: () => router.push('/staff/family'),
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'edit'),
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />

                            </div>
                            <div className='mt-3 flex justify-content-center overflow-x-auto'>
                                <NormalTable
                                    size={"small"}
                                    stripedRows={true}
                                    paginator={false}
                                    showGridlines={true}
                                    tableStyle={{ maxWidth: "20rem" }}
                                    value={familyAdmission}
                                    columns={familyAdmissionColumns}
                                    parentClass="pb-2 mb-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}