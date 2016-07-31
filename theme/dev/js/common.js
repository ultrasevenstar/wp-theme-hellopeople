var MBLOG = window.MBLOG || {};

MBLOG.CustomEvent = {
	on: function( eventName, callback, subscriber ) {
		if( !this.eventList ) {
			this.eventList = [];
		}
		this.eventList.push({
			name: eventName,
			callback: callback,
			subscriber: subscriber
		});
	},
	trigger: function( eventName, callback, publisher ) {
		if( !this.eventList ) {
			return;
		}
		for( var i = 0, len = this.eventList.length; i < len; i++ ) {
			var eventItem = this.eventList[i];
			if( eventItem.name !== eventName ) {
				continue;
			}
			var result = eventItem.callback();

			if( callback !== undefined && typeof callback === 'function' ) {
				if( result instanceof Promise ) {
					result.then( callback );
				}else {
					callback( result );
				}
			}
		}
	}
};

MBLOG.UserAgent = function () {
	this.ua = window.navigator.userAgent.toLowerCase();
};
MBLOG.UserAgent.prototype = {
	isMobile: function () {
		return (this.ua.indexOf('windows') !== -1 && this.ua.indexOf('phone') !== -1) ||
			this.ua.indexOf('iphone') !== -1 ||
			this.ua.indexOf('ipod') !== -1 ||
			(this.ua.indexOf('android') !== -1 && this.ua.indexOf('mobile') !== -1) ||
			(this.ua.indexOf('firefox') !== -1 && this.ua.indexOf('mobile') !== -1) ||
			this.ua.indexOf('blackberry') !== -1;
	},
	isTablet: function () {
		return (this.ua.indexOf('windows') !== -1 && this.ua.indexOf('touch') !== -1) ||
			this.ua.indexOf('ipad') !== -1 ||
			(this.ua.indexOf('android') !== -1 && this.ua.indexOf('mobile') === -1) ||
			(this.ua.indexOf('firefox') !== -1 && this.ua.indexOf('tablet') !== -1) ||
			this.ua.indexOf('kindle') !== -1 ||
			this.ua.indexOf('silk') !== -1 ||
			this.ua.indexOf('playbook') !== -1;
	}
};
MBLOG.PageLink = function(){
	this.init();
};
MBLOG.PageLink.prototype = {
	Constants: {
		STATUS_SCROLLED: 'is-scrolled',
		SCROLLED_MARGIN: 60
	},
	init: function () {
		this.setParameters();
		this.bindEvents();
	},
	setParameters: function() {
		this.$win = jQuery(window);
		this.$base = jQuery('.jsc-pagelink');
	},
	bindEvents: function () {
		var _this = this;
		this.$base.on('click', '.jsc-pagelink-top', function () {
			_this.onClickPageTop();
			return false;
		});
		this.$win.on('scroll', function() {
			_this.onScrollWindow();
		});
	},
	onClickPageTop: function () {
		this.goToTop();
	},
	onScrollWindow: function() {
		if( this.$win.scrollTop() < this.Constants.SCROLLED_MARGIN ) {
			this.$base.removeClass( this.Constants.STATUS_SCROLLED );
		}else {
			this.$base.addClass( this.Constants.STATUS_SCROLLED );
		}
	},
	goToTop: function () {
		jQuery('html,body').animate({
			scrollTop: 0
		}, 'slow');
	}
};
MBLOG.GridLayout = function ( $base ) {
	this.$win = jQuery(window);
	this.$base = $base;
	this.init();
};
MBLOG.GridLayout.prototype = {
	Constants: {
		STATUS_STANDBY: 'is-standby',
		FADETIME_MOVE_POSTS: 500
	},
	init: function () {
		this.bindEvents();
	},
	bindEvents: function () {
		var _this = this;
		this.$win.on('load', function () {
			_this.onLoadWindow();
		});
		MBLOG.CustomEvent.on( 'loadedArticles', function() {
			_this.showPosts();
		});
	},
	onLoadWindow: function () {
		var isMobile = new MBLOG.UserAgent().isMobile();
		if( !isMobile ) {
			this.layoutGrid();
		}
		this.$base.removeClass( this.Constants.STATUS_STANDBY );
	},
	layoutGrid: function () {
		this.$base.pinterestGrid({
			offsetX: 5,
			offsetY: 5,
			gridElement: '.jsc-gridlayout-item'
		});
	},
	showPosts: function () {
		var _this = this;
		setTimeout(function() {
			_this.$base.find('.jsc-gridlayout-item').removeClass( _this.Constants.STATUS_STANDBY );
		}, this.Constants.FADETIME_MOVE_POSTS);
	}
};
MBLOG.ResizeBox = function ( $base ) {
	this.$win = jQuery(window);
	this.$base = $base;
	this.$items = this.$base.find('.jsc-resizebox-item');
	this.init();
};
MBLOG.ResizeBox.prototype = {
	init: function () {
		this.bindEvents();
	},
	bindEvents: function () {
		var _this = this;
		this.$win.on('load', function () {
			_this.onLoadWindow();
		});
		this.$win.on('resize', function () {
			_this.onResizeWindow();
		});
	},
	onLoadWindow: function () {
		this.adjustRowHeight();
	},
	onResizeWindow: function () {
		this.adjustRowHeight();
	},
	adjustRowHeight: function () {
		var _this = this;
		var itemsLength = this.$items.length;
		var containerWidth = this.$base.width();
		var totalItemWidth = 0;
		var rowItemsCollection = [];
		var rowItemList = [];

		this.$items.each(function ( index ) {
			var $item = jQuery(this);
			var itemWidth = $item.outerWidth();

			totalItemWidth += itemWidth;
			if( totalItemWidth > containerWidth ) {
				rowItemsCollection.push([].concat(rowItemList));
				rowItemList = [];
				rowItemList.push( $item.outerHeight() );
				totalItemWidth = itemWidth;
				return true;
			}else if( index === itemsLength - 1 ) {
				rowItemList.push( $item.outerHeight() );
				rowItemsCollection.push([].concat(rowItemList));
				return false;
			}else {
				rowItemList.push( $item.outerHeight() );
			}
		});

		var itemIndex = 0;
		if( rowItemsCollection.length === 0 ) return;
		jQuery.each( rowItemsCollection, function () {
			var maxRowHeight = 0;
			var colsCount = this.length;

			jQuery.each( this, function () {
				if( maxRowHeight < this ) {
					maxRowHeight = this;
				}
			});
			for( var i = 0;i < colsCount;i++ ) {
				jQuery(_this.$items.get( itemIndex )).css({
					'minHeight': maxRowHeight + 'px'
				});
				++itemIndex;
			}
		});
	}
};

MBLOG.InfiniteScroll = function() {
	this.init();
};
MBLOG.InfiniteScroll.prototype = {
	Constants: {
		STATUS_COMPLETED: 'is-completed',
		LOADER_OFFSET: 15,
		FADETIME_LOADER: 300
	},
	init: function() {
		var _this = this;
		this.setParameters();
		this.bindEvents();

		setTimeout(function() {
			_this.updateScrollPosition();
		});
	},
	setParameters: function() {
		this.$win = jQuery(window);
		this.$body = jQuery('body');
		this.$base = jQuery('.jsc-infinitescroll');
		this.$loaderWrap = jQuery('.jsc-infinitescroll-loader-wrap');
		this.$loader = jQuery('.jsc-infinitescroll-loader');
		this.initLoading = true;
	},
	bindEvents: function() {
		var _this = this;
		this.$win.on('scroll.InfiniteScroll', function() {
			_this.onScrollWindow();
		});
	},
	onScrollWindow: function() {
		this.updateScrollPosition();
	},
	updateScrollPosition: function() {
		if( this.willStartLoading ) {
			return;
		}

		this.windowBottomPos = this.$win.scrollTop() + this.$win.height();
		this.loaderBottomPos = this.$loaderWrap.offset().top + this.$loaderWrap.height() + this.Constants.LOADER_OFFSET;

		this.willStartLoading = this.windowBottomPos > this.loaderBottomPos;

		if( this.willStartLoading ) {
			this.startLoading();
		}
	},
	startLoading: function() {
		var _this = this;

		this.$loader.fadeIn( this.Constants.FADETIME_LOADER, function() {
			MBLOG.CustomEvent.trigger('loadArticles', function( hasNextData ) {
				_this.endLoading( hasNextData );
			}, _this);
		});
	},
	endLoading: function( hasNextData ) {
		var _this = this;
		this.$loader.fadeOut( this.Constants.FADETIME_LOADER );

		if( this.initLoading ) {
			this.$body.animate({scrollTop: 0}, 500, 'swing', function() {
				_this.willStartLoading = false;
				_this.initLoading = false;
			});
		}else {
			this.willStartLoading = false;
		}

		if( !hasNextData ) {
			this.completedLoadingAll();
		}
	},
	completedLoadingAll: function() {
		this.$win.off('scroll.InfiniteScroll');
		this.$base.addClass( this.Constants.STATUS_COMPLETED );
	}
};

MBLOG.GlobalNavi = function() {
	this.init();
};
MBLOG.GlobalNavi.prototype = {
	Constants: {
		STATUS_SHOW_MENU: 'is-globalmenu-show'
	},
	init: function() {
		this.setParameters();
		this.bindEvents();
	},
	setParameters: function() {
		this.$base = jQuery('.jsc-globalnavi');
		this.$trigger = this.$base.find('.jsc-globalnavi-trigger');
	},
	bindEvents: function() {
		var _this = this;
		this.$trigger.on('click', function(e) {
			e.preventDefault();
			_this.onClickTrigger();
		});
	},
	onClickTrigger: function() {
		this.toggleMenu();
	},
	toggleMenu: function() {
		var isShow = this.$base.hasClass( this.Constants.STATUS_SHOW_MENU );
		if( isShow ) {
			this.$base.removeClass( this.Constants.STATUS_SHOW_MENU );
		}else {
			this.$base.addClass( this.Constants.STATUS_SHOW_MENU );
		}
	}
};

jQuery(function () {
	new MBLOG.ResizeBox( jQuery('.jsc-resizebox') );
	new MBLOG.GridLayout( jQuery('.jsc-gridlayout') );
	new MBLOG.GlobalNavi();
	new MBLOG.PageLink();
	new MBLOG.InfiniteScroll();
});
