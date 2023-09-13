import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { OrderList } from 'primereact/orderlist';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

const QuestionnairesView = ({ questionnaires, handleOnDrag }) => {
    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const prepareData = [...questionnaires];
            const item = prepareData.splice(fromIndex, 1)[0];
            prepareData.splice(toIndex, 0, item);
            if (!_.isEmpty(questionnaires) && _.isFunction(handleOnDrag)) {
                handleOnDrag(prepareData);
            }
        },
        nodeSelector: 'li',
        handleSelector: 'a'
    };

    const itemTemplate = (item) => {
        return (
            <div>
                {/* Questionnaires header */}
                <div className="grid" style={{
                    backgroundColor: "#afe1f9",
                    border: "1px solid #000",
                }}>
                    <div className="col-fixed col-2 flex align-items-center justify-content-center">
                        項目{item.title}
                    </div>
                    <div className="col" style={{
                        borderLeft: "1px solid #000"
                    }}>
                        <div className='flex'>
                            <div className='col-8 flex gap-2 align-items-center justify-content-start'>
                                <Checkbox
                                    checked={true}
                                ></Checkbox>
                                必須
                            </div>
                            <div className='col-4 flex gap-2 align-items-center justify-content-center'>
                                <InputSwitch
                                    checked={true}
                                />
                                避難者登録画面表示
                            </div>
                        </div>
                        <div className='flex align-items-center justify-content-between'>
                            <div className='col-8 flex gap-3'>
                                <div className='flex gap-2 align-items-center justify-content-center'>
                                    <RadioButton
                                        checked={true}
                                    />
                                    選択形式
                                </div>
                                <div className='flex gap-2 align-items-center justify-content-center'>
                                    <RadioButton
                                        checked={true}
                                    />
                                    記述形式
                                </div>
                                <div className='flex gap-2 align-items-center justify-content-center'>
                                    <RadioButton
                                        checked={true}
                                    />
                                    数値形式
                                </div>
                            </div>
                            <div className='col-4 flex gap-2 align-items-center justify-content-center'>
                                <InputSwitch
                                    checked={true}
                                />
                                避難者登録画面表示
                            </div>
                        </div>
                    </div>
                </div>
                {/* Questionnaires */}
                <div className="flex" style={{
                    borderRight: "1px solid #000",
                    borderBottom: "1px solid #000",
                    borderLeft: "1px solid #000",
                }}>
                    <div className="col-fixed col-2 flex align-items-center justify-content-center">
                        項目タイトル
                    </div>
                    <div className="col-7" style={{
                        borderLeft: "1px solid #000",
                    }}>
                        <div className='col-12 flex align-items-center'>
                            <InputText
                                value={""}
                                className='col-12 p-inputtext-lg'
                            />
                        </div>
                        <div className='col-12 flex align-items-center'>
                            <InputText
                                value={""}
                                placeholder='項目（英語）'
                                className='col-12 p-inputtext-lg'
                            />
                        </div>
                    </div>
                    <div className='col-3 flex align-items-center justify-content-center' style={{
                        borderLeft: "1px solid #000",
                    }}>
                        <Button className='col-10' label=" － 項目削除" severity="danger" rounded />
                    </div>
                </div>
                {/* Questionnaires options */}
                {[0, 1, 2].map((arr, i) => (
                    <div className="flex" style={{
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        borderLeft: "1px solid #000",
                    }}>
                        <div className="col-fixed col-2 flex align-items-center justify-content-center">
                            選択肢{i}<span style={{
                                color: "red"
                            }}>*</span>
                        </div>
                        <div className="col-7" style={{
                            borderLeft: "1px solid #000",
                        }}>
                            <div className='col-12 flex gap-3 align-items-center'>
                                <InputText
                                    value={""}
                                    className='col p-inputtext-lg'
                                />
                                <InputText
                                    value={""}
                                    placeholder={`選択肢${i}（英語）`}
                                    className='col p-inputtext-lg'
                                />
                            </div>
                        </div>
                        <div className='col-3 flex align-items-center justify-content-center' style={{
                            borderLeft: "1px solid #000",
                        }}>
                            {i < 2 ? (
                                <Button className='col-10' label=" － 項目削除" severity="danger" rounded />
                            ) : (
                                <Button className='col-10' label=" ＋ 選択肢追加" severity="success" rounded />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        questionnaires && (
            <div className="grid">
                <div className="col-12 mb-4">
                    <div className='xl:flex xl:justify-content-center"'>
                        <OrderList
                            value={questionnaires}
                            onChange={(e) => handleOnDrag(e)}
                            itemTemplate={itemTemplate}
                            dragdrop
                            className='col questionnaires_orderList'
                        >
                        </OrderList>
                    </div>
                </div>
            </div>
        ));
};

export default QuestionnairesView;
