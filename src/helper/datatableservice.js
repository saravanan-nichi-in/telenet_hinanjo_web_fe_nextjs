/*eslint no-undef: 0*/
import Link from "next/link";

export const CustomerService = {
    getData() {
        return [
            {
                No: "2",
                氏名: <Link href="/admin/staff-management/detail/1">Staff 2</Link>,
                メール: "staff2@gmail.com",
                電話番号: "0900000000"
            }
        ]
    },
    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    },

}