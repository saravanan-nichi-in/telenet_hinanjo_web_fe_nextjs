import Link from "next/link";
/*eslint no-undef: 0*/

export const AdminPlaceDetailService = {
    getData() {
        return [
            {
                "避難所": "日本の避難所",
                "郵便番号":"190-0012",
                "住所":"東京都 立川市曙町",
                "初期郵便番号":"190-0012",
                "初期住所":"東京都 立川市曙町",
                "避難可能人数":"20000人",
                "電話番号":"0768324561",
                "緯度 / 経度":"36.204824 / 138.252924",
                "URL":<Link href="https://rakuraku.nichi.in/dashboard?hinan=1">https://rakuraku.nichi.in/dashboard?hinan=1</Link>,
                "スマートフォン登録URL": <Link href="https://rakuraku.nichi.in/temp_register_member?hinan=1">https://rakuraku.nichi.in/temp_register_member?hinan=1</Link>,
                "海抜": "5000m",
                "状態":"有効"
            }
        ]
    },
    getAdminsPlaceDetailSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsPlaceDetailMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsPlaceDetailLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsPlaceDetailXLarge() {
        return Promise.resolve(this.getData());
    },

}