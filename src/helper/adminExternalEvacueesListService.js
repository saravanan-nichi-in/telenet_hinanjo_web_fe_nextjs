/*eslint no-undef: 0*/

import Link from "next/link"

export const AdminExternalEvacueesList = {
    getData() {
        return [
            {
                "Sl No": 1,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 2,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 3,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 4,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 5,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 6,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 7,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 8,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 9,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 10,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 11,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
            {
                "Sl No": 12,
                "避難場所種別": '市内',
                "場所": "秋葉原",
                "食料等の支援": "はい",
                "人数": <Link className="text-higlight" href="/admin/external/family/detail">2</Link>,
                "避難所": "Vacant test",
                "メールアドレス": "testuser45@gmail.com",
                "郵便番号": "190-0012",
                "県": '東京都',
                "住所": '立川市曙町'
            },
        ]
    },
    getAdminsExternalEvacueesListSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsExternalEvacueesListMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsExternalEvacueesListLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsExternalEvacueesListXLarge() {
        return Promise.resolve(this.getData());
    },

}