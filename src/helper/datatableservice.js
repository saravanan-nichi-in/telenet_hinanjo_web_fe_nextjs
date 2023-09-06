import Link from "next/link";
/*eslint no-undef: 0*/

export const CustomerService = {
    getData() {
        return [
            { "No.": "2", 
            "氏名":<Link href="#">Staff 2</Link>,
             "メール": "staff2@gmail.com", 
             "電話番号": "0900000000"}
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