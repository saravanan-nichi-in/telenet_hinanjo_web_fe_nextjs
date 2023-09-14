/*eslint no-undef: 0*/
import Link from "next/link";

export const AdminPlaceService = {
    getData() {
        return [
            {
                "ID": 1,
                "避難所": <Link href="/admin/place/detail/1">日本の避難所</Link>,
                "住所": "190-0012 東京都 立川市曙町",
                "避難可 能人数": "20000人",
                "電話番号": "0768324561	"
            },
            {
                "ID": 2,
                "避難所": <Link href="/admin/place/detail/1">広島市中区東白島町</Link>,
                "住所": "730-0004 広島県 広島市中区東白島町",
                "避難可 能人数": "32000人",
                "電話番号": "0976543211"
            },
            {
                "ID": 3,
                "避難所": <Link href="/admin/place/detail/1">テスト</Link>,
                "住所": "105-0011 東京都 港区芝公園",
                "避難可 能人数": "1000人",
                "電話番号": "0238971933"
            },
            {
                "ID": 4,
                "避難所": <Link href="/admin/place/detail/1">Test Texas</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 5,
                "避難所": <Link href="/admin/place/detail/1">テスト日本大阪</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 6,
                "避難所": <Link href="/admin/place/detail/1">避難所B</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 7,
                "避難所": <Link href="/admin/place/detail/1">Testモバイルアプリ1</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 8,
                "避難所": <Link href="/admin/place/detail/1">test test test</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 9,
                "避難所": <Link href="/admin/place/detail/1">Test APP Test</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 10,
                "避難所": <Link href="/admin/place/detail/1">Gose</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 11,
                "避難所": <Link href="/admin/place/detail/1">新しい避難所</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
            {
                "ID": 12,
                "避難所": <Link href="/admin/place/detail/1">APP Testing1</Link>,
                "住所": "180-0003 神奈川県 <Test>武蔵野市吉祥寺南町",
                "避難可 能人数": "1800人",
                "電話番号": "0000000000"
            },
        ]
    },
    getAdminsPlaceSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsPlaceMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsPlaceLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsPlaceXLarge() {
        return Promise.resolve(this.getData());
    },

}