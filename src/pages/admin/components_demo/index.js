import React, { useContext,useState } from 'react';
import { useRouter } from 'next/router'
import { Divider } from 'primereact/divider';
import IconPosBtn from '@/components/Buttons/iconPositionBtn';
import RoundedBtn from '@/components/Buttons/roundedbtn';
import DividerComponent from '@/components/Divider/divider';
import CalendarComponent from '@/components/date/calendar';
import InputIcon from '@/components/input/inputIcon';
import { InputText } from 'primereact/inputtext';
import InputSwitcher from '@/components/switch/inputSwitch';
import TogglBtn from '@/components/switch/toglbtn';
function ComponentsDemo() {
    const [checked1, setChecked1] = useState(false);



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
                                <IconPosBtn icon={"pi pi-star-fill"} radius={"border-round-lg"} /> <br/>
                                <IconPosBtn text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconpos={"right"} radius={"border-round-lg"} /> <br />

                                <IconPosBtn text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconpos={"right"} radius={"border-round-lg"} /> <br />
                                <IconPosBtn text={"避難者状況一覧"} icon={"pi pi-star-fill"} iconpos={"left"} /> <br />
                                <RoundedBtn text={"避難者状況一覧"} mx={"mx-0"} icon={"pi pi-star-fill"} iconpos={"right"} radius={"border-round-3xl"} bg={"bg-orange-500"} hoverBg={"hover:bg-orange-600"} borderColor={"border-cyan-800"} /> <hr />
                            </div>
                        </div>
                       
                        < div class="card ">
                       <h2> Date Components</h2>
                            <CalendarComponent width={"w-3"} placeholder={"yy-mm-dd"} />
                        </div>
                        < div class="card  ">
                       <h2>input icons</h2> 
                        <InputIcon placeholder="input-left-icon"  icon="pi pi-search" iconpos="p-input-icon-left"/> &nbsp;
                        <InputIcon placeholder="input-right-icon"  icon="pi pi-search" iconpos="p-input-icon-right"/> &nbsp;
                        <InputIcon placeholder="input"  /> &nbsp;
                        <InputIcon /> 
                        </div>
                        <div class="card" >
                            <h2>Switch Component</h2>
                        <InputSwitcher checked={checked1} onchange={(e) => setChecked1(e.value)}/> <br/>
                        <TogglBtn checked={checked1} onlabel={"on"} offLabel={"off"} onchange={(e) => setChecked1(e.value)}/>
                        </div>
                        <div class="card">
                            <h2> Divider Component </h2>
                            <DividerComponent width={"w-full"}/>
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