import '../less/index.less'
import 'weui'

$(document).on('scroll', function() {
  var that = $(this)
  var screenHeight  = document.documentElement.clientHeight || document.body.clientHeight
  var debounce = setTimeout(function() {
    if (that.scrollTop() > screenHeight) {
      $('#getNow').addClass('fixed')
    } else {
      $('#getNow').removeClass('fixed')
    }
    clearTimeout(debounce)
    debounce = null
  }, 100)
})

$('#getNow').on('click', function() {
  if (!window.requestAnimationFrame) {
    requestAnimationFrame = function(fn) {
        setTimeout(fn, 17)
    }
  }
  function backTop (rate) {
    var doc = document.body.scrollTop ? document.body : document.documentElement
    var scrollTop = doc.scrollTop

    function top() {
      scrollTop = scrollTop + (0 - scrollTop) / (rate || 2)
      if (scrollTop < 1) {
        doc.scrollTop = 0
        return
      }
      doc.scrollTop = scrollTop
      requestAnimationFrame(top)
    }
    top()
  }
  backTop(8)
})


var getErrorMsg  = (d) => {
    if(d.data.errors){
        return d.data.errors[Object.keys(d.data.errors)[0]][0].err_msg
    }else{
        return '发送失败！请检查网络环境是否良好'
    }
    
}
var form = {
    mobile: '',
    code: ''
}
var state = {
    mobile: 0,
    code: 0
}
var reg = {
    mobile: /^1\d{10}$/,
    code: /^\d{0,}$/
}

var signupApi = '/weixin/auth/signup'
var vcodeApi = '/weixin/auth/send_validate_code'

var url = './result.html'

var setTime = function(second){//vcode count
  if (second < 0) {
      $("#getCode").removeClass('btn-disabled')
                    .removeAttr('disabled')
                    .text('获取验证码')
      return
  }

  setTimeout(function(){
      $("#getCode").text('剩余' + second + '秒')
      second --
      setTime(second)
  }, 1050)
}
//send vcode event
$('#getCode').on('click',function(e){
    var mobile = $('#mobile').val()
    if(reg['mobile'].test(mobile)){
        $.ajax(vcodeApi,{
            'data': {
                'mobile': mobile
            },
            'type': 'POST',
            'success': function(data){
                let d = JSON.parse(data)
                if(d.code == 0){
                    weui.toast('发送成功',2000)
                    $("#getCode").addClass('btn-disabled')
                              .attr('disabled', 'disabled')
                    setTime(60)
                }else{
                    weui.alert(getErrorMsg(d))
                }
            },
            'error': function(){
                weui.alert('发送失败！请检查网络环境是否良好')
            }
        })
    }else{
        weui.alert('请输入正确的手机号')
        return false
    }
})
//Confirm event
$('#confirm').on('click',function(e){
    var allStates = 0
    //get form and verify form with reg
    for (var i in form) {
        form[i] = $('#'+i).val()
        if (reg[i].test(form[i])) {
            state[i] = 1
            allStates += 1
        } else {
          state[i] = 0
        }
    }

    if (allStates === Object.keys(form).length) {
        $.ajax(signupApi, {
            'data': form,
            'type': 'POST',
            'success': function(data){
                let d = JSON.parse(data)
                if(d.code == 0){
                    window.location.href = d.data.href
                }else{
                    weui.alert(getErrorMsg(d))
                }
            },
            'error': function(){
                weui.alert('验证失败！请检查网络环境是否良好')
            }
        })
    } else {
        for (var i in state) {
            if (state[i] === 0) {
                switch (i) {
                  case 'mobile':
                    weui.alert('请输入正确的手机号')
                    break;
                  case 'code':
                    weui.alert('请输入正确的验证码')
                    break;
                  default:
                    weui.alert('错误！请重新打开页面')
                    break;
                }
            }
        }
    }
})