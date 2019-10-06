$(document).ready(function() {
  // 監控右上角連結的點擊，有點擊就滾動到對應區塊
  $(".scrollTop").click(function(e) {
    // 點擊到連結，就做事情
    e.preventDefault(); // 取消預設事件（點擊連結，頁面跳到錨點處）

    var target = $(this).attr("href"); // 抓取連結的 href
    var targetPos = $(target).offset().top; // 抓取 href 對應元素的位置

    $("html, body").animate({ scrollTop: targetPos }, 1000); // 平滑滾動效果
  });

  // 監控視窗的滾動
  // 滾動視窗時，就做事情
  var showSkill = false; // 顯示過 skill 沒有
  $(window).scroll(function() {
    var scrollPos = $(window).scrollTop(); // 目前視窗的位置
    var windowHeight = $(window).height(); // 目前畫面的高
    // 畫面進入連結對應區愧，變更狀態
    $(".scrollTop").each(function() {
      // 處理每個 a 連結的狀態
      var target = $(this).attr("href"); // 每個元素 href 的位置
      var targetPos = $(target).offset().top; // 元素的位置
      var targetHeight = $(target).outerHeight(); // 元素的高，包含 padding

      // 判斷視窗位置是否進入連結對應到的元素範圍
      if (scrollPos >= targetPos - 1 && scrollPos < targetPos + targetHeight) {
        $(".scrollTop").removeClass("active"); // 先將所有 a 連結狀態都取消
        $(this).addClass("active"); // 將 a 連結的狀態變成 active
      } else {
        $(this).removeClass("active");
      }
    });
    // 畫面進入 progress bar，秀出進度條
    var skillTop = $("#skills").position().top;
    if (scrollPos + windowHeight / 2 >= skillTop && !showSkill) {
      // 判斷 skillTop 是否在畫面的一半惹
      $("#skills .progress-bar").each(function() {
        // 抓每個 progress0bar
        var thisValue = $(this).data("progress"); // 抓 data-progress 的值
        $(this).css("width", `${thisValue}%`); // 寫入寬度，讓進度條出來
      });
      showSkill = true;
    }
    // 畫面進入 .animated，添加 .fadeIn
    var showAnimated = $(".animated").length == $(".fadeIn").length
    if (!showAnimated) {
      $(".animated").each(function() {
        var thisPos = $(this).offset().top;

        if (windowHeight + scrollPos >= thisPos) {
          $(this).addClass("fadeIn");
        }
      });
      console.log('animated')
    }

  });
});
