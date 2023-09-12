import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

const DateCalendar = (props) => {
    const { parentClass, dateProps = {} } = props;
    const { height, id, name, onBlur, dateClass, icon, iconPos, disabledDates,
        disabledDays, minDate, maxDate, selectionMode, onChange, showIcon, disabled, readOnlyInput, placeholder, ...restProps } = dateProps;
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
        <div className={`${parentClass}`}>
            <Calendar className={` ${dateClass} ${height || 'custom_input'}`}
                id={id}
                name={name}
                value={date}
                icon={icon || "pi pi-calendar"}
                iconPos={iconPos || "right"}
                disabledDates={disabledDates}
                disabledDays={disabledDays}
                onBlur={onBlur}
                onChange={(e) => {
                    setDate(e.value);
                    if (onChange) {
                        onChange(e); // Call the onChange prop if provided
                    }
                }
                }
                dateFormat="yy年mm月dd日" minDate={minDate}
                maxDate={maxDate}
                selectionMode={selectionMode || "single"}
                showIcon={showIcon}
                disabled={disabled}
                readOnlyInput={readOnlyInput}
                placeholder={placeholder}
                {...restProps}
            />
        </div>
    );
}
export default DateCalendar 