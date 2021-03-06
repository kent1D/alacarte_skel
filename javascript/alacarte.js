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
};

/**
 * Generate typewriter effect
 */
function box_typewriter(){
	$(".box1 span.typewriter,.box2 span.typewriter").empty();
	$(".box1 span.first_text").empty().typed({
		strings: ["THIS IS A WEBSHOP WHERE "],
		typeSpeed: 60,
		loop:false,
		startDelay:3000,
		callback:function(){
			$('.box1 span.first_text').next('.typed-cursor').remove();
			$(".box1 span.typewriter").empty().typed({
				strings: ["YOU CAN ORDER A PERFORMANCE TO BE EXECUTED LIVE.", "YOU CAN BECOME THE CO-CREATOR OF OUR SHOW.","YOUR DECISIONS DETERMINE HOW OUR PERFORMANCE WILL LOOK LIKE.","YOU CAN BE CREATIVE.","YOU CAN HAVE FUN!!"],
				typeSpeed: 60,
				backDelay: 3000,
				loop:true
			});
		}
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
};

/**
 * Fonction d'ajout d'éléments à la timeline
 */
jQuery.fn.addtotimeline = function(){
	var me = $(this),href = $(this).attr('href');
	console.log($(this).parents('.media_content').eq(0).attr('id'));
	var id_formulaires_reponse = $(this).parents('.media_content').eq(0).attr('id').replace('media_visible_cookie_','formulaires_reponse_');
	var id_article = $(this).parents('.media_content').eq(0).attr('id').replace('media_visible_','article_');
	var content_box = id_article ? $('#'+id_article).find('.headline_media') : $('#'+id_formulaires_reponse).find('.headline_media');
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
				$('#panier').ajaxReload();
				$('.timeline_video').ajaxReload({callback:function(){
					timeline_replace();
					if($('.timeline_drag').not('.empty').size() == 1)
						$('.info_added_price').fadeIn();
				}});
			});
		});
	});
	return false;
};

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

function resize_height_timeline(){
	$('#timeline .timeline_content').css('height','');
	$('#timeline .timeline_content').attr('data-heightorig',$('#timeline .timeline_content').outerHeight());
}
/**
 * Active / désactive la timeline
 */
function activate_desactivate_timeline(){
	if(!$('#timeline').is('.preview')){
		if($('#timeline').is('.active')){
			resize_height_timeline();
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

/**
 * Descend la timeline
 */
function desactivate_timeline(){
	if(!$('#timeline').is('.preview') && $('#timeline').is('.active')){
		resize_height_timeline();
		$('#timeline .timeline_content').animate({height:'3.5em'});
		$('#timeline').removeClass('active');
	}
}

/**
 * Affiche la totalité de la timeline
 */
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

function add_to_timeline_drag( $item, $dropbox) {
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
			$('#panier').ajaxReload();
			$('.timeline_video').ajaxReload({callback:function(){
				timeline_replace();
				if($('.timeline_drag').not('.empty').size() == 1)
					$('.info_added_price').fadeIn();
			}});
		});
	}
}

function media_visible_add_to_timeline(){
	$(".media_visible" ).on("click.alacarte", "a.add_to_timeline", function(e){
		event.preventDefault();
		return false;
	});
}

var init_drag = function(){
	if(!$('#timeline').is('.active'))
		$('#timeline .timeline_content').animate({height:'3.5em'});
	$('.timeline_menu a').eq(2).unbind('click').click(function(){
		if($('.formulaire_panier_set_dates').is(':visible')){
			$('.formulaire_panier_set_dates form').submit();
			return false;
		}
	});
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

	$('div').not('#timeline,.media_add_to_timeline,.media_infos').click(function(){
		if(!$('#timeline').is(':hover') && $('#timeline').is('.active')){
			desactivate_timeline();
		}
	});
	$('.content .media:not(".not_draggable") .headline_media').draggable({
		cursor: "move",
		opacity: 0.7,
		cursorAt: { top: ($('.timeline_drag').eq(0).height()/2), left: ($('.timeline_drag').eq(0).width()/2) },
		width:$('.timeline_drag').eq(0).width(),
		zIndex: 2500,
		helper:"clone",
		beforeStart:function(event,ui){
			activate_timeline();
			if(!$('#timeline .timeline_menu_item').eq(0).is('.on')){
				$('.timeline_video').ajaxReload({
					callback:function(){},
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
		accept: ".container .media:not('.not_draggable') .headline_media",
		activeClass: "ui-state-highlight",
		tolerance:"touch",
		drop: function( event, ui ) {
			add_to_timeline_drag(ui.draggable,$(this));
		}
	});
	/**
	 * Les éléments de la timeline peut être rangés
	 * Sauf si on est en mode preview
	 */
	$('.timeline_list:not(.preview)').sortable({
		axis: "x",
		items: ".timeline_drag:not(.empty)",
		forcePlaceholderSize: true,
		change: function(e, ui){
		},
		out: function(e, ui){
		},
		over: function(e, ui){
			if(e.clientX <= 20){
				timeline_before();
			}
		},
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
	var add_to_timeline_click = function(ui,me){
		console.log(me);
		if(!me)
			var me = $(this);
		console.log(me);
		if(!$('#timeline .timeline_menu_item').eq(0).is('.on')){
			$('.timeline_video').ajaxReload({
				callback:function(){
					me.addtotimeline();
				},
				args:{step:1},
				history:true
			});
		}
		else
			me.addtotimeline();
		return false;
	};
	$('.media_visible').off('click.alacarte',"a.add_to_timeline_click").on("click.alacarte","a.add_to_timeline_click",add_to_timeline_click);
	
	var remove_panier = function(){
		var me = $(this),
			href = $(this).attr('href');
		me.parents('.timeline_drag').fadeOut(function(){
			$(this).remove();
		});
		$.ajax({
			url: href
		}).done(function() {
			$('#panier').ajaxReload();
			$('.timeline_video').ajaxReload({callback:function(){
				timeline_replace();
			}});
			if($('.info_added_price').is(':visible'))
				$('.info_added_price').fadeOut();
		});
		return false;
	};
	
	$('#timeline').off('click.alacarte','a.remove_panier').on('click.alacarte','a.remove_panier',remove_panier);

	$('a.activate_timeline').unbind('click').click(function(){
		activate_desactivate_timeline();
		return false;
	});
	
	$('a.preview').unbind('click').bind('click',function(e){
		e.preventDefault();
		$('.media_content').parents('.span12').eq(0).fadeOut('slow',function(){
			$(this).remove();
		});
		$('.media_is_visible').removeClass('media_is_visible');
		$('.timeline_video').ajaxReload({
			callback:function(){$('#timeline').addClass('preview');},
			args:{mode:'preview',id_article_visible:null},
			history:true
		});
		return false;
	});
	
	$('a.show_information,a.prev_preview,a.next_preview,a.close_preview').unbind('click').click(function(e){
		var media_visible = parametre_url($(this).attr('href'),'id_article_visible'),
			media_visible_cookie = parametre_url($(this).attr('href'),'id_custom_made');
		$('.liste_medias').ajaxReload({args:{id_article_visible:media_visible,id_custom_made:media_visible_cookie},history:true,callback:function(){
			if($('#media_visible_'+media_visible).size() == '1')
				$.scrollTo($('#media_visible_'+media_visible),500);
			else if($('#media_visible_cookie_'+media_visible_cookie).size() == '1')
				$.scrollTo($('#media_visible_cookie_'+media_visible_cookie),500);
		}});
		return false;
	});
	$('.preview_video .close_preview_on, .setdates').unbind('click').click(function(e){
		var me = $(this);
		e.preventDefault();
		$('.preview_video').slideUp('500',function(){
			var arguments = {mode:null,step:null};
			if(me.is('.setdates'))
				arguments.step = 2;
			$('.timeline_video').ajaxReload({
				callback:function(){$('#timeline').removeClass('preview');},
				args:arguments,
				history:true
			});
		});
		return false;
	});
	jQuery('a.moveleft').unbind('click').click(function(){
		var parent = jQuery(this).parents('.timeline_drag').eq(0),
			id= parent.attr('id'),
			href= $(this).attr('href'),
			before = parent.prev('.timeline_drag:not(".empty")');
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
		var parent = jQuery(this).parents('.timeline_drag'),
			id= parent.attr('id'),
			href= $(this).attr('href'),
			after = parent.next('.timeline_drag:not(".empty")');
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
};

function init_empty(){
	$('.headline_media .h3-like').each(function(){
		var height = $(this).height()/2;
		$(this).css({marginTop:'-'+height+'px'});
	});
	timeline_drag_width = $('.timeline_drag').eq(0).outerWidth();
	timeline_next_width = $('.timeline_next').outerWidth();
	timeline_width = $('.timeline_container').width();
	nb_timeline = parseInt((timeline_width-timeline_next_width)/timeline_drag_width);
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
	/**
	 * Ne pas replacer la timeline au chargement si on est en mode preview,
	 * Sinon on la replace bien
	 */
	if(!$('.timeline_list').is('.preview'))
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

function init_player_preview(){
	if($('.timeline_line').is('.timeline_preview')){
		var count = $('.timeline_drag').not('.empty').size();
		var left = ($('.timeline_drag').eq(0).outerWidth()*($('.timeline_drag').not('.empty').size()-nb_timeline));
		timeline_max_left = 0-left;
		$('.timeline_list').animate({left:'0px'});
		if(count > nb_timeline){
			if($('.timeline_after').is(':hidden'))
				$('.timeline_after').fadeIn();
		}else{
			if($('.timeline_after').is(':visible'))
				$('.timeline_after').fadeOut();
		}
	}
	$('#video_preview video').on('ms_start',function(){
		var nb = $(".preview .timeline_drag:not(.empty)").index($(".preview .timeline_drag.playing"))+1;
		if($('#video_preview .media_wrapper .messages').size() == 0)
			$('#video_preview .media_wrapper').append('<div class="messages" style="display:none"></div>');
		$('#video_preview video').ms_messages('','CHAPTER '+nb,true);
		jQuery(this).parents('.media_wrapper').addClass('preview');
	});
	$('#video_preview video').bind("play",function(){
		if(!jQuery(this).parents('.media_wrapper').is('.preview'))
			jQuery(this).parents('.media_wrapper').addClass('preview');
		if(jQuery(this).parents('.media_wrapper').is('.end_preview')){
			$(this)[0].pause();
			$('.preview .timeline_drag:not(.empty)').eq(0).click();
			jQuery(this).parents('.media_wrapper').removeClass('end_preview').removeClass('seeking');
		}
	});
	$('#video_preview video').bind("ended",function(){
		var me = $(this),
			next_video = $('.timeline_drag.playing').next('.timeline_drag:not(.empty)').eq(0);
		if(next_video.size() > 0){
			var nb = $(".preview .timeline_drag:not(.empty)").index(next_video)+1,
				element = next_video.find('.headline_media');
			$(element[0].attributes).each(function() {
				if(this.nodeName.match(/data-/)){
					var extension = this.nodeName.replace(/data-/,'');
					$('#video_preview video [src*=".'+extension+'"]').attr('src',this.value);
				}
			});
			$('#video_preview video')[0].load();
			$('#video_preview video')[0].play();
			$('.timeline_drag.playing').removeClass('playing');
			$('#video_preview video').ms_messages('','CHAPTER '+nb,true);
			next_video.addClass('playing');
			var count = $('.timeline_drag').not('.empty').size(),position = $(".preview .timeline_drag:not(.empty)").index(next_video)+1;
			if(position > (nb_timeline/2)){
				var nb_position_timeline = position - Math.floor((nb_timeline/2));
				var left = nb_position_timeline * timeline_drag_width;
				$('.timeline_list').animate({left:'-'+left+'px'});
				if($('.timeline_before').is(':hidden'))
					$('.timeline_before').fadeIn();
			}
			else{
				var left = 0;
				$('.timeline_list').animate({left:'-'+left+'px'});
				if($('.timeline_before').is(':visible'))
					$('.timeline_before').fadeOut();
			}
		}else{
			jQuery(this).parents('.media_wrapper').removeClass('preview').addClass('end_preview');
		}
	});
	$('.preview .timeline_drag:not(.empty)').unbind('click').click(function(){
		if(!$(this).is('.playing')){
			var nb = $(".preview .timeline_drag:not(.empty)").index($(this))+1,
				element = $(this).find('.headline_media');
			$(element[0].attributes).each(function() {
				if(this.nodeName.match(/data-/)){
					var extension = this.nodeName.replace(/data-/,'');
					$('#video_preview video [src*=".'+extension+'"]').attr('src',this.value);
				}
			});
			$('#video_preview video')[0].load();
			$('#video_preview video')[0].play();
			$('#video_preview video').ms_messages('','CHAPTER '+nb,true);
			$('.timeline_drag.playing').removeClass('playing');
			$(this).addClass('playing');
			var count = $('.timeline_drag').not('.empty').size(),position = $(".preview .timeline_drag:not(.empty)").index($(this))+1;
			if(position > (nb_timeline/2)){
				var nb_position_timeline = position - Math.floor((nb_timeline/2));
				var left = nb_position_timeline * timeline_drag_width;
				$('.timeline_list').animate({left:'-'+left+'px'});
				if($('.timeline_before').is(':hidden'))
					$('.timeline_before').fadeIn();
			}
			else{
				var left = 0;
				$('.timeline_list').animate({left:'-'+left+'px'});
				if($('.timeline_before').is(':visible'))
					$('.timeline_before').fadeOut();
			}
		}
	});
}

/**
 * Retaille les iframe issues d'oembed pour qu'elles prennent 100% de la largeur
 */
function resizeiframe(){
	$('.oembed iframe').each(function(){
		var height = $(this).height(),
			width = $(this).width(),
			parent_width= $(this).parents('.oembed').parent().width();
		var ratio = parent_width/width;
		$(this).width('100%').height(height*ratio);
	});
}

function link_new_window(){
	var attribute_blank = function(){
		$(this).attr('target', '_blank');
	};
	$('body').off('click.alacarte','a.spip_out').on('click.alacarte','a.spip_out',attribute_blank);
}

/**
 * Déplacer les spans vers la gauche au hover dans le ticket lorsqu'ils sont trop longs
 */
function ticket_move_text(){
	jQuery('.ticket .ticket_content .ticket_chapters ul li span,.ticket .show_info span').unbind('hover').hover(function(){
		var width_parent = $(this).parents('li,td').width(), width = $(this).outerWidth();
		var margin = width-width_parent+10;
		if(width > width_parent && !$(this).is('.is_moving')){
			$(this).addClass('is_moving');
			$(this).animate({'margin-left':'-'+margin+'px'},1000,function(){
				$(this).removeClass('is_moving');
			});
		}
	},function(){
		$(this).addClass('is_moving');
		$(this).animate({'margin-left':'0'},1000,function(){
			$(this).removeClass('is_moving');
		});
	});
}