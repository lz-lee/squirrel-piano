import '../less/radio.less'

let checked = {}

$('.time-picker').on('change', 'input[type="radio"]', function() {
  let id = $(this).parents('.time-picker').attr('id')
  console.log(this)
  if (this.checked) {
    $(this).parents('.times').addClass('selected').siblings().removeClass('selected')
    checked[id] = $(this).val()
  }
})

export default checked