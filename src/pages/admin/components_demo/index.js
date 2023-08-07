import React, { useState } from 'react';
import { Divider } from 'primereact/divider';
import IconPosBtn from '@/components/Buttons/iconPositionBtn';
import RoundedBtn from '@/components/Buttons/roundedbtn';
import DividerComponent from '@/components/Divider/divider';
import CalendarComponent from '@/components/date/calendar';
import InputIcon from '@/components/input/inputIcon';
import InputSwitcher from '@/components/switch/inputSwitch';
import TogglBtn from '@/components/switch/toglbtn';
import Datepicker from '@/components/date/datePicker';
import InputLeftGroup from '@/components/input/inputLeftGroup';
import InputRightGroup from '@/components/input/inputRightGroup';
import TextArea from '@/components/input/inputTextArea';
import InputSelect from '@/components/input/dropDown';
import RadioBtn from '@/components/input/radiobtn';
import InputGroup from '@/components/input/inputGroup';
import CheckBox from '@/components/input/checkbox';

function ComponentsDemo() {
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
                                <IconPosBtn icon={"pi pi-star-fill"} radius={"border-round-lg"} /> <br />
                                <IconPosBtn text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconpos={"right"} radius={"border-round-lg"} /> <br />

                                <IconPosBtn text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconpos={"right"} radius={"border-round-lg"} /> <br />
                                <IconPosBtn text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconpos={"left"} /> <br />
                                <RoundedBtn text={"避難者状況一覧"} mx={"mx-0"} icon={"pi pi-star-fill"} iconpos={"right"} radius={"border-round-3xl"} bg={"bg-orange-500"} hoverBg={"hover:bg-orange-600"} borderColor={"border-cyan-800"} /> <hr />
                            </div>
                        </div>

                        < div class="card ">
                            <h2> Date Components</h2>
                            <h6>Current date and time component</h6>
                            <Datepicker additionalclass={"pb-3"} />
                            <h6>Calendar component</h6>
                            <CalendarComponent placeholder={"yy-mm-dd"} />
                        </div>
                        < div class="card ">
                            <h2>input icons</h2>
                            <InputIcon additionalclass={"mr-2"} placeholder="input-left-icon" icon="pi pi-search" iconpos="p-input-icon-left" />
                            <InputIcon additionalclass={"mr-2"} placeholder="input-right-icon" icon="pi pi-search" iconpos="p-input-icon-right" />
                            <InputIcon additionalclass={"mr-2"} placeholder="input" />
                            <InputIcon additionalclass={"mb-1rem"} /> <br/>
                            <InputIcon readOnly={"true"} value={10}/>
                            <div class="pt-3">
                                <h2>input group</h2>
                                <InputLeftGroup icon={"pi pi-user"} placeholder={"username"} additionalclass={"w-4 pb-2"} />
                                <InputRightGroup icon={"pi pi-user"} placeholder={"username"} additionalclass={"w-4 pb-2 "} />
                                <InputGroup additionalclass={"w-4"}value={value} onChange={(e) => setValue(e.target.value)} onclick={handleIncrement} onclk={handleDecrement} lefticon={"pi pi-arrow-up-right"} righticon={"pi pi-arrow-down-right"}/>
                            </div>
                            <div class="pt-3">
                                <h2>TextArea</h2>
                                <TextArea additionalclass={"w-4"} row={5} />
                            </div>
                            <div class="pt-3">
                                <h2>Input and Dropdown</h2>
                                <InputSelect value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionlabel="name" />
                            </div>
                            <div class="pt-3">
                                <h2>Radio button</h2>
                                <RadioBtn inputid={"ingredient1"} name={"chck"} value={"cake"} onChange={(e) => setIngredient(e.value)} checked={ingredient === 'cake'} />
                            </div>
                           
                            <div class="pt-3">
                                <h2> Checkbox</h2>
                                <CheckBox addclass={"pr-1"} inputId="ingredient2" name="pizza" value="Mushroom" onChange={onIngredientsChange} checked={ingredients.includes('Mushroom')} />
                                <CheckBox addclass={"pr-1"}additionalclass={"pt-1"} inputId="ingredient1" name="pizza" value="Cheese" onChange={onIngredientsChange} checked={ingredients.includes('Cheese')} />
                            </div>
                        </div>
                        <div class="card" >
                            <h2>Switch Component</h2>
                            <InputSwitcher checked={checked1} onChange={(e) => setChecked1(e.value)} /> <br />
                            <TogglBtn checked={checked1} onlabel={"on"} offLabel={"off"} onChange={(e) => setChecked1(e.value)} />
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

export default ComponentsDemo