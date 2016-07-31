var MBLOG = MBLOG || {};
var AjaxData = AjaxData || {};

MBLOG.AjaxManager = {
	PATH: {
		SERVER_CONTENT: 'http://baton.hellopeople.jp/wp-content/themes/hellopeople_dev/php/ajaxcontent.php'
	},
	init: function() {
		this.setParameters();
		this.bindEvents();
	},
	setParameters: function() {
		this.$win = $(window);
		this.$postsParent = $('.jsc-ajax-posts');

		this.request = new XMLHttpRequest();
		this.request.timeout = 10000;
		this.data = window.AjaxData;
	},
	bindEvents: function() {
		var _this = this;
		this.request.onloadstart = $.proxy( this.onLoadStartRequest, this );
		this.request.onloadend = $.proxy( this.onLoadEndRequest, this );
		this.request.onload = $.proxy( this.onSuccessRequest, this );
		this.request.onreadystatechange = $.proxy( this.onStateChangeRequest, this );
		this.request.onerror = $.proxy( this.onErrorRequest, this );
		this.request.ontimeout = $.proxy( this.onTimeoutRequest, this );
		this.request.onabort = $.proxy( this.onAbortRequest, this );

		MBLOG.CustomEvent.on( 'loadArticles', function() {
			return _this.sendAjax();
		}, this);
	},
	onLoadStartRequest: function() {
		if( !this.data.registered ) {
			//ローディングを開始
			this.data.registered = true;
		}
	},
	onLoadEndRequest: function() {
		this.data.registered = false;

		if( this.promise ) {
			this.promise.resolve( this.data.hasNextData );
		}
	},
	onSuccessRequest: function() {
		var responseData = JSON.parse( this.request.response );
		if( responseData.html ) {
			this.appendPosts( responseData.html );
		}
		this.data.hasNextData = responseData.hasNextData;
	},
	onStateChangeRequest: function() {
	},
	onErrorRequest: function() {
	},
	onTimeoutRequest: function() {
	},
	onAbortRequest: function() {
	},
	getRequestJson: function() {
		var offset = $('.post').length;
		var requestJson = JSON.stringify({
			nonce	: this.data.nonce,
			category: this.data.category,
			tag		: this.data.tag,
			search	: this.data.search,
			offset: offset
		});
		return requestJson;
	},
	sendAjax: function() {
		var _this = this;
		return new Promise( function( resolve, reject ) {
			_this.promise = {
				resolve: resolve,
				reject: reject
			};
			_this.request.open('POST', _this.PATH.SERVER_CONTENT);
			_this.request.setRequestHeader('content-type', 'application/json; charset=UTF-8');
			_this.request.send( _this.getRequestJson() );
		});
	},
	appendPosts: function( childElement ) {
		this.$postsParent.append( $(childElement) );
		this.$win.trigger('resize');

		MBLOG.CustomEvent.trigger('loadedArticles');
	}
};

$(function() {
	MBLOG.AjaxManager.init();
});