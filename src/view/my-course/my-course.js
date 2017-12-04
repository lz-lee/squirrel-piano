import 'common/less/index.less'

$('.course').click(function() {
  let id = $(this).attr('id')
  $(this).addClass('selected').siblings().removeClass('selected')
  $(`.${id}-list`).addClass('selected').siblings().removeClass('selected')
})
