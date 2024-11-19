import { describe, expect, test } from "vitest";
import { get } from "./track";

describe("get", () => {
    test("should return tracking data for 4px carrier", async () => {
        const mockResponse = {"echo":{"trackingID":"EB795709485CN"},"data":{"currentStatus":"Delivered","currentStatusDescription":"Shipment delivered.","daysInTransit":8,"destination":{"code":"JP","name":"Japan"},"origin":{"code":"CN","name":"China"},"transitEvents":[{"description":"【日本】已妥投","latlng":[0,0],"location":"日本","timestamp":1693965300000},{"description":"【日本】安排投递","latlng":[0,0],"location":"日本","timestamp":1693962840000},{"description":"【日本】安排投递","latlng":[0,0],"location":"日本","timestamp":1693961880000},{"description":"已到达【日本】投递局","latlng":[0,0],"location":"日本","timestamp":1693954740000},{"description":"到达境外经转局","latlng":[0,0],"location":"日本","timestamp":1693929060000},{"description":"离开【日本】处理中心","latlng":[0,0],"location":"日本","timestamp":1693880340000},{"description":"境外进口海关放行","latlng":[0,0],"location":"日本","timestamp":1693880280000},{"description":"境外进口海关留存待验(等待提交给边境机构/安全部门)","latlng":[0,0],"location":"Unknown","timestamp":1693859400000},{"description":"送交境外进口海关","latlng":[0,0],"location":"Unknown","timestamp":1693859340000},{"description":"到达寄达地处理中心","latlng":[0,0],"location":"Unknown","timestamp":1693851900000},{"description":"到达寄达地","latlng":[0,0],"location":"Unknown","timestamp":1693810560000},{"description":"飞机进港","latlng":[0,0],"location":"Unknown","timestamp":1693629960000},{"description":"航空公司启运","latlng":[0,0],"location":"Unknown","timestamp":1693616290000},{"description":"航空公司接收","latlng":[0,0],"location":"Unknown","timestamp":1693551841000},{"description":"邮件离开【广州市国际互换局】,正在发往【广州市国际交换站】","latlng":[0,0],"location":"广州市","timestamp":1693424134000},{"description":"邮件到达【广州市国际互换局】,即将进行分拣","latlng":[0,0],"location":"广州市","timestamp":1693424099000},{"description":"【广州市国际互换局】已出口直封","latlng":[0,0],"location":"广州市","timestamp":1693416556000},{"description":"出口海关/放行","latlng":[0,0],"location":"广州市","timestamp":1693416436000},{"description":"送交出口海关","latlng":[0,0],"location":"广州市","timestamp":1693332422000},{"description":"邮件离开【广东省国际公司直属花地湾营业部】,正在发往【广州国际】","latlng":[0,0],"location":"广州市","timestamp":1693317744000},{"description":"离开【广东省国际公司直属花地湾营业部】,下一站【广州国际】","latlng":[0,0],"location":"广州市","timestamp":1693317744000},{"description":"邮件已在【广东省国际公司直属花地湾营业部】完成分拣,准备发出","latlng":[0,0],"location":"广州市","timestamp":1693317741000},{"description":"邮件在【广东省国际公司直属花地湾营业部】完成分拣，准备发往【广州国际】","latlng":[0,0],"location":"广州市","timestamp":1693317741000},{"description":"【广东省国际公司直属花地湾营业部】已收寄成功","latlng":[0,0],"location":"广州市","timestamp":1693315347000},{"description":"【广东省国际公司直属花地湾营业部】已收寄,揽投员:周少佳,电话:13927721343","latlng":[0,0],"location":"广州市","timestamp":1693315347000},{"description":"中国邮政 已收取邮件","latlng":[0,0],"location":"Unknown","timestamp":1693315346000},{"description":"Depart from facility to service provider.","latlng":[0,0],"location":"ShaTian,DongGuan","timestamp":1693269325000},{"description":"Shipment arrived at facility and measured.","latlng":[0,0],"location":"ShaTian,DongGuan","timestamp":1693255229000},{"description":"4px picked up shipment.","latlng":[0,0],"location":"ShaTian,DongGuan","timestamp":1693255169000},{"description":"Parcel information received","latlng":[0,0],"location":"Unknown","timestamp":1692681297000}]}};

        const resp = await get({ id: "EB795709485CN", carrier: "4px" });
        expect(resp).toEqual(mockResponse);
    });

    test("should throw an error for unsupported carrier", async () => {
        await expect(get({ id: "12345", carrier: "unsupported" })).rejects.toThrow("Carrier unsupported not supported");
    });
});