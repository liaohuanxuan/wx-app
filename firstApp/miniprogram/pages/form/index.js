Page({
    data: {
        date: "",
        region: "",
        groupId: "",
        loading: false,
        infop:
            "介绍基础情况，如你的学习进度，希望组员要做到的事，你小组的规则，学习安排，你能提供的帮助等，以便招到和你相符合的成员报名",
    },
    onLoad: function (e) {
        if (e.groupId) {
            this.setData({
                groupId: e.groupId,
                infop:
                    "和小组长打个招呼吧~可以简单介绍一下自己的情况，未来大家将一起学习成为好友。",
            })
        }
    },
    submit: function (e) {
        if (this.data.loading) {
            return;
        }
        let u = e.detail.value;
        if (this.data.groupId) { //已经有groupID 加入小组
            wx.cloud.callFunction({
                name: "quickstartFunctions",
                //传递给云函数的参数，event
                data: {
                    type: "joinGroup",
                    data: {
                        ...u,
                        age: new Date().getFullYear() - this.data.date,
                        region: this.data.region,
                        groupId: Number(this.data.groupId),
                    },
                },
            }).then((res) => {
                if (res.result.success) {
                    wx.setStorageSync("groupId", this.data.groupId);//跳转提示页面
                    wx.redirectTo({
                        url:
                            "/pages/tip/index?groupId=" +
                            this.data.groupId +
                            "&code=" +
                            res.result.code,
                    });

                } else {//小组已经满了
                    wx.showModal({
                        title: "提示",
                        content: res.result.errorMessage,
                        success: function () {
                            wx.navigateBack({
                                delta: 1,
                            });
                        },
                    });
                }

            });
        } else {//否则创建小组
            wx.cloud.callFunction({
                name: "quickstartFunctions",
                data: {
                    type: "createGroup",
                    data: {
                        ...u,//将对象 u 中的所有属性解构到 data 对象中
                        age: new Date().getFullYear() - this.data.date,
                        region: this.data.region,
                    },
                },
            }).then((res) => {
                wx.setStorageSync("groupId", res.result.groupId);
                console.log(res);
                wx.redirectTo({
                    url: "/pages/tip/index?groupId=" + String(res.result.groupId),
                });
            });
        }

    },
    dateChange: function (e) {
        this.setData({
            date: e.detail.value
        });
    },
    regionChange: function (e) {
        this.setData({
            region: e.detail.value
        });
    }
});