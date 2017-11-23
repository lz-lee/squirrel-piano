import '../less/radio.less'

let checked = {}

$('.time-picker').on('change', 'input[type="radio"]', function() {
  let id = $(this).parents('.time-picker').attr('id')
  if ($(this).parents('.times').hasClass('full')) {
    return false
  }
  if (this.checked) {
    $(this).parents('.times').addClass('selected').siblings().removeClass('selected')
    checked[id] = $(this).val()
    // for course-table
    if ($('.m-list').length > 0) {
      let index = $(this).parents('.times').index()
      $('.course-list-content').children('.m-list').eq(index).addClass('selected').siblings().removeClass('selected')
    }
  }
})

export function generatorDate() {
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

export default checked