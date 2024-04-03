Page({
  data: {
    userList: [],
    groupId: "",
    g: "1",
    c: "1",
    isLeader: false,
  },
  onLoad: function (e) {
    this.setData({
      groupId: e.groupId || "1",
      g: String(Math.ceil(Number(e.groupId) / 190) || "1"),
      c: String(Math.ceil(Number(e.groupId) / 30) || "1"),
    });
    wx.cloud
      .callFunction({
        name: "quickstartFunctions",
        data: {
          type: "getManyForm", //查找小组成员
          data: {
            groupId: Number(e.groupId) || 1,
          },
        },
      })
      .then((res) => {
        this.setData({
          userList: res.result.userList, //把返回的结果设置到表单中
          isLeader: res.result.isLeader,
        });
      });
  },
});