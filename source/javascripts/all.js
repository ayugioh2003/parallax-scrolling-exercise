// querySelector alias
const $q = function (className) {
  return document.querySelector(className)
}
const $qa = function (className) {
  return document.querySelectorAll(className)
}

// 平滑滾動
var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 750,
  speedAsDuration: true
})

// 監控視窗的滾動
// 滾動視窗時，就做事情
var showSkill = false // 顯示過 skill 沒有
window.addEventListener("scroll", function() {
  var scrollPos = window.pageYOffset // 目前視窗的位置
  var windowHeight = window.innerHeight // 目前畫面的高

  // 畫面進入連結對應區愧，變更連結狀態
  $qa('.scrollTop').forEach(function(ele) {
    const target = ele.getAttribute("href")
    const targetEle = $q(target)
    const targetPos = targetEle.offsetTop
    const targetHeight = targetEle.offsetHeight
    const linkEle = $q(`a[href="${target}"]`)

    if (scrollPos >= targetPos - 50 && scrollPos < targetPos + targetHeight) {
      linkEle.classList.remove("active")
      linkEle.classList.add("active")
    } else {
      linkEle.classList.remove("active")
    }
  })

  // 畫面進入 progress bar，秀出進度條
  var skillTop = $("#skills").position().top
  if (scrollPos + windowHeight / 2 >= skillTop && !showSkill) {
    // 判斷 skillTop 是否在畫面的一半惹
    $("#skills .progress-bar").each(function() {
      // 抓每個 progress0bar
      var thisValue = $(this).data("progress") // 抓 data-progress 的值
      $(this).css("width", `${thisValue}%`) // 寫入寬度，讓進度條出來
    })
    showSkill = true
  }

  // 畫面進入 .animated，添加 .fadeIn
  var showAnimated = $(".animated").length == $(".fadeIn").length
  if (!showAnimated) {
    $(".animated").each(function() {
      var thisPos = $(this).offset().top

      if (windowHeight + scrollPos >= thisPos) {
        $(this).addClass("fadeIn")
      }
    })
    console.log("animated")
  }
  // 背景圖片會用不同速率移動
  $("#profiles").css("background-position-y", `-${scrollPos / 2}px`)
  $(".header-img").css("transform", `translateY(${scrollPos / 2}px)`)
  $("#header-ele").css("transform", `translateY(${scrollPos / 3}px)`)
  console.log("scroll")
})
