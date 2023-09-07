/*eslint no-undef: 0*/

import Link from "next/link";

export const AdminStockpileMasterService = {
    getData() {
        return [
            {
                "Sl No": 1,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">牛乳</Link>,
                "種別": "食料", "保管期間 (日)": "4"
            },
            {
                "Sl No": 2,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">testcate</Link>,
                "種別": "備蓄品", "保管期間 (日)": "1"
            },
            {
                "Sl No": 3,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">test1</Link>,
                "種別": "備蓄品", "保管期間 (日)": "30"
            },
            {
                "Sl No": 4,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">Testing 09 Testing 09 Testing 09 Testing 090</Link>,
                "種別": "Testing 09 Testing 09 Testing 09 Testing 09 Testing 09", "保管期間 (日)": "1"
            },
            {
                "Sl No": 5,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">2Product TypeProduct TypeProduct TypeProduct TypeProduct TypeProduct TypeProduct TypeProduct Type</Link>,
                "種別": "Stockpile Information Product Type Product TypeProduct TypeProduct Type", "保管期間 (日)": "30"
            },
            {
                "Sl No": 6,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">new12313123</Link>,
                "種別": "new12313123", "保管期間 (日)": "30"
            },
            {
                "Sl No": 7,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">new1</Link>,
                "種別": "new", "保管期間 (日)": "30"
            },
            {
                "Sl No": 8,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">new</Link>,
                "種別": "new", "保管期間 (日)": "30"
            },
            {
                "Sl No": 9,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">uuuuu</Link>,
                "種別": "uuuuu", "保管期間 (日)": "30"
            },
            {
                "Sl No": 10,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">kkkk</Link>,
                "種別": "kkkkk", "保管期間 (日)": "30"
            },
            {
                "Sl No": 11,
                "備蓄品名": <Link href="/admin/stockpile/master/edit/1">kkk</Link>,
                "種別": "kkk", "保管期間 (日)": "30"
            },
        ]

    },
    getAdminsStockpileMasterSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsStockpileMasterMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsStockpileMasterLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsStockpileMasterXLarge() {
        return Promise.resolve(this.getData());
    },

}