/*eslint no-undef: 0*/

export const AdminHistoryPlaceService = {
    getData() {
        return [
            {
                "Sl No": 1,
                "報告日時": "2023年09月12日 20:00",
                "地区": "東京都	",
                "避難所名": "日比谷公園避難所",
                "避難所名 (フリガナ)": "日比谷公園避難所",
                "所在地（経度）": "千代田区日比谷公園",
                "所在地（緯度)": 35.6737096,
                "所在地（経度1）": 139.7558608,
                "外部公開": "いいえ",
                "開設状況": "開設",
                "避難者数": "48",
                "満空状況": "満員",
                "開設日時": "2023年09月09日 23:01",
                "閉鎖日時": "2023年09月30日 23:01",
                "備考": "-"
            },
            {
                "Sl No": 2,
                "報告日時": "2023年09月12日 20:00",
                "地区": "東京都	",
                "避難所名": "芝公園避難所",
                "避難所名 (フリガナ)": "-",
                "所在地（経度）": "港区芝公園",
                "所在地（緯度)": 35.6550909,
                "所在地（経度1）": 133.7480491,
                "外部公開": "いいえ",
                "開設状況": "開設",
                "避難者数": "5",
                "満空状況": "満員",
                "開設日時": "-",
                "閉鎖日時": "-",
                "備考": "-"
            }
        ]
    },
    getAdminsHistoryPlaceSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getAdminsHistoryPlaceMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getAdminsHistoryPlaceLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getAdminsHistoryPlaceXLarge() {
        return Promise.resolve(this.getData());
    },

}