require('weui')

let uploadCount = 18

let imgs = []

let uploadFiles = {
    length: 0,
    imgs: ''
}

wx.config({
    debug: false, 
    appId: $('#appid').val(),
    timestamp: $('#timestamp').val(),
    nonceStr: $('#nonceStr').val(),
    signature: $('#signature').val(),
    jsApiList: ['chooseImage', 'previewImage', 'getLocalImgData', 'uploadImage']
});

let imgUpload = (localId) => {
    wx.uploadImage({
        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res){
            var serverId = res.serverId; // 返回图片的服务器端ID
            imgs.push(serverId);
            uploadFiles.imgs = imgs.join(',')
            uploadFiles.length++
        }
    })
}

wx.ready(function(){
    $(document).ready(function(){
        $('#uploaderCustomInput').click(function(){
            if(uploadFiles.length>=uploadCount){
                return weui.alert('不能添加更多图片了')
            }
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res){
                    var localIds = res.localIds
                    for(let i = 0; i < localIds.length; i++){
                        $('#uploaderBox').before('<img class="img-item" src="'+localIds[i]+'">')
                        imgUpload(localIds[i])
                    }
                }
            })
        })
    })
})
wx.error(function(res){
    console.log(res)
});
module.exports = uploadFiles
