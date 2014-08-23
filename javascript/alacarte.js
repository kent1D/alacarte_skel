var showhide_timeline = false;
var timeline_drag_width = 0,
	timeline_next_width = 0,
	timeline_max_left = 0,
	timeline_width = 0,
	nb_timeline = 0;
var moveleft = false,moveright = false;

/**
 * Ajouter un évènement au beforestart sur le draggable pour changer de tab
 */
var oldMouseStart = $.ui.draggable.prototype._mouseStart;
$.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
	this._trigger("beforeStart", event, this._uiHash());
	oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
};
/**
 * Put every selected element on the same height, based on the bigger one
 */
jQuery.fn.uniformHeight = function() {
	var maxHeight = 0,
		max = Math.max;

	return this.each(function() {
		maxHeight = max(maxHeight, $(this).outerHeight());
	}).height(maxHeight);
}

/**
 * Generate typewriter effect
 */
function box_typewriter(){
	$(".box1 span.typewriter").empty().typed({
		strings: ["YOU CAN ORDER A PERFORMANCE TO BE EXECUTED LIVE,", "YOU CAN BECOME THE CO-CREATOR OF OUR SHOW,","YOUR DECISIONS DETERMINE HOW OUR PERFORMANCE WILL LOOK LIKE,","YOU CAN BE CREATIVE.","YOU CAN HAVE FUN!!"],
		typeSpeed: 60,
		backDelay: 3000,
		loop:true
	});
	$(".box2 span.typewriter").empty().typed({
		strings: ["ARE YOU ORGANIZING A FESTIVAL, THEATRE PROGRAM, EXHIBITION, HOUSE EVENT, LECTURE?", "OR ARE YOU JUST CURIOUS?","VIEW THE CHAPTERS BELOW!","WHICH CHAPTERS DO YOU LIKE?","DRAG THEM TO THE TIMELINE!","AND ORDER A LIVE CUSTOM MADE PERFORMANCE ANYWHERE YOU LIKE!"],
		typeSpeed: 65,
		backDelay: 4500,
		loop:true
	});
}

/**
 * On window resize :
 * - Delete typewriter effect;
 * - Resize homeboxes
 * - Relaunch typewriter effect
 */
function window_resize(){
	$(".box1 span.typewriter,.box2 span.typewriter").typed('reset');
	$(".box1 span,.box2 span").addClass('typewriter');
	$(".box1 span.typewriter").text('YOUR DECISIONS DETERMINE HOW OUR PERFORMANCE WILL LOOK LIKE,');
	$(".box2 span.typewriter").text('ARE YOU ORGANIZING A FESTIVAL, THEATRE PROGRAM, EXHIBITION, HOUSE EVENT, LECTURE?');
	$('.homeboxes .hero-unit').css('height','');
	$(".homeboxes .hero-unit").uniformHeight();
	box_typewriter();
	$(".thumbnails").find(".thumbnail").css('height','');
	$(".thumbnails").find(".thumbnail").uniformHeight();
}
/**
 * Surcharge de la fonction de SPIP
 * 
 * On enlève le passage par une opacité
 */
jQuery.fn.animateLoading = function() {
	this.attr('aria-busy','true').addClass('loading');
	if (typeof ajax_image_searching != 'undefined'){
		var i = (this).find('.image_loading');
		if (i.length) i.eq(0).html(ajax_image_searching);
		else this.prepend('<span class="image_loading">'+ajax_image_searching+'</span>');
	}
	return this; // don't break the chain
}

jQuery.fn.addtotimeline = function(){
	var me = $(this),href = $(this).attr('href');
	var id_article = $(this).parents('.media_content').eq(0).attr('id').replace('media_visible_','article_');
	var content_box = $('#'+id_article).find('.headline_media');
	var cible=false,count = $('.timeline_drag').not('.empty').size();
	if(count > nb_timeline){
		if($('.timeline_before').is(':hidden'))
			$('.timeline_before').fadeIn();
		var left = '-'+($('.timeline_drag').eq(0).outerWidth()*($('.timeline_drag').size()-nb_timeline))+'px';
	}else{
		if($('.timeline_before').is(':visible'))
			$('.timeline_before').fadeOut();
		var left = '0px';
	}
	
	var cible_transfer = $('.empty:eq(0)');
	activate_timeline();
	$('.timeline_list').animate({left:left},function(){
		me.parents('.media_visible').effect( 'transfer',{to: cible_transfer },700, function(){
			var content = content_box.clone();
			content.find('.badge_thumbnail,.incitate').remove();
			cible_transfer.removeClass('empty').empty();
			content.appendTo(cible_transfer);
			$.ajax({
				url: href
			}).done(function() {
				$('#panier,.timeline_show').ajaxReload();
				$('.timeline_line').ajaxReload({callback:function(){
					timeline_replace();
					if($('.timeline_drag').not('.empty').size() == 1)
						$('.info_added_price').fadeIn();
				}});
			});
		});
	});
	return false;
}
/**
 * Replacer la timeline au bon endroit
 */
function timeline_replace(){
	var cible=false,count = $('.timeline_drag').size();
	if(count > nb_timeline){
		var left = ($('.timeline_drag').eq(0).outerWidth()*($('.timeline_drag').size()-nb_timeline));
		$('.timeline_list').animate({left:'-'+left+'px'});
		if($('.timeline_before').is(':hidden'))
			$('.timeline_before').fadeIn();
		timeline_max_left = 0-left;
	}
	else{
		if($('.timeline_before').is(':visible'))
			$('.timeline_before').fadeOut();
		timeline_max_left = 0;
		$('.timeline_list').animate({left:'0px'});
	}
}

/**
 * Active / désactive la timeline
 */
function activate_desactivate_timeline(){
	if(!$('#timeline').is('.preview')){
		if($('#timeline').is('.active')){
			$('#timeline .timeline_content').attr('data-heightorig',$('#timeline .timeline_content').outerHeight());
			$('#timeline .timeline_content').animate({height:'3.5em'},function(){
				$('#timeline').removeClass('active');
			});
		}
		else{
			if($('#timeline .timeline_content').attr('data-heightorig') > 0){
				var height_orig = $('#timeline .timeline_content').attr('data-heightorig');
				$('#timeline .timeline_content').animate({height:height_orig+'px'});
				$('#timeline').addClass('active');
			}else{
				$('#timeline .timeline_content').css('height','auto');
				$('#timeline').addClass('active');
			}
		}
	}
}

function desactivate_timeline(){
	if(!$('#timeline').is('.preview') && $('#timeline').is('.active')){
		$('#timeline .timeline_content').attr('data-heightorig',$('#timeline .timeline_content').outerHeight());
		$('#timeline .timeline_content').animate({height:'3.5em'});
		$('#timeline').removeClass('active');
	}
}

function activate_timeline(){
	if(!$('#timeline').is('.preview') && !$('#timeline').is('.active')){
		if($('#timeline .timeline_content').attr('data-heightorig') > 0){
			var height_orig = $('#timeline .timeline_content').attr('data-heightorig');
			$('#timeline .timeline_content').animate({height:height_orig+'px'});
			$('#timeline').addClass('active');
		}else{
			$('#timeline .timeline_content').css('height','auto');
			$('#timeline').addClass('active');
		}
	}
}

function add_to_timeline( $item, $dropbox) {
	$dropbox = $dropbox.parent().find('.empty').eq(0);
	var dropbox_html = $dropbox.html();
	$dropbox.removeClass('empty').empty();
	var html = $item.html();
	$('<div class="headline_media"></div>').html(html).appendTo( $dropbox).find('.badge_thumbnail').remove();
	$dropbox.find('.badge_thumbnail,.incitate').remove();
	var href = $item.parents('article').attr('data-add_timeline');
	if(href){
		$.ajax({
			url: href
		}).done(function() {
			$('#panier,.timeline_show').ajaxReload();
			$('.timeline_line').ajaxReload({callback:function(){
				timeline_replace();
				if($('.timeline_drag').not('.empty').size() == 1)
					$('.info_added_price').fadeIn();
			}});
		});
	}
}

function media_visible_add_to_timeline(){
	$('.media_visible a.add_to_timeline').click(function(){
		return false;
	});
}

var init_drag = function(){
	$('.blog_archive').height($('.main').height());
	$('.timeline_before').unbind('hover').hover(function(){
		if($('.timeline_list').offset().left < 0){
			moveleft = setInterval(timeline_before, 5);
		}
	},function(){
		clearInterval(moveleft);
	});
	
	$('.timeline_after').unbind('hover').hover(function(){
		if($('.timeline_list').offset().left > timeline_max_left){
			moveright = setInterval(timeline_after, 5);
		}
	},function(){
		clearInterval(moveright);
	});
	$('table.place').each(function(){
		var max_width = $(this).parent().width(),
			width_ok = 0;
		$(this).find('.title_value').each(function(){
			width_ok = width_ok+$(this).outerWidth();
		});
		var count = $(this).find('.value').size();
		var width = (max_width - width_ok)/count;
		$(this).find('.value').each(function(){
			if($(this).width() > width){
				$(this).addClass('toresize');
			}
		});
		var new_width = max_width;
		$(this).find('td').not('.toresize').each(function(){
			new_width = new_width - $(this).outerWidth();
		});
		var count = $(this).find('.toresize').size();
		var new_width = new_width / count;
		$(this).find('.toresize').each(function(){
			var text = $(this).text();
			$(this).wrapInner('<abbr title="'+$.trim(text)+'"></abbr>');
			$(this).width(new_width);
		});
	});
	$('#timeline').unbind('hover').hover(
		function(){
			activate_timeline();
		}
	);
	$("#timeline").swipe({
		swipeUp:function(event, direction, distance, duration, fingerCount) {
			activate_timeline();
		},
		swipeDown:function(event, direction, distance, duration, fingerCount) {
			desactivate_timeline();
		},
		threshold:20
	});

	$('div').not('#timeline').click(function(){
		if(!$('#timeline').is(':hover'))
			desactivate_timeline();
	})
	$('.content .headline_media').draggable({
		cursor: "move",
		opacity: 0.7,
		cursorAt: { top: ($('.timeline_drag').eq(0).height()/2), left: ($('.timeline_drag').eq(0).width()/2) },
		width:$('.timeline_drag').eq(0).width(),
		zIndex: 2500,
		containment: "document",
		helper:"clone",
		beforeStart:function(event,ui){
			activate_timeline();
			if(!$('#timeline .timeline_menu_item').eq(0).is('.on')){
				$('.timeline_video').ajaxReload({
					callback:function(){me.addtotimeline();},
					args:{step:1},
					history:true
				});
			}
		},
		start:function(event,ui){
			$(ui.helper).find('.badge_thumbnail,.incitate').hide();
			timeline_replace();
			$(ui.helper).css({
				width:$('.timeline_drag').eq(0).width(),
				height:$('.timeline_drag').eq(0).height(),
			});
			$(ui.helper).find('strong').css({fontSize:".9em"});
		},
		drag:function(event,ui){
			$(ui.helper).css({
				width:$('.timeline_drag').eq(0).width(),
				height:$('.timeline_drag').eq(0).height(),
			});
		}
	});
	$('.timeline_content .empty:eq(0)').droppable({
		accept: ".container .headline_media",
		activeClass: "ui-state-highlight",
		tolerance:"touch",
		drop: function( event, ui ) {
			add_to_timeline(ui.draggable,$(this));
		}
	});
	$('.timeline_list').sortable({
		axis: "x",
		items: ".timeline_drag:not(.empty)",
		update: function(e, ui){
			var sorted = $('.timeline_list').sortable('serialize');
			if(url_sort){
				$.ajax({
					url: url_sort,
					type: 'POST',
					data:sorted
				}).done(function() {
					$('#panier,.timeline_show').ajaxReload();
					$('.timeline_line').ajaxReload({callback:function(){
						timeline_replace();
					}});
				});
			}
		}
	});
	$('.timeline_list').disableSelection();
	$('a.add_to_timeline').unbind('click').click(function(){
		var me = $(this);
		if(!$('#timeline .timeline_menu_item').eq(0).is('.on')){
			$('.timeline_video').ajaxReload({
				callback:function(){me.addtotimeline();},
				args:{step:1},
				history:true
			});
		}
		else
			me.addtotimeline();
		return false;
	});
	$('a.remove_panier').unbind('click').click(function(){
		var me = $(this),
			href = $(this).attr('href');
		me.parents('.timeline_drag').fadeOut(function(){
			$(this).remove();
			timeline_replace();
		});
		$.ajax({
			url: href
		}).done(function() {
			$('#panier,.timeline_show').ajaxReload();
			$('#panier,.timeline_show').ajaxReload();
			if($('.timeline_drag').size() < nb_timeline){
				$('.timeline_line').ajaxReload({callback:function(){
					timeline_replace();
				}});
			}
			if($('.info_added_price').is(':visible'))
				$('.info_added_price').fadeOut();
		});
		return false;
	});
	$('a.activate_timeline').unbind('click').click(function(){
		activate_desactivate_timeline();
		return false;
	});
	
	$('a.preview').unbind('click.preview').bind('click.preview',function(){
		$('.media_content').parents('.span12').eq(0).fadeOut('slow',function(){
			$(this).remove();
		});
		$('.media_is_visible').removeClass('media_is_visible');
		$('.timeline_video').ajaxReload({
			callback:function(){$('#timeline').addClass('preview')},
			args:{mode:'preview'},
			history:true
		});
		return false;
	});

	$('a.prev_preview,a.next_preview,a.close_preview').unbind('click').click(function(e){
		var media_visible = parametre_url($(this).attr('href'),'id_article_visible');
		$('.liste_medias').ajaxReload({args:{id_article_visible:media_visible},history:true,callback:function(){
			if($('#media_visible_'+media_visible).size() == '1')
				$.scrollTo($('#media_visible_'+media_visible),500);
		}});
		return false;
	});
	$('.setdates').unbind('click').click(function(e){
		e.preventDefault();
		$('.preview_video').slideUp('500',function(){
			$('.timeline_video').ajaxReload({
				callback:function(){$('#timeline').removeClass('preview')},
				args:{mode:'',step:2},
				history:true
			});
		});
		return false;
	});
	$('.preview_video .close_preview_on').unbind('click').click(function(e){
		e.preventDefault();
		$('.preview_video').slideUp('500',function(){
			$('.timeline_video').ajaxReload({
				callback:function(){$('#timeline').removeClass('preview')},
				args:{mode:''},
				history:true
			});
		});
		return false;
	});
	jQuery('a.moveleft').unbind('click').click(function(){
		var parent = jQuery(this).parents('.timeline_drag').eq(0);
		var id= parent.attr('id');
		var href= $(this).attr('href');
		var before = parent.prev('.timeline_drag:not(".empty")');
		console.log(before);
		if(before.size() > 0){
			parent.fadeOut('slow',function(){
				$.ajax({
					url: href
				}).done(function() {
					var x = parent.detach();
					before.before(x);
					jQuery('#'+id).fadeIn('slow');
				});
			});
		}
		return false;
	});
	jQuery('a.moveright').unbind('click').click(function(){
		var parent = jQuery(this).parents('.timeline_drag');
		var id= parent.attr('id');
		var href= $(this).attr('href');
		var after = parent.next('.timeline_drag:not(".empty")');
		if(after.size() > 0){
			parent.fadeOut('slow',function(){
				$.ajax({
					url: href
				}).done(function() {
					var x = parent.detach();
					after.after(x);
					jQuery('#'+id).fadeIn('slow');
				});
			});
		}
		return false;
	});
}

function init_empty(){
	timeline_drag_width = $('.timeline_drag').eq(0).outerWidth();
	timeline_next_width = $('.timeline_next').outerWidth();
	timeline_width = $('.timeline_container').width();
	nb_timeline = parseInt(timeline_width/timeline_drag_width);
	if($('.timeline_drag').length > nb_timeline){
		var elements = $('.timeline_drag').not('.empty').length;
		var elements_full = $('.timeline_drag').length;
		var empty_leave = (nb_timeline - elements);
		if(empty_leave < 3)
			empty_leave = 3;
		$('.timeline_drag.empty').each(function(i){
			if(i+1 > empty_leave)
				$(this).remove();
		});
	}
	timeline_replace();
}

function timeline_before(){
	var offset = $('.timeline_list').offset().left;
	if($('.timeline_after').is(':hidden') && timeline_max_left < offset){
		$('.timeline_after').fadeIn();
	}
	if(offset < 0){
		$('.timeline_list').css({left:(offset+1)});
	}
	else {
		clearInterval(moveleft);
		$('.timeline_before').fadeOut();
	}
}

function timeline_after(){
	if($('.timeline_before').is(':hidden') && $('.timeline_list').offset().left < 0)
		$('.timeline_before').fadeIn();

	if($('.timeline_list').offset().left > timeline_max_left){
		$('.timeline_list').css({left:($('.timeline_list').offset().left-1)});
	}
	else {
		clearInterval(moveright);
		$('.timeline_after').fadeOut();
	}
}
/**
 * Au document.ready
 */
$(function(){
	init_empty();
	init_drag();
	
	$('#timeline').addClass('active',function(){
		desactivate_timeline();
	});

	setTimeout(desactivate_timeline,500);
	onAjaxLoad(init_empty);
	onAjaxLoad(init_drag);
	box_typewriter();
	$(window).resize(function(){
		window_resize();
	});
});

/**
 * Au window.load
 */
$(window).load(function(){
	$(".thumbnails").find(".thumbnail").uniformHeight();
	$(".homeboxes .hero-unit").uniformHeight();
});