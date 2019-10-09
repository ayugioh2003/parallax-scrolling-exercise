// querySelector alias
const $q = function(className) {
  return document.querySelector(className)
}
const $qa = function(className) {
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
  $qa(".scrollTop").forEach(function(ele) {
    const target = ele.getAttribute("href") // 區塊錨點
    const targetEle = $q(target) // 區塊 ele
    const targetPos = targetEle.offsetTop // 區塊位置
    const targetHeight = targetEle.offsetHeight // 區塊高度
    const linkEle = $q(`a[href="${target}"]`) // 目前 for 到的連結 ele

    if (scrollPos >= targetPos - 50 && scrollPos < targetPos + targetHeight) {
      linkEle.classList.remove("active")
      linkEle.classList.add("active")
    } else {
      linkEle.classList.remove("active")
    }
  })

  // 畫面進入 progress bar，秀出進度條
  const skillTop = $q("#skills").offsetTop
  if (scrollPos + windowHeight / 2 >= skillTop && !showSkill) {
    $qa("#skills .progress-bar").forEach(function(ele) {
      var thisValue = ele.dataset.progress
      // console.log(thisValue)
      // console.log(ele)
      ele.style["width"] = `${thisValue}%`
    })
    showSkill = true
  }

  // 畫面進入 .animated，添加 .fadeIn
  let showAnimated = $qa(".animated").length == $qa(".fadeIn").length
  console.log($qa(".animated").length, $qa(".fadeIn").length)
  if (!showAnimated) {
    $qa(".animated").forEach(function(ele, i) {
      const thisPos = getPosition(ele).y  // for 到的元素位置
      // console.log(ele)
      console.log(windowHeight, scrollPos, thisPos)

      if (windowHeight * 0.7 + scrollPos >= thisPos) {
        ele.classList.add("fadeIn")
      }

      console.log("animated")
    })
  }

  // 背景圖片會用不同速率移動
  $q(".header-img").style["transform"] = `translateY(${scrollPos / 2}px)`
  $q("#header-ele").style["transform"] = `translateY(${scrollPos / 3}px)`
  $q("#profiles").style["background-position-y"] = `-${scrollPos / 2}px`
  console.log("scroll")
})

// 取得元素目前左上角位置
function getPosition (element) {
  // https://andyyou.github.io/2015/04/07/get-an-element-s-position-by-js/
  var x = 0;
  var y = 0;
  
  while ( element ) {
    x += element.offsetLeft - element.scrollLeft + element.clientLeft;
    y += element.offsetTop - element.scrollLeft + element.clientTop;
    element = element.offsetParent;
  }

  return { x: x, y: y };
}
