import Link from "next/link";
/*eslint no-undef: 0*/

export const AdminSpecialCareService = {
    getData() {
        return [
            {
                "ID": 1,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">妊産婦</Link>,
                "要配慮者事項（英語)": "Pregnant woman"
            },
            {
                "ID": 2,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">乳幼児</Link>,
                "要配慮者事項（英語)": "Infant"
            },
            {
                "ID": 3,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">障がい者</Link>,
                "要配慮者事項（英語)": "Persons with disabilities"
            },
            {
                "ID": 4,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">要介護者</Link>,
                "要配慮者事項（英語)": "Nursing care recipient"
            },
            {
                "ID": 5,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">医療機器利用者</Link>,
                "要配慮者事項（英語)": "Medical device users"
            },
            {
                "ID": 6,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">アレルギー</Link>,
                "要配慮者事項（英語)": "Allergies"
            },
            {
                "ID": 7,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">外国籍</Link>,
                "要配慮者事項（英語)": "Foreign nationality"
            },
            {
                "ID": 9,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">その他</Link>,
                "要配慮者事項（英語)": "Other"
            },
            {
                "ID": 13,
                "要配慮者事項": <Link href="/admin/special/care/edit/1">テーブル</Link>,
                "要配慮者事項（英語)": "Tables"
            },
        ]
    },
    getAdminsSpecialCareSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsSpecialCareMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsSpecialCareLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsSpecialCareXLarge() {
        return Promise.resolve(this.getData());
    },

}