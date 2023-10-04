import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';

import { StaffDetailService } from '@/helper/StaffDetailService';
import ImageCropper from '@/pages/POC/CROP';
import {
    NormalTable, Counter, Linker, NormalLabel, DeleteModal,
    ImageComponent, DateCalendar, TimeCalendar, DateTimeCalendar,
    DateTimePicker, NormalCheckBox, InputSwitch, ToggleSwitch, DividerComponent,
    Button, InputSelect, Select, ProfileAvatar, RadioBtn, BarcodeScanner, FileUpload,
    InputIcon, InputLeftRightGroup, InputGroup, TextArea, MicroPhoneButton
} from '@/components';
import { Input } from '@/components/input';

export default function ComponentsDemo() {
    const [checked1, setChecked1] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    const [ingredient, setIngredient] = useState('');
    const [value, setValue] = useState(501);
    const handleIncrement = () => {
        setValue(value + 1);
    };
    const handleDecrement = () => {
        setValue(value - 1);
    };
    const [ingredients, setIngredients] = useState([]);
    const onIngredientsChange = (e) => {
        let _ingredients = [...ingredients];

        if (e.checked)
            _ingredients.push(e.value);
        else
            _ingredients.splice(_ingredients.indexOf(e.value), 1);

        setIngredients(_ingredients);
    }
    const options = [
        { label: 'Japanese', image: '/layout/images/jp.png' },
        { label: 'English', image: '/layout/images/us.png' }
    ];
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [customers, setCustomers] = useState([]);
    let today = new Date();
    let invalidDates = [today];
    const columns = [
        { field: '避難所', header: '避難所' },
        { field: 'Test1(2)', header: 'Test1(2)' },
        { field: 'Test2(2)', header: 'Test2(2)' },
        { field: 'test3(3)', header: 'test3(3)' },
        { field: 'test6(5)', header: 'test6(5)' },
        {
            field: 'actions',
            header: 'Edit Actions',
            body: (rowData) => (
                <div>
                    <Button buttonProps={{ text: "Edit" }} />
                </div>
            ),
        }, {
            field: 'actions',
            header: 'Delete Actions',
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        severity: "danger", text: "delete"
                    }} />
                </div>
            ),
        },
    ];

    useEffect(() => {
        StaffDetailService.getStaffMedium().then((data) => setCustomers(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className={"page_header"}>
                            不足物資一覧
                        </h5>
                        <Divider />
                        <div>
                            <h6 className='page_sub_header'> Buttons Component </h6>
                            <div>
                                <Button buttonProps={{
                                    icon: "pi pi-star-fill",
                                }}
                                    parentClass={"mb-1 border-round-lg"} />
                                <Button buttonProps={{
                                    text: "避難者状況一覧"
                                }}
                                    parentClass={"mb-1"} />
                                <Button parentClass={"mb-1 border-round-lg"}
                                    buttonProps={{
                                        text: "避難者状況一覧",
                                        icon: "pi pi-star-fill",
                                        iconPos: "right"
                                    }} />
                                <Button parentClass={"mb-1"} buttonProps={{
                                    text: "避難者状況一覧",
                                    icon: "pi pi-star-fill",
                                    iconPos: "left",
                                    rounded: "true"
                                }}
                                />
                                < MicroPhoneButton size="2xl" />
                            </div>
                        </div>

                        < div>
                            <h6 className='page_sub_header'> Date Components</h6>
                            <h6>Current date and time component</h6>
                            <DateTimePicker />
                            <h6>Date Picker</h6>
                            <DateCalendar dateProps={{
                                placeholder: "yy-mm-dd"
                            }} parentClass={"xl:w-4 sm:w-full"} />
                            <h6>Time Picker</h6>
                            <TimeCalendar parentClass={"xl:w-4 sm:w-full"} timeProps={{
                                placeholder: "time"
                            }} />
                            <h6>Disabled days </h6>
                            <DateCalendar parentClass={"xl:w-4 sm:w-full"} dateProps={{
                                disabledDates: invalidDates,
                                disabledDays: [0, 6],
                                placeholder: "yy-mm-dd"
                            }} />
                            <h6>Date and Time with range</h6>
                            <DateTimeCalendar dateTimeProps={{
                                selectionMode: "range"
                            }} parentClass={"xl:w-6 sm:w-full"} />

                        </div>
                        < div>
                            <h2 className='page_sub_header'>input icons</h2>
                            <InputIcon inputIconProps={{
                                placeholder: "input-left-icon",
                                icon: "pi pi-search",
                                iconPos: "p-input-icon-left"
                            }} /><br />
                            <InputIcon inputIconProps={{
                                placeholder: "input-right-icon",
                                icon: "pi pi-search",
                                iconPos: "p-input-icon-right"
                            }} />
                            <InputIcon parentClass={"mt-3  "} inputIconProps={{
                                inputClass: "xl:w-3 sm:w-full",
                                placeholder: "input"
                            }} />
                            <InputIcon parentClass={"mt-3 "} inputIconProps={{
                                inputClass: "xl:w-3 sm:w-full"
                            }} />
                            <InputIcon parentClass={"mt-3"} inputIconProps={{
                                inputClass: "xl:w-3 sm:w-full",
                                readOnly: "true",
                                value: 30
                            }} />
                            <div class="pt-3">
                                <h2 className='page_sub_header'>input group</h2>
                                <InputLeftRightGroup inputLrGroupProps={{
                                    rightIcon: "pi pi-user",
                                    placeholder: "username",
                                }}
                                    parentClass={"xl:w-4 pb-2 "}
                                />
                                <InputLeftRightGroup
                                    inputLrGroupProps={{
                                        type: "password",
                                        leftIcon: "pi pi-user",
                                        placeholder: "password",
                                    }}
                                    parentClass={"xl:w-4 pb-2 "}
                                />
                                <InputGroup inputGroupProps={{
                                    type: "number",
                                    value: value,
                                    onChange: (e) => setValue(e.target.value),
                                    onRightClick: handleIncrement,
                                    onLeftClick: handleDecrement,
                                    rightIcon: "pi pi-plus",
                                    leftIcon: "pi pi-minus"
                                }}
                                    parentClass={"xl:w-4 sm:w-full"} />
                            </div>
                            <div class="pt-3">
                                <h2 className='page_sub_header'>TextArea</h2>
                                <TextArea textAreaProps={{
                                    textAreaClass: "w-full",
                                    row: 5,
                                    cols: 10
                                }} />
                            </div>
                            <div class="pt-3">
                                <h2 className='page_sub_header'>Input and Dropdown</h2>
                                <InputSelect dropdownProps={{
                                    value: selectedCity,
                                    onChange: (e) => setSelectedCity(e.value),
                                    options: cities,
                                    optionLabel: "name"
                                }}
                                />
                            </div>
                            <div className="pt-3  ">
                                <h2 className='page_sub_header'>Select</h2>
                                <div className='flex'>
                                    <img src={selectedOption.image} height={20} width={20} alt="Selected Option" className='mr-1' />
                                    <Select selectProps={{
                                        selectClass: "custom_dropdown_items",
                                        value: selectedOption,
                                        options: options,
                                        onChange: (e) => setSelectedOption(e.value),
                                        placeholder: "Select a Language"
                                    }}
                                        parentClass={"custom_select"}
                                    />
                                </div>
                            </div>
                            <div class="pt-3">
                                <h2 className='page_sub_header'>Label</h2>
                                <NormalLabel htmlFor="email" text={"email"} labelClass={"font-18 text-primary pr-2"} />
                                <NormalLabel labelClass="w-full font-18 font-bold pt-0" text={"種別"} spanClass={"text-red-500"} spanText={"*"} />
                            </div>
                            <div class="pt-3">
                                <h2 className='page_sub_header'>Radio button</h2>
                                <RadioBtn radioBtnProps={{
                                    radioClass: "mr-1",
                                    inputId: "ingredient1",
                                    name: "chk",
                                    value: "Cake",
                                    onChange: (e) => setIngredient(e.value),
                                    checked: ingredient === 'Cake'
                                }}
                                />
                            </div>
                            <div class="pt-3">
                                <h2 className='page_sub_header'> Checkbox</h2>
                                <NormalCheckBox checkBoxProps={{
                                    checkboxClass: "pr-1 h-10",
                                    inputId: "ingredient1",
                                    name: "pizza",
                                    value: "Cheese",
                                    onChange: onIngredientsChange,
                                    checked: ingredients.includes('Cheese')
                                }}
                                    parentClass={"pt-1 custom_checkbox"} />
                            </div>
                            <div class="pt-3">
                                <h2 className='page_sub_header'> upload</h2>
                                <FileUpload auto="true" />
                            </div>
                        </div>
                        <div >
                            <h2 className='page_sub_header'>Increment Decrement</h2>
                            <Counter value={5} parentClass={"xl:w-10 sm:w-full"} />
                        </div>
                        <div >
                            <h2 className='page_sub_header'>Switch Component</h2>
                            <InputSwitch parentClass={"custom-switch"}
                                inputSwitchProps={{

                                }}

                            />
                            <ToggleSwitch togglProps={{
                                checked: checked1,
                                onLabel: "on",
                                offLabel: "off",
                                onChange: (e) => setChecked1(e.value)
                            }}
                            />
                        </div>
                        <div>
                            <h2 className='page_sub_header'>DataTable with pagination</h2>
                            <NormalTable customActionsField="actions" paginator="true" value={customers} columns={columns} />
                            <h2 className='page_sub_header'>DataTable without pagination</h2>
                            <NormalTable customActionsField="actions" value={customers} columns={columns} />
                        </div>
                        <div>
                            <h2 className='page_sub_header'>Modal</h2>
                            <h4>Delete Modal with switch</h4>
                            <DeleteModal
                                modalClass="w-50rem"
                                header="確認情報"
                                position="top"
                                content={"避難所の満員状態を切り替えてもよろしいでしょうか？"}
                                checked={checked1}
                                onChange={(e) => setChecked1(e.value)}
                                parentClass={"mb-3 custom-switch"}
                            />
                            <h4>Delete Modal with Button</h4>
                            <DeleteModal
                                modalClass="w-50rem"
                                header="確認情報"
                                text="delete"
                                content={"避難所の満員状態を切り替えてもよろしいでしょうか？"}
                                checked={checked1}
                                onChange={(e) => setChecked1(e.value)}
                                parentClass={"mt-3"}
                            />
                        </div>
                        <div>
                            <h2 className='page_sub_header'> Link</h2>
                            <Linker linkProps={{
                                linkClass: "text-primary-600",
                                textWithUnderline: "PRIME",
                                href: "https://primereact.org/"
                            }}
                            />
                            <Linker linkProps={{
                                text: "PRIME",
                                href: "https://primereact.org/"
                            }}
                            />
                        </div>
                        <div>
                            <h2 className='page_sub_header'> Image</h2>
                            <ImageComponent
                                imageProps={{
                                    width: "200",
                                    height: "200",
                                    src: "/layout/images/perspective1.jpg"
                                }}
                            />
                            <h2 className='page_sub_header'> Image placeholder</h2>
                            <ImageComponent
                                imageProps={{
                                    width: "200",
                                    height: "200",
                                    src: "/layout/images/perspective.jpg"
                                }}
                            />
                            <h2 className='page_sub_header'>avatar with image</h2>
                            <ProfileAvatar
                                avatarProps={{
                                    avatarClass: "mr-3",
                                    size: "xlarge",
                                    image: "/layout/images/perspective1.jpg",
                                    shape: "circle",
                                    style: { backgroundColor: "#2196F3" }
                                }}
                            />
                            <h2 className='page_sub_header'>avatar with text</h2>
                            <ProfileAvatar
                                avatarProps={{
                                    avatarClass: "mr-3",
                                    size: "xlarge",
                                    label: "TR",
                                    shape: "circle",
                                }}
                            />
                            <h2 className='page_sub_header'>avatar with icon</h2>
                            <ProfileAvatar
                                avatarProps={{
                                    avatarClass: "mr-3",
                                    size: "xlarge",
                                    icon: "pi pi-calendar",
                                    shape: "circle",
                                    style: { backgroundColor: "#2196F3" }
                                }}
                            />
                        </div>
                        <div>
                            <h2 className='page_sub_header'>Qr</h2>
                            <BarcodeScanner />
                        </div>
                        <div>
                            <h2 className='page_sub_header'> Divider Component </h2>
                            <DividerComponent dividerProps={{
                                width: "w-full"
                            }} />
                            <DividerComponent dividerProps={{
                                align: "top",
                                width: "w-2",
                                layout: "vertical"
                            }}
                            />&nbsp;
                            <DividerComponent dividerProps={{ align: "center", width: "w-25rem" }} />
                        </div>
                        <ImageCropper />
                        <div className='col-12 flex gap-3 align-items-center ' style={{ justifyContent: "start", flexWrap: "wrap" }}>
                                    {/* <div className='col-6  align-items-center'> */}
                                    <InputIcon inputIconProps={{
                                    inputClass: "col p-inputtext-lg md:w-full content-width ",
                                    
                                }} />
                                    {/* </div> */}
                                    {/* <InputText
                                        value={""}
                                        className='col p-inputtext-lg md:w-full content-width'
                                    /> */}
                                    <Input inputProps={{
                                inputClass: "w-full",
                                    value: "",
                                    placeholder:`選択肢（英語）`
                                }} parentClass="col p-inputtext-lg md:w-full content-width" />
                                    {/* <InputText
                                        value={""}
                                        placeholder={`選択肢${i}（英語）`}
                                        className=' col p-inputtext-lg md:w-full content-width'
                                    /> */}
                                </div>
                    </section>
                </div>
            </div>
        </div>
    );
}