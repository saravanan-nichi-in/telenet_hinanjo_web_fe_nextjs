/*eslint no-undef: 0*/
import Link from "next/link";

export const StaffDetailService = {
    getData() {
        return [
            {
                No: "2",
                氏名: <Link href="">Staff 2</Link>,
                メール: "staff2@gmail.com",
                電話番号: "0900000000"
            }
        ]
    },
    getStaffSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getStaffMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getStaffLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getStaffXLarge() {
        return Promise.resolve(this.getData());
    },

}