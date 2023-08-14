import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

const DateTimePicker = (props) => {

    const [date, setDate] = useState(null);

    addLocale('en', {
        firstDayOfWeek: 0,
        dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
        dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
        monthNames: [
            '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
        ],
        monthNamesShort: [
            '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
        ],
        today: '今日',
        clear: 'クリア'
    });



    return (
        <div className={`${props.parentClass}`}>
            <Calendar className={`${props.width} ${props.height} ${props.dateTimeClass}`} id="time24" showTime value={date} onChange={(e) => setDate(e.value)} dateFormat="yy年mm月dd日" disabledDates={props.disabledDates} disabledDays={props.disabledDays} minDate={props.minDate} maxDate={props.maxDate} selectionMode={props.selectionMode?props.selectionMode:"single"} readOnlyInput icon={props.icon?props.icon:"pi pi-calendar"} iconPos={props.iconPos ?props.iconPos:"right"} showIcon placeholder={props.placeholder} />
        </div>
    );

}
export default DateTimePicker             