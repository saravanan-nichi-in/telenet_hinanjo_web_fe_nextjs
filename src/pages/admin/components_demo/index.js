import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import IconPosBtn from '@/components/button/iconPositionBtn';
import RoundedBtn from '@/components/button/roundedbtn';
import DividerComponent from '@/components/divider/divider';
import CalendarComponent from '@/components/date/calendar';
import InputIcon from '@/components/input/inputIcon';
import InputSwitcher from '@/components/switch/inputSwitch';
import TogglBtn from '@/components/switch/toglbtn';
import Datepicker from '@/components/date/datePicker';
import TextArea from '@/components/input/inputTextArea';
import InputSelect from '@/components/input/dropDown';
import RadioBtn from '@/components/input/radiobtn';
import InputGroup from '@/components/input/inputGroup';
import CheckBox from '@/components/input/checkbox';
import Select from '@/components/input/select';
import Label from '@/components/input/label';
import InputLeftRightGroup from '@/components/input/inputLeftRightGroup';
import DeleteModal from '@/components/modal/deleteModal';
import TableData from '@/components/datatable/datatable';
import { CustomerService } from '@/services/service';
import Linker from '@/components/link/link';
import Images from '@/components/image/image';
import Range from '@/components/date/range';
import TimePicker from '@/components/date/time';
import IncrementDecrement from '@/components/input/incrementDecrement';



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
        { label: '現在の避難者数', value: 'NY' },
        { label: '避難所の混雑率', value: 'RM' },
        { label: '要配慮者の避難者数', value: 'LDN' },
    ];
    const [data, setData] = useState(options[0].value);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        CustomerService.getCustomersMedium().then((data) => setCustomers(data));
    }, []);

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
                    <IconPosBtn text={"Edit"} />
                </div>
            ),
        }, {
            field: 'actions',
            header: 'Delete Actions',
            body: (rowData) => (
                <div>
                    <IconPosBtn severity={"danger"} text={"delete"} />
                </div>
            ),
        },
    ];
    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className={"page_header"}
                        // borderBottom: "1px solid black",
                        >
                            不足物資一覧
                        </h5>
                        <Divider />
                        <div class="card ">
                            <h2> Buttons Component </h2>
                            <div>
                                <IconPosBtn icon={"pi pi-star-fill"} radius={"border-round-lg"} additionalClass={"mb-1"} />
                                <IconPosBtn additionalClass={"mb-1"} text={"避難者状況一覧"} />
                                <IconPosBtn additionalClass={"mb-1"} text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconPos={"right"} radius={"border-round-lg"} />
                                <IconPosBtn additionalClass={"mb-1"} text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconPos={"right"} radius={"border-round-lg"} />
                                <IconPosBtn additionalClass={"mb-1"} text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconPos={"left"} />
                                <RoundedBtn text={"避難者状況一覧"} mx={"mx-0"} icon={"pi pi-star-fill"} iconPos={"right"} radius={"border-round-3xl"} bg={"bg-orange-500"} hoverBg={"hover:bg-orange-600"} borderColor={"border-cyan-800"} /> <hr />
                            </div>
                        </div>

                        < div class="card ">
                            <h2> Date Components</h2>
                            <h6>Current date and time component</h6>
                            <Datepicker additionalClass={"pb-1"} />
                            <h6>Date Picker</h6>
                            <CalendarComponent placeholder={"yy-mm-dd"} width={"w-4"} />
                            <h6>Date Range Picker</h6>
                            <Range width={"w-4"}/>
                            <h6>Time Picker</h6>
                            <TimePicker width={"w-4"}/>
                            <h6>Date and Time</h6>

                        </div>
                        < div class="card ">
                            <h2>input icons</h2>
                            <InputIcon additionalClass={"w-3"} placeholder="input-left-icon" icon="pi pi-search" iconPos="p-input-icon-left" /><br />
                            <InputIcon additionalClass={"w-3"} placeholder="input-right-icon" icon="pi pi-search" iconPos="p-input-icon-right" />
                            <InputIcon additionalClass={"mt-3 "} inputClassName={"w-3"} placeholder="input" />
                            <InputIcon additionalClass={"mt-3 "} inputClassName={"w-3"} />
                            <InputIcon additionalClass={"mt-3"} inputClassName={"w-3"} readOnly={"true"} value={20} />
                            <div class="pt-3">
                                <h2>input group</h2>
                                <InputLeftRightGroup rightIcon={"pi pi-user"} placeholder={"username"} additionalClass={"xl:w-4 pb-2 "} />
                                <InputLeftRightGroup type="password" leftIcon={"pi pi-user"} placeholder={"password"} additionalClass={"xl:w-4 pb-2 "} />
                                <InputGroup type="number" additionalClass={"xl:w-4 sm:w-full"} value={value} onChange={(e) => setValue(e.target.value)} onClk={handleIncrement} onclick={handleDecrement} rightIcon={"pi pi-plus"} leftIcon={"pi pi-minus"} />
                            </div>
                            <div class="pt-3">
                                <h2>TextArea</h2>
                                <TextArea additionalClass={"w-full"} row={5} cols={10} />
                            </div>
                            <div class="pt-3">
                                <h2>Input and Dropdown</h2>
                                <InputSelect value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" />
                            </div>
                            <div class="pt-3">
                                <h2>Select</h2>
                                <Select additionalClass={"custom_dropdown_items"} value={data} options={options} onChange={(e) => setData(e.value)} placeholder="Select a City" />
                            </div>
                            <div class="pt-3">
                                <h2>Label</h2>
                                <Label htmlFor="email" label={"email"} additionalClass={"font-18 text-primary"} />
                            </div>
                            <div class="pt-3">
                                <h2>Radio button</h2>
                                <RadioBtn radioClass={"mr-1"} inputId={"ingredient1"} name={"chck"} value={"Cake"} onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Cake'} />

                            </div>

                            <div class="pt-3">
                                <h2> Checkbox</h2>
                                <CheckBox addClass={"pr-1"} inputId="ingredient2" name="pizza" value="Mushroom" onChange={onIngredientsChange} checked={ingredients.includes('Mushroom')} />
                                <CheckBox addClass={"pr-1"} additionalClass={"pt-1"} inputId="ingredient1" name="pizza" value="Cheese" onChange={onIngredientsChange} checked={ingredients.includes('Cheese')} />
                            </div>

                        </div>
                        <div class="card">
                        <h2>Increment Decrment</h2>
                        <IncrementDecrement value={5} additionalClass={"xl:w-4 sm:w-full"} />
                        </div>
                        <div class="card" >
                            <h2>Switch Component</h2>
                            <InputSwitcher checked={checked1} onChange={(e) => setChecked1(e.value)} /> <br />
                            <TogglBtn checked={checked1} onLabel={"on"} offLabel={"off"} onChange={(e) => setChecked1(e.value)} />
                        </div>
                        <div class="card" >
                            <h2>Delete Modal</h2>
                            <DeleteModal modalClass={"w-30rem"} content1={"一度削除したデータは、元に戻せません"} content2={"削除してもよろしいでしょうか？"} btnText={"削除"} header={"確認情報"} text={"削除"} />
                            <h2>Renew Modal</h2>
                            <DeleteModal modalClass={"w-50rem"} position={"top"} header={"確認情報"} content={"避難所の満員状態を切り替えてもよろしいでしょうか？"} btnText={"更新"} checked={checked1} onChange={(e) => setChecked1(e.value)} />
                        </div>
                        <div class="card">
                            <h2>DataTable with pagination</h2>
                            <TableData customActionsField="actions" paginator="true" value={customers} columns={columns} />
                            <h2>DataTable without pagination</h2>
                            <TableData customActionsField="actions" value={customers} columns={columns} />
                        </div>
                        <div class="card">
                        <h2> Link</h2>
                            <Linker linkClass={"text-primary-600"} textWithUnderline={"PRIME"} link={"https://primereact.org/"}/>
                            <Linker text={"PRIME"} link={"https://primereact.org/"}/>
                        </div>
                        <div class="card">
                        <h2> Image</h2>
                            <Images width={"250"} src={"https://images.ctfassets.net/23aumh6u8s0i/c04wENP3FnbevwdWzrePs/1e2739fa6d0aa5192cf89599e009da4e/nextjs"}/>
                            <Images width={"250"} src={"https://images.ctfassets.net/23aumh6u8s0i/c04wENP3FnbevwdWzrePs/1e2739fa6d0aa5192cf89599e009da4e/nextjs"} preview="true"/>
                        </div>
                        <div class="card">
                            <h2> Divider Component </h2>
                            <DividerComponent width={"w-full"} />
                            <DividerComponent align={"top"} width={"w-2"} layout={"vertical"} />&nbsp;
                            <DividerComponent align={"center"} width={"w-25rem"} />
                        </div>
                       
                    </section>
                </div>
            </div>
        </div>
    );
}

