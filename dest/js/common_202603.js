

//▽ブレイクポイント
const maxPCInt = 1200;
const contentWidthInt = 1100;
const minPCInt = 769;
const maxTBInt = 768;
const maxSPInt = 370;
const minPC = '(min-width: '+ minPCInt +'px)';
const maxPC = '(max-width: '+ maxPCInt +'px)';
const contentWidth = '(max-width: '+ contentWidthInt +'px)';
const maxTB = '(max-width:'+ maxTBInt +'px)';
const maxSP = '(max-width:'+ maxSPInt +'px)';
const matchMinPC = window.matchMedia('(min-width: '+ minPCInt +'px)').matches;
const matchMaxPC = window.matchMedia('(max-width: '+ maxPCInt +'px)').matches;
const matchContentWidth = window.matchMedia('(max-width: '+ contentWidthInt +'px)').matches;
const matchMaxTB = window.matchMedia('(max-width:'+ maxTBInt +'px)').matches;
const matchMaxSP = window.matchMedia('(max-width:'+ maxSPInt +'px)').matches;


//▽▽▽イベント用▽▽▽
$(function(){
	overScrollList();
	bannerSlider();
	serviceBannerSlider();
	globalNavResize();
});
//▽リサイズ時にリロード
var ua = navigator.userAgent;
var timer = false;

// start 20250715
var isiOS = /iPad|iPhone|iPod/.test(ua);
var isAndroidMobile = /Android/.test(ua) && /Mobile/.test(ua);
var isTablet = /iPad/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua));
var isMacDesktop = /Macintosh/.test(ua) && ('ontouchend' in document);

$(window).on('resize', function() {
  if (isiOS || isAndroidMobile) {
    // スマホ
  } else if (isTablet) {
    globalNavResize();
  } else if (isMacDesktop) {
    // iOSデスクトップ表示モード → PC判定しない
    globalNavResize();
  } else {
    setTimeout(function () {
      location.reload();
    }, 500);
  }
});
// end 20250715

/* 20250715
$(window).on('resize', function() {
    console.log(ua,timer);
    // スマホ用の処理
    if (ua.indexOf('iPhone') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0 )) {
    }
    // タブレット用の処理
    else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      globalNavResize();
    }
    // PC用の処理
    else {
      setTimeout(function () {
        location.reload();
      }, 500);
    }
}); */

//▽scrollイベントまとめ
$(window).on('scroll', function() {
	fixedglobalNav();
	firstMessageImgHide();
});

//||||| 共通 |||||
//▽onclickした要素にactiveを付与
function target(id) {
  if ($(id).prop('id')=="mypageButton" && !$('.showPC.commonNav').is(':visible')) {
    $("#mypageButtonTB").stop().toggleClass('active');
    $('[onclick*="target"]').not("#mypageButtonTB").removeClass('active');
  } else {
    $(id).stop().toggleClass('active');
    $('[onclick*="target"]').not(id).removeClass('active');
    //targetの縦、横、位置を取得
    //複製したものが取得したものと同じになるようにする
    //リサイズしてもactiveの取得をし続け可変にする
  }
}
//▽表示した要素にactiveを付与（html構成を気にしなくていいもの）
function toggleOpen(id) {
	$(id).stop().slideToggle().toggleClass('active');
}
//▽onclickした要素を非表示にする
function targetHide(id) {
	$(id).fadeOut();
}
//▽モーダルトグル
function modalToggle(id) {
  if (["navEntryArea","navServiceArea","navSupportInfoArea","navProceduresArea","navServiceArea","navSupportInfoArea","navProceduresArea"].includes($(id).prop('id'))) {
    // PCのみ
    if ($('.showPC.commonNav').is(':visible')) {
	  var headerHeight = $('header').height();
      var windowScrollTop = $(window).scrollTop();
      if (windowScrollTop > headerHeight) {
        $('#'+$(id).prop('id')+' .modalContents').css('top', ($('header').height())+'px');
      }
      else {
        $('#'+$(id).prop('id')+' .modalContents').css('top', ($('header').height()-windowScrollTop)+'px');
      }
    }
  }
  // ご利用中の方モーダルコンテンツの場合
  if ($(id).prop('id')=="menuCustomerArea" || $(id).prop('id')=="menuJoinArea") {
    if ($('.showPC.commonNav').is(':visible')) {
      var headerInnerHeight = $('header .inner').height();
      var windowScrollTop = $(window).scrollTop();
      if (headerInnerHeight >= windowScrollTop) {
        $('#menuCustomerArea .modalContents').css('top', (headerInnerHeight-windowScrollTop+20)+'px');
		$('#menuJoinArea .modalContents').css('top', (headerInnerHeight-windowScrollTop+20)+'px');
      } else {
        $('#menuCustomerArea .modalContents').css('top', '20px');
		$('#menuJoinArea .modalContents').css('top', '20px');
      }
    } else {
      var headerHeight = $('header').height() + $('.showTB.commonNav').outerHeight();
      var windowScrollTop = $(window).scrollTop();
      if (headerHeight >= windowScrollTop) {
        $('#menuCustomerArea .modalContents').css('top', (headerHeight-windowScrollTop+10)+'px');
		$('#menuJoinArea .modalContents').css('top', (headerHeight-windowScrollTop+10)+'px');
      } else {
        $('#menuCustomerArea .modalContents').css('top', '10px');
		$('#menuJoinArea .modalContents').css('top', '10px');
      }
    }
  }

	$(id).stop().fadeToggle().toggleClass('active');
	if($(id).hasClass('active')){
		$('html').css({'overflow-y':'hidden'});
		//他のモーダルを非表示
		$('.modalArea').not(id).removeClass('active').hide();
	}else{
		$('html').css({'overflow-y':'auto'});
	}
}
//▽モーダルを表示
function modalOpen(id) {
	$(id).stop().addClass('active').fadeIn();
	$('html').css({'overflow-y':'hidden'});
	//他のモーダルを非表示
	$('.modalArea').not(id).removeClass('active').hide();
}
//▽モーダルをボタンで閉じる
function modalClose(id) {
    $('[onclick*="target"]').not("#mypageButtonTB").removeClass('active');
	$(id).removeClass('active').fadeOut();
	$('html').css({'overflow-y':'auto'});
}
//▽モーダルのコンテンツ外を押下して閉じる（ついでにonclickに付与したactiveも削除）
$(function(){
	$('.modalArea').on('click',function(){
		const onclickContent = $(this).prop('id');
		$('[onclick*="'+ onclickContent +'"]').removeClass('active');
		$(this).stop().removeClass('active').fadeOut();
		$('html').css({'overflow-y':'auto'});
	});
	//モーダルクローズボタン
	$('[onclick*="modalClose"]').on('click',function(){
		const closeContent = $(this).closest('.modalArea').prop('id');
		$('[onclick*="'+ closeContent +'"]').removeClass('active');
	});
	$('.modalContents').on('click', function(modalContents){
		modalContents.stopPropagation();
	});
});

//||||| 個別設定 |||||
//▽グローバルナビが特定の幅の時だけslick
function globalNavResize(){
	const globalNavSlickContent = $('.globalNav:not(.notSlick) .nav.showPC');
	if(window.matchMedia('(min-width:'+ minPCInt +'px) and (max-width:'+ (maxPCInt+60) +'px)').matches){
		$(globalNavSlickContent).not('.slick-initialized').slick({
			infinite: false,
			variableWidth: true,
			arrows: true,
			dots: false,
			swipe: true
		});
	}else{
		$(globalNavSlickContent).has('.slick-initialized').slick('unslick');
	}
}
$(function() {
  $('.globalNav:not(.notSlick) .nav.showPC').on('afterChange beforeChange swipe', function(event, slick, currentSlide) {
    var slickListWidth = $('.globalNav:not(.notSlick) .nav.showPC .slick-list').width();
    var slideWidth = 0;
    $('.globalNav:not(.notSlick) .nav.showPC .slick-slide').each(function() {
      if ($(this).hasClass("slick-active")) {
        return false;
      }
      slideWidth += $(this).outerWidth(true); // 各要素の外部幅を合計に追加します
    });
    var totalWidth = 0;
    $('.globalNav:not(.notSlick) .nav.showPC .slick-slide').each(function() {
        totalWidth += $(this).outerWidth(true); // 各要素の外部幅を合計に追加します
    });
    if (slickListWidth > (totalWidth - slideWidth)) {
      $('.globalNav:not(.notSlick) .nav.showPC .slick-next').css('pointer-events', 'none');
    } else {
      $('.globalNav:not(.notSlick) .nav.showPC .slick-next').css('pointer-events', 'auto');
    }
  });
});
//▽グローバルナビのスマホ版デザイン用要素複製
// $(function() {
// 	$('.nav.showTB').on('click', function(){
// 		$(this).clone(true).prependTo('body').addClass('copy');
// 	});
// });
//scroll時のグローバルナビの固定
function fixedglobalNav() {
	const headerHeight = $('header').outerHeight();
	if ($(window).scrollTop() > headerHeight) {
		$('header').addClass('overHeader');
	} else {
		$('header').removeClass('overHeader');
	}
}
//▽「メニューの位置が変わりました」の挙動
function firstMessageImgHide() {
	if ($(window).scrollTop() > 500) {
		// 特定の要素を超えた
		$('#firstMessageImg').fadeOut();
	}
}
$(function() {
  firstMessageImgToggle();
  $(window).on('resize', function() {
    firstMessageImgToggle();
  });
  $("#firstMessageImg").click(function() {
    targetHide("#firstMessageImg");
    $.cookie('btnFlg', 'on', { expires: 30,path: '/' }); //cookieの保存
  });
});

function firstMessageImgToggle() {
  if ($.cookie('btnFlg') != 'on' && $(window).width() < minPCInt && $(window).scrollTop() <= 500) {
    $("#firstMessageImg").show();
  } else {
    $("#firstMessageImg").hide();
  }
}

//▽スライドバナー
function bannerSlider() {
	$('#bannerSlider').slick({
		autoplay: true,
		slidesToShow: 3,
		dots: true,
		centerMode: true,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});
}

//▽サービスバナースライダー
function serviceBannerSlider() {
	const serviceBannerArea = $('#serviceBannerArea .inner');
	if(matchMaxTB){
		$(serviceBannerArea).not('.slick-initialized').slick({
			dots: true,
			variableWidth: true,
			slidesToShow: 1,
			centerMode: true
		});
	}else{
		$(serviceBannerArea).has('.slick-initialized').slick('unslick');
	}
}


//自作スライダー
function overScrollList() {
	$('.overScrollList').each(function() {
		//リスト数
		let overScrollListLength = 0;

		$(this).find('section').each(function(overScrollListIndex) {
			overScrollListLength = overScrollListIndex;
		});
		//リスト数を取得
		overScrollListLength = overScrollListLength+1;//※1始め
		//=========スライド初期設定=========
		//初期カレント
		$(this).find('section:eq(0)').addClass('current');
		//=========ナビゲーション初期表示=========
		$(this).after(
			'<ul class="listNav"></ul>'
		);
		for(let nav = 0; nav < overScrollListLength; nav++) {
			$(this).next('.listNav').append('<li></li>');
		}
		//初期カレント
		$(this).next('.listNav').children('li:eq(0)').addClass('current');
		//=========ボタンエリア初期表示=========
		// for(let nav=0; nav< (listLength-1); nav++) {
		// 	$(this).find('.buttonArea').prepend('<li><button type="button">次へ</button></li>');
		// }
		// $(this).find(".buttonArea li:not(:eq(0))").hide();

		//リストのコンテンツ幅
		let slideWidth = $(this).find('section').parent().width() / overScrollListLength;

		// コンテンツ幅が親要素のウィンドウ幅を超えていたら発動
		if($(this).width() > $(window).width()) {
			$(this).addClass('active');

			//--------------------------------------フリック処理--------------------------------------
			$(this).on({
				//フリック開始時
				'touchstart': function(e) {
					//タッチポイントからの距離を取得
					$(this).data("touchX", e.touches[0].pageX).data("moveX", 0);
				},
				//フリック中
				'touchmove': function(e) {
					$(this).data("moveX",e.touches[0].pageX-$(this).data("touchX"));
				},
				//フリック終了
				'touchend': function() {
					const slideCurrent = $(this).find('section.current').index();//カレントを取得※1始め
					if($(this).data("moveX") > 10){
						//右スワイプの場合
						//最初の要素以外
						if(slideCurrent != 0){
							$(this).animate({
								'left':-slideWidth * (slideCurrent -1),
								'margin-right':-slideWidth * (slideCurrent -1)
							});
							//-------スライド-------
							$(this).find('section:not(:eq(' + (slideCurrent -1) + '))').removeClass('current');
							$(this).find('section:eq(' + (slideCurrent -1) + ')').addClass('current');
							//-------ナビゲーション-------
							$(this).next('.listNav').children('li:not(:eq(' + (slideCurrent -1) + '))').removeClass('current');
							$(this).next('.listNav').children('li:eq(' + (slideCurrent -1) + ')').addClass('current');
							//-------ボタンエリア-------
							// $(this).closest('.slider').find('.buttonArea li:not(:eq(' + (slideCurrent -1) + '))').hide();
							// $(this).closest('.slider').find('.buttonArea li:eq(' + (slideCurrent -1) + ')').show();
						}
					}else if($(this).data("moveX") < -10){
						//左スワイプの場合
						//最後の要素以外
						if(slideCurrent != overScrollListLength-1){
							$(this).animate({
								'left':-slideWidth * (slideCurrent +1),
								'margin-right':-slideWidth * (slideCurrent +1)
							});
							//-------スライド-------
							$(this).find('section:not(:eq(' + (slideCurrent +1) + '))').removeClass('current');
							$(this).find('section:eq(' + (slideCurrent +1) + ')').addClass('current');
							//-------ナビゲーション-------
							$(this).next('.listNav').children('li:not(:eq(' + (slideCurrent +1) + '))').removeClass('current');
							$(this).next('.listNav').children('li:eq(' + (slideCurrent +1) + ')').addClass('current');
							//-------ボタンエリア-------
							// $(this).closest('.slider').find('.buttonArea li:not(:eq(' + (slideCurrent +1) + '))').hide();
							// $(this).closest('.slider').find('.buttonArea li:eq(' + (slideCurrent +1) + ')').show();

						}
					}
				}
			});
			//--------------------------------------マウスドラッグ処理--------------------------------------
			let isMouseDown = false;
			let startX;
			let scrollLeft;
			$(this).on({
				'mousedown': function(e) {
					isMouseDown = true;
					startX = e.pageX - $(this).offset().left;
					scrollLeft = $(this).scrollLeft();
				},
				'mousemove': function(e) {
					if(!isMouseDown) return;
					e.preventDefault();
					const x = e.pageX - $(this).offset().left;
					walk = (x - startX) * 3; //scroll-fast
				},
				'mouseup': function() {
					const slideCurrent = $(this).find('section.current').index();//カレントを取得※1始め
					if(walk > 100){
						//右スワイプの場合
						if(slideCurrent != 0){
							$(this).animate({
								left:-slideWidth * (slideCurrent -1),
								'margin-right':-slideWidth * (slideCurrent -1)
							});
							//-------スライド-------
							$(this).find('section:not(:eq(' + (slideCurrent -1) + '))').removeClass('current');
							$(this).find('section:eq(' + (slideCurrent -1) + ')').addClass('current');
							//-------ナビゲーション-------
							$(this).next('.listNav').children('li:not(:eq(' + (slideCurrent -1) + '))').removeClass('current');
							$(this).next('.listNav').children('li:eq(' + (slideCurrent -1) + ')').addClass('current');
							//-------ボタンエリア-------
							// $(this).closest('.slider').find('.buttonArea li:not(:eq(' + (slideCurrent -1) + '))').hide();
							// $(this).closest('.slider').find('.buttonArea li:eq(' + (slideCurrent -1) + ')').show();
						}
					}else if(walk < -100){
						//左スワイプの場合
						//最後の要素以外
						if(slideCurrent != overScrollListLength-1){
							$(this).animate({
								left:-slideWidth * (slideCurrent +1),
								'margin-right':-slideWidth * (slideCurrent +1)
							});
							//-------スライド-------
							$(this).find('section:not(:eq(' + (slideCurrent +1) + '))').removeClass('current');
							$(this).find('section:eq(' + (slideCurrent +1) + ')').addClass('current');
							//-------ナビゲーション-------
							$(this).next('.listNav').children('li:not(:eq(' + (slideCurrent +1) + '))').removeClass('current');
							$(this).next('.listNav').children('li:eq(' + (slideCurrent +1) + ')').addClass('current');
							//-------ボタンエリア-------
							// $(this).closest('.slider').find('.buttonArea li:not(:eq(' + (slideCurrent +1) + '))').hide();
							// $(this).closest('.slider').find('.buttonArea li:eq(' + (slideCurrent +1) + ')').show();

						}
					}
					isMouseDown = false;
				},
				'mouseleave': function() {
					isMouseDown = false;
				}
			});
		}
	});
}

//▽PC版ヘッダーボタン hover でモーダル表示
$(function() {
  var hoverTimer = null;

  function showModalHover(buttonId, modalId) {
    var $button = $('#' + buttonId);
    var $modal = $('#' + modalId);
    var $modalContents = $modal.find('.modalContents');
    var isOpen = false;

    // モーダルを開く
    function openModal() {
      clearTimeout(hoverTimer);
      // モーダル位置を計算
      var headerInnerHeight = $('header .inner').height();
      var windowScrollTop = $(window).scrollTop();
      if (headerInnerHeight >= windowScrollTop) {
        $modalContents.css('top', (headerInnerHeight - windowScrollTop + 20) + 'px');
      } else {
        $modalContents.css('top', '20px');
      }
      // 他のモーダルを閉じる
      $('.modalArea').not($modal).removeClass('active').hide();
      $('[onclick*="target"]').removeClass('active');
      // モーダルを表示
      $modal.stop().fadeIn().addClass('active');
      $button.addClass('active');
      isOpen = true;
    }

    // モーダルを閉じる
    function closeModal() {
      $modal.stop().fadeOut().removeClass('active');
      $button.removeClass('active');
      isOpen = false;
    }

    // カーソルがボタン・modalContents・その間のギャップ内にあるか判定
    function isInArea(e) {
      var btnRect = $button[0].getBoundingClientRect();

      // ボタン内
      if (e.clientX >= btnRect.left && e.clientX <= btnRect.right &&
          e.clientY >= btnRect.top && e.clientY <= btnRect.bottom) {
        return true;
      }

      if ($modalContents.is(':visible') && $modalContents[0]) {
        var mcRect = $modalContents[0].getBoundingClientRect();

        // modalContents内
        if (e.clientX >= mcRect.left && e.clientX <= mcRect.right &&
            e.clientY >= mcRect.top && e.clientY <= mcRect.bottom) {
          return true;
        }

        // ボタンとmodalContentsの間のギャップ内（縦方向）
        var gapLeft = Math.min(btnRect.left, mcRect.left);
        var gapRight = Math.max(btnRect.right, mcRect.right);
        if (e.clientX >= gapLeft && e.clientX <= gapRight &&
            e.clientY >= btnRect.bottom && e.clientY <= mcRect.top) {
          return true;
        }
      }

      return false;
    }

    // ボタンにマウスが入った時 → モーダルを開く
    $button.on('mouseenter', function() {
      openModal();
    });

    // ドキュメント上のマウス移動で範囲外判定
    $(document).on('mousemove', function(e) {
      if (!isOpen) return;
      if (isInArea(e)) {
        clearTimeout(hoverTimer);
      } else {
        // 範囲外に出たら遅延後に閉じる
        if (!hoverTimer) {
          hoverTimer = setTimeout(function() {
            closeModal();
            hoverTimer = null;
          }, 200);
        }
      }
    });
  }

  showModalHover('joinButton', 'menuJoinArea');
  showModalHover('mypageButton', 'menuCustomerArea');
});

//jsで生成した要素用※一番下に書かないとプラグインに影響がある
// $(document).on('click', '[onclick*="modalToggle('+ id +')"].active', function () {
// 	$(id).fadeOut().removeClass('active');



