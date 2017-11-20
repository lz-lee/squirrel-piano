require('weui')

wx.config({
    debug: true, 
    appId: $('#appid').val(),
    timestamp: $('#timestamp').val(),
    nonceStr: $('#nonceStr').val(),
    signature: $('#signature').val(),
    jsApiList: ['chooseWXPay']
});

wx.ready(function(){
    $(document).ready(function() {
        wx.chooseWXPay({
            timestamp: $('#pay-timestamp').val(),
            nonceStr: $('#pay-nonceStr').val(),
            package: $('#pay-package').val(),
            signType: $('#pay-signType').val(),
            paySign: $('#pay-paySign').val(),
            success: function(res) {
                let urlId = $('#pay-successPage').val()
                window.location.href = '/weixin/course/buy_success/'+urlId
            }
        })
    })
})

wx.error(function(res){
    console.info(res);
});