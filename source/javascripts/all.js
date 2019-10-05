$(document).ready(function(){
  
  $('.scrollTop').click(function(e){  // 點擊到連結，就做事情
    e.preventDefault() // 取消預設事件（點擊連結，頁面跳到錨點處）

    var target = $(this).attr('href') // 抓取連結的 href
    var targetPos = $(target).offset().top // 抓取 href 對應元素的位置

    $('html, body').animate({scrollTop: targetPos}, 1000) // 平滑滾動效果
  })


  $(window).scroll(function(){  // 滾動視窗時，就做事情
    var scrollPos = $(window).scrollTop() // 目前視窗的位置
    // console.log(scrollPos)

    $('.scrollTop').each(function(){
      var target = $(this).attr('href')
      var targetPos = $(target).offset().top  // 元素的位置
      var targetHeight = $(target).outerHeight() // 元素的高，包含 padding
      // console.log(target, targetPos, targetHeight)

      // 判斷視窗位置是否進入連結對應到的元素範圍
      if ( scrollPos >= targetPos - 1 && scrollPos < (targetPos + targetHeight) ) {
        // console.log(target)
        $('.scrollTop').removeClass('active') // 先將所有 a 連結狀態都取消
        $(this).addClass('active')  // 將 a 連結的狀態變成 active
      } else {
        $(this).removeClass('active')
      }
    })
  })
});