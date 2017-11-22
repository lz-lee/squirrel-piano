import '../less/index.less'
import 'weui'
import checked from '../libs/radio.js'

const api = '/weixin/learning/make_appointment/normal_course'

const url = './fom-result.html'

function generatorDate() {
  let dateCount = 9

  let times = []

  let weeks = {
      '1': '周一',
      '2': '周二',
      '3': '周三',
      '4': '周四',
      '5': '周五',
      '6': '周六',
      '0': '周日'
  }

  for(let i = 2; i < dateCount; i++){ //get date for 7 days
    let date = new Date()
    let oneday = {
        year: '',
        month: '',
        day: '',
        week: ''
    }
    date.setDate(date.getDate() + i)
    oneday.year = date.getFullYear()
    oneday.month = (date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1):(date.getMonth()+1)
    oneday.day = date.getDate() < 10 ? '0'+date.getDate():date.getDate()
    oneday.week = weeks[date.getDay()]
    times.push(oneday)
  }
  for(let i = 0; i < times.length; i++){//append date
      let value = times[i].year + '-' + times[i].month + '-' + times[i].day
      let cDate = times[i].month + '-' + times[i].day
      let html = '<div class="times"><input type="radio" name="date" value="'+value+'" id="'+value+'"><label class="default" for="'+value+'"><p class="week">'+times[i].week+'</p><p class="date">'+cDate+'</p></label></div>'

      $('#date').append(html)
  }
}

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