var showhide_timeline = false;

function activate_timeline(){
	if($('#timeline').is('.active')){
		$('#timeline').animate({bottom:'-150px'}).removeClass('active');
	}
	else{
		$('#timeline').animate({bottom:'0'}).addClass('active');
	}
}

function show_timeline(){
	clearTimeout(showhide_timeline);
	$('#timeline').animate({bottom:'0'}).addClass('active');
}

function hide_timeline(){
	$('#timeline').animate({bottom:'-150px'}).removeClass('active');
}
jQuery(document).ready(function(){
	//show_hide_timeline();
	//onAjaxLoad(show_hide_timeline);
});

function add_to_timeline( $item, $dropbox) {
	$dropbox = $dropbox.parent().find('.empty').eq(0);
	var dropbox_html = $dropbox.html();
	$dropbox.removeClass('empty').empty();
	$item.find('.badge_thumbnail,.incitate').remove();
	var html = $item.html();
	$('<div class="headline_media"></div>').html(html).appendTo( $dropbox).find('.badge_thumbnail').remove();
	var href = $item.parents('article').attr('data-add_timeline');
	if(href){
		$.ajax({
			url: href
		}).done(function() {
			$('#panier').ajaxReload();
			$('.timeline_line').ajaxReload({callback:function(){
				var cible=false,count = $('.timeline_drag').not('.empty').size();
				if(count > 2)
					cible = $('.empty:eq(0)').prev().prev();
				else if(count >= 1)
					cible = $('.empty:eq(0)').prev();
				else
					cible = $('.empty:eq(0)');
				$('.timeline_list').scrollTo(cible,500);
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
	$('.content .headline_media').draggable({
		cursor: "move",
		revert: true,
		opacity: 0.7,
		cursorAt: { top: ($('.timeline_drag').eq(0).height()/2), left: ($('.timeline_drag').eq(0).width()/2) },
		width:$('.timeline_drag').eq(0).width(),
		zIndex: 2500,
		containment: "document",
		helper:"clone",
		start:function(event,ui){
			show_timeline();
			$(ui.helper).find('.badge_thumbnail,.incitate').remove();
			var cible=false,count = $('.timeline_drag').not('.empty').size();
			if(count > 2)
				cible = $('.empty:eq(0)').prev().prev();
			else if(count == 1)
				cible = $('.empty:eq(0)').prev();
			else
				cible = $('.empty:eq(0)');
			$('.timeline_list').scrollTo(cible,500);
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
		  add_to_timeline( ui.draggable,$(this) );
	  }
	});
	$('.timeline_list').sortable({
		axis: "x",
		items: ".timeline_drag:not(.empty)"
	});
	$('.timeline_list').disableSelection();
	$('a.add_to_timeline').unbind('click').click(function(){
		var me = $(this),href = $(this).attr('href');
		var id_article = $(this).parents('.media_content').eq(0).attr('id').replace('media_visible_','article_');
		var content_box = $('#'+id_article).find('.headline_media');
		var cible = $('.timeline_content .empty').eq(0);
		show_timeline();
		$('.timeline_list').scrollTo(cible,500,{onAfter:function(){
			me.parents('.media_visible').effect( 'transfer', { to: cible }, 700, function(){
				var content = content_box.clone();
				content.find('.badge_thumbnail,.incitate').remove();
				cible.removeClass('empty').empty();
				content.appendTo(cible);
				$.ajax({
					url: href
				}).done(function() {
					$('#panier').ajaxReload();
					$('.timeline_line').ajaxReload({callback:function(){
						var cible=false,count = $('.timeline_drag').not('.empty').size();
						if(count > 2)
							cible = $('.empty:eq(0)').prev().prev();
						else if(count >= 1)
							cible = $('.empty:eq(0)').prev();
						else
							cible = $('.empty:eq(0)');
						$('.timeline_list').scrollTo(cible,500);
					}});
				});
			});
		}});
		return false;
	});
	$('a.remove_panier').unbind('click').click(function(){
		var me = $(this),href = $(this).attr('href');
		$.ajax({
			url: href
		}).done(function() {
			me.parents('.timeline_drag').fadeOut(function(){
				$(this).remove();
				var cible=false,count = $('.timeline_drag').not('.empty').size();
				if(count > 2)
					cible = $('.empty:eq(0)').prev().prev();
				else if(count == 1)
					cible = $('.empty:eq(0)').prev();
				else
					cible = $('.empty:eq(0)');
				$('.timeline_list').scrollTo(cible,500);
			});
			$('#panier').ajaxReload();
		});
		return false;
	});
	$('a.activate_timeline').unbind('click').click(function(){
		activate_timeline();
		return false;
	});
	
	$('a.preview').unbind('click.preview').bind('click.preview',function(){
		$('.media_content').parents('.span12').eq(0).fadeOut('slow',function(){
			$(this).remove();
		});
		$('.media_is_visible').removeClass('media_is_visible');
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
	
}

$(function(){
	init_drag();
	onAjaxLoad(init_drag);
	var cible=false,count = $('.timeline_drag').not('.empty').size();
	if(count > 2)
		cible = $('.empty:eq(0)').prev().prev();
	else if(count >= 1)
		cible = $('.empty:eq(0)').prev();
	else
		cible = $('.empty:eq(0)');
	$('.timeline_list').scrollTo(cible,500);
});

jQuery.fn.animateLoading = function() {
	this.attr('aria-busy','true').addClass('loading');
	if (typeof ajax_image_searching != 'undefined'){
		var i = (this).find('.image_loading');
		if (i.length) i.eq(0).html(ajax_image_searching);
		else this.prepend('<span class="image_loading">'+ajax_image_searching+'</span>');
	}
	return this; // don't break the chain
}