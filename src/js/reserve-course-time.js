import '../libs/rem'
import '../less/index.less'
import 'weui'
import checked, {generatorDate} from '../libs/radio.js'

const api = '/weixin/learning/make_appointment/normal_course'

const url = './fom-result.html'

generatorDate()


$('#confirm').click(function(){
    let date, time, images, description
    if(!checked.date) return weui.alert('请选择日期')
    if(!checked.time) return weui.alert('请选择时间')
    date = checked.date
    time = checked.time
    $.ajax(api,{
        data:{
            date: date,
            time: time
        },
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
            weui.alert('预约失败！请检查网络环境是否良好')
        }
    })
})

function getErrorMsg(d) {
  return d.data.errors[Object.keys(d.data.errors)[0]][0].err_msg
}