import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

const DateTimeCalendar = (props) => {
    const {
        parentClass,
        dateTimeProps = {}
    } = props;
    const {
        custom,
        id,
        name,
        onBlur,
        onChange,
        dateTimeClass,
        icon,
        iconPos,
        disabledDates,
        disabledDays,
        minDate,
        maxDate,
        selectionMode,
        readOnlyInput,
        showIcon,
        disabled,
        placeholder,
        ...restProps
    } = dateTimeProps;
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
        <div className={`${parentClass} ${custom || 'custom_input'}`}>
            <Calendar className={` ${dateTimeClass}`}
                id={id}
                showTime
                value={date}
                name={name}
                onBlur={onBlur}
                onChange={(e) => {
                    setDate(e.value);
                    if (onChange) {
                        onChange(e);
                    }
                }
                }
                dateFormat="yy年mm月dd日"
                disabledDates={disabledDates}
                disabledDays={disabledDays}
                minDate={minDate}
                maxDate={maxDate}
                selectionMode={selectionMode || "single"}
                readOnlyInput={readOnlyInput}
                icon={icon || "pi pi-calendar"}
                iconPos={iconPos || "right"}
                showIcon={showIcon}
                disabled={disabled}
                placeholder={placeholder}
                {...restProps}
            />
        </div>
    );
}

export default DateTimeCalendar             