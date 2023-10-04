import Link from "next/link";
/*eslint no-undef: 0*/

export const AdminManagementService = {
    getData() {
        return [
            {
                "No.": "2",
                "氏名": <Link href="">Admin 1</Link>,
                "メール": "admin1@gmail.com"
            }
        ]
    },
    getAdminsSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsXLarge() {
        return Promise.resolve(this.getData());
    },

}