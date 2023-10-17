import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, DND, InputFile, InputFloatLabel, InputNumberFloatLabel, InputSwitch, NormalLabel, SelectFloatLabel } from '@/components';
import { mapScaleRateOptions } from '@/utils/constant';

export default function Setting() {
    const { setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const [mapScale, setMapScale] = useState(mapScaleRateOptions[0]);
    const [data, setData] = useState([]);
    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const prepareData = [...data];
            const item = prepareData.splice(fromIndex, 1)[0];
            prepareData.splice(toIndex, 0, item);
            setData(prepareData);
        },
        nodeSelector: 'li',
        handleSelector: 'a'
    };

    useEffect(() => {
        const fetchData = async () => {
            let prepareData = [];
            for (let i = 1, len = 7; i < len; i++) {
                prepareData.push({
                    title: `Rows${i}`
                });
            }
            setData(prepareData)
            setLoader(false);
        };
        fetchData();
    }, []);

    const map = (
        <ol>
            {data.map((item, index) => (
                <li key={index}>
                    {item.title}
                    <a href="#">
                        drag
                    </a>
                </li>

            ))}
        </ol>
    )

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page-header1'>{translate(localeJson, 'setting_systems')}</h5>
                    <hr />
                    <form>
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6  '>

                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <SelectFloatLabel
                                        selectFloatLabelProps={{
                                            name: "prefecture_id",
                                            optionLabel: "name",
                                            selectClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                            // selectClass: "w-50",
                                            options: mapScaleRateOptions,
                                            value: mapScale,
                                            onChange: (e => setMapScale(e.value)),
                                            text: '全体MAP縮尺率 ',
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                                <div className='pt-5'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            text: "フッター表示",
                                            inputClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6' style={{ alignSelf: "center" }}>
                                日本語表記
                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            text: "通称",
                                            inputClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                                <div className='pt-5'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            text: "システム名 ",
                                            inputClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                                <div className='pt-5'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            text: "情報公開の説明 ",
                                            inputClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6  ' style={{ alignSelf: "center" }}>
                                英語表記
                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            text: "通称",
                                            inputClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                                <div className='pt-5'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            text: "システム名 ",
                                            inputClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                                <div className='pt-5'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            text: "情報公開の説明 ",
                                            inputClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6  ' style={{ alignSelf: "center" }}>
                                MAPの中心座標
                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <InputNumberFloatLabel
                                        inputNumberFloatProps={{
                                            mode: "decimal",
                                            maxFractionDigits: "10",
                                            text: "緯度",
                                            inputNumberClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                                <div className='pt-5'>
                                    <InputNumberFloatLabel
                                        inputNumberFloatProps={{
                                            mode: "decimal",
                                            maxFractionDigits: "10",
                                            text: "経度",
                                            inputNumberClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6  ' style={{ alignSelf: "center" }}>
                                公開情報一覧表示
                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <div>
                                        <NormalLabel
                                            text="デフォルトで表示 "
                                        />
                                    </div>
                                    <div>
                                        <InputSwitch
                                            inputSwitchProps={{
                                                name: "public_availability",
                                                checked: true,
                                                switchClass: "",
                                            }}
                                            parentClass={'custom-switch'}
                                        />
                                    </div>
                                </div>
                                <div className='pt-5 w-full lg:w-20rem md:w-20rem sm:w-20rem'>
                                    <DND dragProps={dragProps}
                                    >
                                        {map}
                                    </DND>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6  ' style={{ alignSelf: "center" }}>
                                備蓄品管理
                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <InputNumberFloatLabel
                                        inputNumberFloatProps={{
                                            mode: "decimal",
                                            maxFractionDigits: "1",
                                            text: "経度",
                                            inputNumberClass: "w-full lg:w-20rem md:w-20rem sm:w-20rem",
                                        }} parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6  ' style={{ alignSelf: "center" }}>
                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <InputFile parentClass="w-full lg:w-20rem md:w-20rem sm:w-20rem" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='flex'>
                            <div className='col-4 lg:col-6 md:col-6  ' style={{ alignSelf: "center" }}>
                                避難所状況履歴取得
                            </div>
                            <div className='flex-row col-8 lg:col-6 md:col-6'>
                                <div className='pt-5'>
                                    <InputSwitch
                                        inputSwitchProps={{
                                            name: "public_availability",
                                            checked: true,
                                            switchClass: "",
                                        }}
                                        parentClass={'custom-switch'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                        <Button buttonProps={{
                            buttonClass: "w-8rem",
                            severity: "primary",
                            type:"submit",
                            text: translate(localeJson, 'save'),
                            onClick: () => router.push('/admin/evacuation/'),
                        }} parentClass={"inline"} />
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
