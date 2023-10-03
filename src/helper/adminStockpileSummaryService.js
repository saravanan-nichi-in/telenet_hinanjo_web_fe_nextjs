/*eslint no-undef: 0*/
import Link from "next/link";

export const StockpileSummaryService = {
    getStockpileSummaryData() {
        return [
            { id: '1', 避難所: <Link href="">日比谷公園避難所</Link>, 通知先: "--" },
            { id: '2', 避難所: <Link href="">芝公園避難所</Link>, 通知先: "--" },
            { id: '3', 避難所: <Link href="">避難所1</Link>, 通知先: "sandeep.r@nichi.com" },
            { id: '4', 避難所: <Link href="">らくらく避難所</Link>, 通知先: "sandeep.r@nichi.com" }
        ];
    },

    getStockpileSummaryWithOrdersData() {
        return [
            {
                id: '1',
                避難所: <Link href="">日比谷公園避難所</Link>,
                通知先: "--",
                orders: [{
                    id: '1-1',
                    種別: '食料',
                    備蓄品名: 'Food',
                    数量: '3',
                    有効期限: '2023年09月30日'
                },
                ],
                orders1:[{
                    id: '1-1',
                    種別: '食料',
                    備蓄品名: 'Food',
                    数量: '3',
                    有効期限: '2023年09月30日'
                }]
            },
            {
                id: '2',
                避難所: <Link href="">芝公園避難所</Link>,
                通知先: "--",
                orders: [],
                orders1:[]

            },
            {
                id: '3',
                避難所: <Link href="">避難所1</Link>,
                通知先: "sandeep.r@nichi.com",
                orders: [],
                orders1:[]

            },
            {
                id: '4',
                避難所: <Link href="">らくらく避難所</Link>,
                通知先: "sandeep.r@nichi.com",
                orders: [],
                orders1:[]

            }

        ];
    },

    getStockpileSummaryMini() {
        return Promise.resolve(this.getStockpileSummaryData().slice(0, 5));
    },

    getStockpileSummarySmall() {
        return Promise.resolve(this.getStockpileSummaryData().slice(0, 10));
    },

    getStockpileSummary() {
        return Promise.resolve(this.getStockpileSummaryData());
    },

    getStockpileSummaryWithOrdersSmall() {
        return Promise.resolve(this.getStockpileSummaryWithOrdersData().slice(0, 10));
    },

    getStockpileSummaryWithOrders() {
        return Promise.resolve(this.getStockpileSummaryWithOrdersData());
    }
};