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
			if( result instanceof Promise ) {
				result.then( callback );
			}else {
				callback( result );
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
MBLOG.PageLink = function($base){
	this.$base = $base;
	this.init();
};
MBLOG.PageLink.prototype = {
	init: function () {
		this.bindEvents();
	},
	bindEvents: function () {
		var self = this;
		this.$base.on('click', '.jsc-pagelink-top', function () {
			self.onClickPageTop();
			return false;
		});
	},
	onClickPageTop: function () {
		this.goToTop();
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
	init: function () {
		var isMobile = new MBLOG.UserAgent().isMobile();
		if( !isMobile ) {
			this.bindEvents();
		}else {
			this.showGrid();
		}
	},
	bindEvents: function () {
		var self = this;
		this.$win.on('load', function () {
			self.onLoadWindow();
		});
	},
	onLoadWindow: function () {
		this.layoutGrid();
		this.showGrid();
	},
	layoutGrid: function () {
		this.$base.pinterestGrid({
			offsetX: 5,
			offsetY: 5,
			gridElement: '.post'
		});
	},
	showGrid: function () {
		this.$base.addClass('is-show');
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
		var self = this;
		this.$win.on('load', function () {
			self.onLoadWindow();
		});
		this.$win.on('resize', function () {
			self.onResizeWindow();
		});
	},
	onLoadWindow: function () {
		this.adjustRowHeight();
	},
	onResizeWindow: function () {
		this.adjustRowHeight();
	},
	adjustRowHeight: function () {
		var self = this;
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
				jQuery(self.$items.get( itemIndex )).css({
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

jQuery(function () {
	new MBLOG.PageLink( jQuery('.jsc-pagelink') );
	new MBLOG.ResizeBox( jQuery('.jsc-resizebox') );
	new MBLOG.GridLayout( jQuery('.jsc-gridlayout') );
	new MBLOG.InfiniteScroll();
});
