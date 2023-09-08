import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

const TimeCalendar = (props) => {
    const { parentClass, parentStyle, timeProps = {} } = props
    const { height, timeClass, id, style, icon, showIcon, iconPos, disabledDates,
        disabledDays, minDate, maxDate, selectionMode, readOnlyInput, disabled, placeholder, ...restProps } = timeProps
    const [date, setDate] = useState(props.date);

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
        <div className={`${parentClass}`} style={parentStyle}>
            <Calendar className={` ${height || 'custom_input'} ${timeClass}`}
                id={id}
                style={style}
                value={date}
                icon={icon || "pi pi-clock"}
                showIcon={showIcon}
                iconPos={iconPos || "right"}
                disabledDates={disabledDates}
                disabledDays={disabledDays}
                minDate={minDate} maxDate={maxDate}
                selectionMode={selectionMode || "single"}
                onChange={(e) => setDate(e.value)}
                dateFormat="yy年mm月dd日"
                timeOnly
                readOnlyInput={readOnlyInput}
                showSeconds
                disabled={disabled}
                placeholder={placeholder}
                hourFormat="24"
                {...restProps}
            />
        </div>
    );
}
export default TimeCalendar             