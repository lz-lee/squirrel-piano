const getErrorMsg  = (d) => {
    if(d.data.errors){
        return d.data.errors[Object.keys(d.data.errors)[0]][0].err_msg
    }else{
        return '发送失败！请检查网络环境是否良好'
    }
    
}
const form = {
    mobile: '',
    code: ''
}
const state = {
    mobile: 0,
    code: 0
}
var reg = {
    mobile: /^1\d{10}$/,
    code: /^\d{0,}$/
}

var isCounting = false,
    countDown = 60,
    t;
var signupApi = '/weixin/auth/signup',
    vcodeApi = '/weixin/auth/send_validate_code';

var url = './result.html';

var setTime = function(val){//vcode count
    if(isCounting){
        val.attr('disabled','disabled');
        val.addClass('btn-disabled');
        val.html('剩余'+countDown+'秒');
        countDown--;
        if(countDown<0){
            isCounting = false;
            countDown = 60;
        }
    }else{
        val.removeAttr('disabled');
        val.removeClass('btn-disabled');
        val.html('获取验证码');
        clearTimeout(t);
        return false;
    }
    t = setTimeout(function(){
        setTime(val);
    },1050);
}
//send vcode event
$('#sendVcode').on('click',function(e){
    const mobile = $('#mobile').val();
    if(reg['mobile'].test(mobile)){
        $.ajax(vcodeApi,{
            'data': {
                'mobile': mobile
            },
            'type': 'POST',
            'success': function(data){
                let d = JSON.parse(data)
                if(d.code == 0){
                    weui.toast('发送成功',2000);
                    isCounting = true;
                    setTime($('#sendVcode'));
                }else{
                    weui.alert(getErrorMsg(d))
                }
            },
            'error': function(){
                weui.alert('发送失败！请检查网络环境是否良好')
            }
        });
    }else{
        weui.alert('请输入正确的手机号');
        return false;
    }
})
//Confirm event
$('#login').on('click',function(e){
    let allStates = 0;
    //get form and verify form with reg
    for(var i in form){
        form[i] = $('#'+i).val();
        if(reg[i].test(form[i])){
            state[i] = 1;
            allStates += 1;
        }
        else state[i] = 0;
    }

    if(allStates === Object.keys(form).length){
        $.ajax(signupApi,{
            'data': form,
            'type': 'POST',
            'success': function(data){
                let d = JSON.parse(data)
                if(d.code === 0){
                    window.location.href = d.data.href
                }else{
                    weui.alert(getErrorMsg(d))
                }
            },
            'error': function(){
                weui.alert('验证失败！请检查网络环境是否良好')
            }
        });
    }else{
        for(let i in state){
            if(state[i] === 0){
                switch(i){
                    case 'name': weui.alert('请输入正确的姓名');break;
                    case 'mobile': weui.alert('请输入正确的手机号');break;
                    case 'code': weui.alert('请输入正确的验证码');break;
                    default: weui.alert('错误！请重新打开页面');break;
                }
            }
        }
    }
})