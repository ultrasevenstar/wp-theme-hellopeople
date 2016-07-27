var HP = HP || {};
var AjaxData = AjaxData || {};

HP.AjaxManager = {
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
		window.addEventListener('load', function() {
			_this.onLoadWindow();
		});
		window.addEventListener('scroll', function() {
			_this.onScrollWindow();
		});
		this.request.onloadstart = $.proxy( this.onLoadStartRequest, this );
		this.request.onloadend = $.proxy( this.onLoadEndRequest, this );
		this.request.onload = $.proxy( this.onSuccessRequest, this );
		this.request.onreadystatechange = $.proxy( this.onStateChangeRequest, this );
		this.request.onerror = $.proxy( this.onErrorRequest, this );
		this.request.ontimeout = $.proxy( this.onTimeoutRequest, this );
		this.request.onabort = $.proxy( this.onAbortRequest, this );
	},
	onLoadWindow: function() {
		this.scrollSenser();
	},
	onScrollWindow: function() {
		this.scrollSenser();
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
	scrollSenser: function() {
	},
	ajaxRequestJson: function() {
		var loopLength = $('.post').length;
		var requestJson = JSON.stringify({
			nonce	: this.data.nonce,
			category: this.data.category,
			tag		: this.data.tag,
			search	: this.data.search,
			looplength: loopLength
		});
		return requestJson;
	},
	sendAjax: function() {
		this.request.open('POST', this.PATH.SERVER_CONTENT);
		this.request.setRequestHeader('content-type', 'application/json; charset=UTF-8');
		this.request.send( this.ajaxRequestJson() );
	},
	appendPosts: function( childElement ) {
		this.$postsParent.append( $(childElement) );
	}
};

$(function() {
	HP.AjaxManager.init();
});