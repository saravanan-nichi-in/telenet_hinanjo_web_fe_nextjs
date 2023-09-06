import Link from "next/link";
/*eslint no-undef: 0*/

export const AdminMaterialService = {
    getData() {
        return [
            {
                "ID": 1,
                "物資": <Link href="/admin/material/edit/1">Test1</Link>,
                "単位": "2"
            },
            {
                "ID": 2,
                "物資": <Link href="/admin/material/edit/1">Test2</Link>,
                "単位": "2"
            },
            {
                "ID": 3,
                "物資": <Link href="/admin/material/edit/1">Test3</Link>,
                "単位": "3"
            },
            {
                "ID": 4,
                "物資": <Link href="/admin/material/edit/1">Test6</Link>,
                "単位": "5"
            },
        ]
    },
    getAdminsMaterialSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsMaterialMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsMaterialLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsMaterialXLarge() {
        return Promise.resolve(this.getData());
    },

}