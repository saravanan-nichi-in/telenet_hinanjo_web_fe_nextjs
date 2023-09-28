/*eslint no-undef: 0*/


export const AdminEvacueeFamilyDetailService = {
    getEvacueeFamilyDetailData() {
        return [
            { id: '1',
            代表者: '代表者',
            '氏名 (フリガナ)': "Test0199",
            '氏名 (漢字)':'-',
            生年月日:'2023年09月14日',
            年齢:'0',
            年齢_月	:'0',
            性別:'男',
            作成日:'2023年09月15日 (金) 15:30',
            更新日:'2023年09月15日 (金) 17:02'
         }
        ];
    },

    getEvacueeFamilyDetailWithOrdersData() {
        return [
            {
                id: '1',
                代表者: '代表者',
                '氏名 (フリガナ)': "Test0199",
                '氏名 (漢字)':'-',
                生年月日:'2023年09月14日',
                年齢:'0',
                年齢_月	:'0',
                性別:'男',
                作成日:'2023年09月15日 (金) 15:30',
                更新日:'2023年09月15日 (金) 17:02',
                orders: [{
                    住所: '〒 100-0001 東京都 千代田区千代田',
                    要配慮者番号: '--',
                    紐付コード: '--',
                    備考: '--',
                    '現在の滞在場所 *': '-'
                },
                ]
            }
        ];
    },

    getEvacueeFamilyDetailMini() {
        return Promise.resolve(this.getEvacueeFamilyDetailData().slice(0, 5));
    },

    getEvacueeFamilyDetailSmall() {
        return Promise.resolve(this.getEvacueeFamilyDetailData().slice(0, 10));
    },

    getEvacueeFamilyDetail() {
        return Promise.resolve(this.getEvacueeFamilyDetailData());
    },

    getEvacueeFamilyDetailWithOrdersSmall() {
        return Promise.resolve(this.getEvacueeFamilyDetailWithOrdersData().slice(0, 10));
    },

    getEvacueeFamilyDetailWithOrders() {
        return Promise.resolve(this.getEvacueeFamilyDetailWithOrdersData());
    }
};