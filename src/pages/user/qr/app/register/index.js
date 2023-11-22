import { getValueByKeyRecursively as translate } from '@/helper'
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Divider } from 'primereact/divider';
import { Button, NormalTable } from '@/components';
import { UserQrService } from '@/services/user_qr.service';
import { useRouter } from 'next/router';

export default function App() {
    const { localeJson } = useContext(LayoutContext);
    const qr_details = localStorage.getItem('user_qr');
    const [columnValues, setColumnValues] = useState([]);
    const [otherDetails, setOtherDetails] = useState({});
    const [mainTableArray, setMainTableArray] = useState([]);
    const [registerPayload, setRegisterPayload] = useState({});
    const router = useRouter();
    const columnsFirst = [{ field: 'join_date_modified', header: translate(localeJson, 'qr_scanner_first_table_refuge_date') },
    { field: 'full_address', header: translate(localeJson, 'qr_scanner_first_table_residence'), minWidth: "15rem", maxWidth: "15rem" },
    { field: 'tel', header: translate(localeJson, 'qr_scanner_first_table_tel_representative'), minWidth: "15rem", maxWidth: "15rem" },
    { field: 'language_register', header: translate(localeJson, 'qr_scanner_first_table_tel_login_locale'), minWidth: "15rem", maxWidth: "15rem" }];

    const columnsLast = [{ field: 'question_combined', header: translate(localeJson, 'qr_scanner_first_table_town_association_name')},
    { field: 'zip_code', header: translate(localeJson, 'qr_scanner_first_table_town_test_payload'), minWidth: "15rem", maxWidth: "15rem" }];

    const columns = [
        { field: 'slno', header: translate(localeJson, 'qr_scanner_second_table_second_column_serial_number')},
        { field: 'is_owner_temp', header: translate(localeJson, 'qr_scanner_second_table_second_column_representative'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'refugee_name', header: translate(localeJson, 'qr_scanner_second_table_second_column_family_name'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'name', header: translate(localeJson, 'qr_scanner_second_table_second_column_family_name_chinese'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'dob', header: translate(localeJson, 'qr_scanner_second_table_second_column_dob'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'age', header: translate(localeJson, 'qr_scanner_second_table_second_column_age'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'month', header: translate(localeJson, 'qr_scanner_second_table_second_column_year_month'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'gender', header: translate(localeJson, 'qr_scanner_second_table_second_column_gender'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'created_at_day', header: translate(localeJson, 'qr_scanner_second_table_second_column_completion_date'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'address_full', header: translate(localeJson, 'qr_scanner_second_table_second_column_residence'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'spacial_care_name_full', header: translate(localeJson, 'qr_scanner_second_table_second_column_allocation_person'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'connecting_code', header: translate(localeJson, 'qr_scanner_second_table_second_column_new_pay'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'note', header: translate(localeJson, 'qr_scanner_second_table_second_column_prepare_for_exam'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'individual_questions_full', header: translate(localeJson, 'qr_scanner_second_table_second_column_current_stay'), minWidth: "15rem", maxWidth: "15rem" },];

    const callApi = () => {
        let formData = new FormData();
        formData.append("content",qr_details);
        UserQrService.register(formData, (item) => {
            setOtherDetails(item);
            const tempArray = [];
            const tableArray = [];
            const tableObject= {...item};
            tableObject.full_address = `${tableObject?.zip_code} ${tableObject?.perfecture_name} ${tableObject?.address}`;
            tableObject.question_combined = tableObject?.question?.map(question => question.title).join(', ');

            tableArray.push(tableObject)
            setMainTableArray(tableArray);

            item?.person?.forEach((element, index) => {
                const tempObj = {...element};
                
                tempObj.is_owner_temp = element.is_owner==0? translate(localeJson, 'qr_scanner_second_table_second_column_is_owner_mutated') : "-";
                
                tempObj.slno = index+1;
                tempObj.address_full = `${element.zip_code} ${element.postal_code} ${element.prefecture_id} ${element.address} `;
                tempObj.spacial_care_name_full = tempObj.specialCareName.join(', ');
                tempObj.individual_questions_full = tempObj.individualQuestions.join(', ');
                tempArray.push(tempObj);
            });
            setColumnValues(tempArray);
        });
    }

    useEffect(() => {
        callApi()
    }, []);

    return (<div className="grid">
        <div className="col-12">
            <div className='card'>
                <h5 className='page-header1'>{translate(localeJson, 'qr_scanner_main_heading')}</h5>
                <hr />
                <div className="grid">
                    <div className="col-12 underline text-right">{translate(localeJson, 'qr_scanner_zip_code')} {otherDetails?.family_code}</div>
                </div>
                <div className='mt-2'>
                    <NormalTable
                        lazy
                        stripedRows={true}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        value={mainTableArray}
                        columns={columnsFirst}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                        paginator={false}
                    />
                </div>
            </div>
            <div className="card">
                <h5 className='page-header1 mt-2'>{translate(localeJson, 'qr_scanner_second_table_second_heading')}</h5>
                <hr></hr>
                <div className='mt-3'>
                    <NormalTable
                        lazy
                        stripedRows={true}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        value={columnValues}
                        columns={columns}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                        paginator={false}
                    />
                </div>
            </div>
            <div className="card">
                    <div className='mt-3'>
                        <NormalTable
                            lazy
                            stripedRows={true}
                            className={"custom-table-cell"}
                            showGridlines={"true"}
                            value={mainTableArray}
                            columns={columnsLast}
                            filterDisplay="menu"
                            emptyMessage={translate(localeJson, "data_not_found")}
                            paginator={false}
                        />
                   </div>
                <div className="grid py-3" style={{justifyContent: 'flex-end', alignItems:"center"}}>
                <Button buttonProps={{
                        type: 'submit',
                        rounded: "true",
                        size:"large",
                        text: translate(localeJson, 'qr_scanner_details_back'),
                        severity: "primary",
                        onClick: () => {localStorage.removeItem('user_qr');
                        router.push("/user/qr/app")}
                    }} parentClass={"mr-1"} />

                    <Button buttonProps={{
                        type: 'submit',
                        rounded: "true",
                        size:"large",
                        text: translate(localeJson, 'qr_scanner_details_shelter'),
                        severity: "success",
                        onClick: () => {
                        UserQrService.create({
                            "family_id": otherDetails.id,
                            "place_id": otherDetails.place_id
                        }, (response) => {
                            localStorage.removeItem('user_qr');
                            router.push("/user/qr/app")
                        });    
                        }
                    }} parentClass={"mr-1"} />
                </div>
            </div>
        </div>
    </div>);
}