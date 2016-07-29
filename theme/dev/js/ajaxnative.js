var MBLOG = MBLOG || {};
var AjaxData = AjaxData || {};

MBLOG.AjaxManager = {
	PATH: {
		SERVER_CONTENT: 'http://baton.hellopeople.jp/wp-content/themes/hellopeople_dev/php/ajaxcontent.php'
	},
	init: function() {
		this.setParameters();
		this.bindEvents();
		this.sendAjax();
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
			_this.sendAjax();
		});
	},
	onLoadStartRequest: function() {
		console.log('onLoadStartRequest');
		if( !this.data.registered ) {
			//ローディングを開始
			this.data.registered = true;
		}
	},
	onLoadEndRequest: function() {
		console.log('onLoadEndRequest');
		this.data.registered = false;
	},
	onSuccessRequest: function() {
		console.log('onSuccessRequest');
		console.log( this.request );
		var responseData = JSON.parse( this.request.response );
		if( responseData.html ) {
			this.appendPosts( responseData.html );
		}
		this.data.hasNextData = responseData.hasNextData;
	},
	onStateChangeRequest: function() {
		console.log('onStateChangeRequest');
	},
	onErrorRequest: function() {
		console.log('onErrorRequest');
	},
	onTimeoutRequest: function() {
		console.log('onTimeoutRequest');
	},
	onAbortRequest: function() {
		console.log('onAbortRequest');
	},
	ajaxRequestJson: function() {
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
		console.log('send ajax');
		this.request.open('POST', this.PATH.SERVER_CONTENT);
		this.request.setRequestHeader('content-type', 'application/json; charset=UTF-8');
		this.request.send( this.ajaxRequestJson() );
	},
	appendPosts: function( childElement ) {
		this.$postsParent.append( $(childElement) );
		this.$win.trigger('resize');
	}
};

$(function() {
	MBLOG.AjaxManager.init();
});