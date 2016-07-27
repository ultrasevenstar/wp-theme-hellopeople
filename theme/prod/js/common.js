var MBLOG = window.MBLOG || {};

MBLOG.USER_AGENT = function () {
	this.ua = window.navigator.userAgent.toLowerCase();
};
MBLOG.USER_AGENT.prototype = {
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
MBLOG.PAGELINK = function($base){
	this.$base = $base;
	this.init();
};
MBLOG.PAGELINK.prototype = {
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
MBLOG.GRID_LAYOUT = function ( $base ) {
	this.$win = jQuery(window);
	this.$base = $base;
	this.init();
};
MBLOG.GRID_LAYOUT.prototype = {
	init: function () {
		var isMobile = new MBLOG.USER_AGENT().isMobile();
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
MBLOG.RESIZE_BOX = function ( $base ) {
	this.$win = jQuery(window);
	this.$base = $base;
	this.$items = this.$base.find('.jsc-resizebox-item');
	this.init();
};
MBLOG.RESIZE_BOX.prototype = {
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

jQuery(function () {
	new MBLOG.PAGELINK( jQuery('.jsc-pagelink') );
	new MBLOG.RESIZE_BOX( jQuery('.jsc-resizebox') );
	new MBLOG.GRID_LAYOUT( jQuery('.jsc-gridlayout') );
});
