;(function(jQuery){

	//jQueryプラグイン用としてjQuery.fnに関数を定義する
	jQuery.fn.pinterestGrid = function(options){

		//呼び出し元を保持
		elements = jQuery(this);
		//windowオブジェクト(ブラウザ)を保持
		winObject = jQuery(window);
		//デフォルトの引数を呼び出し元に指定された引数値で上書き
		opts = jQuery.extend({}, jQuery.fn.pinterestGrid.defaults, options);

		//表示されたカラムの列幅と表示できるカラム数を取得
		setCol();
		//呼び出し元の幅をカラム列×表示可能列数に設定
		elements.width(colWidth * numOfCol);

		//gridの配置を更新
		applyPinterestGrid();

		//windowのresizeイベントを削除し、新たにresizeイベントを定義する
		winObject.unbind('resize').resize(function(){
			var containerWidth;
			var winWidth = winObject.width() - opts.offsetX * 2;

			//window内幅より合計カラム幅の方が大きい場合
			if(winWidth < colWidth * numOfCol){
				setCol();
				//container幅にカラムを１列減らした数値を代入
				containerWidth = colWidth * (numOfCol - 1);
			//window内幅が合計カラム＋１列より大きい場合
			}else if(winWidth > colWidth * (numOfCol + 1)){
				setCol();
				//container幅にカラムを１列増やした数値を代入
				containerWidth = colWidth * (numOfCol + 1);
			}

			//上の条件分岐でいずれかに該当した場合
			if(containerWidth){
				//呼び出し元の幅を取得
				var current = elements.width();
				//呼び出し元の幅をカラム列×表示可能列数に設定
				elements.width(colWidth * numOfCol);
				//gridの配置を更新
				applyPinterestGrid();
			}
		});

		return this;
	}

	//デフォルトオプション（プラグイン用関数のデフォルト引数値を定義）
	jQuery.fn.pinterestGrid.defaults = {
		//grid同士の横軸の間隔
		offsetX: 5,
		//grid同士の縦軸の間隔
		offsetY: 5,
		gridElement: 'div'
	};

	var elements,
	winObject,
	numOfCol,
	opts = {},
	colWidth,
	gridArray = [];

	//IE用にArray.indexOfメソッドを追加
	if(!Array.prototype.indexOf){
		Array.prototype.indexOf = function(elt){
			var len = this.length >>> 0;

			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if(from < 0){
				from += len;
			}

			for(; from < len; from++){
				if(from in this && this[from] === elt){
					return from;
				}
			}
			return -1;
		}
	}

	//Pinterest風グリッドレイアウト適用
	function applyPinterestGrid(){
		//最初にgridArrayを初期化
		createEmptyGridArray();

		//呼び出し元の子要素にある対象要素に対して処理を行う
		elements.children(opts.gridElement).each(function(index){
			setPosition(jQuery(this));
		});

		//最後にエレメントの高さを設定
		var heightarr = getHeightArray(0, gridArray.length);
		//最下部にあるgridの底辺y値＋offsetの値を呼び出し元の高さとして設定
		elements.height(heightarr.max + opts.offsetY);
	}

	//カラムの数とwidthを設定する
	function setCol(){
		//1カラム当たりの横幅を変数colWidthに設定
		colWidth = jQuery(opts.gridElement).outerWidth() + opts.offsetX * 2;
		//ウインドウ内幅に収まる最大カラム数を変数numOfColに設定
		var parentWidth = elements.parent().width();
		numOfCol = Math.floor((parentWidth - opts.offsetX * 2) / colWidth);
	}

	//空のGridArrayを作成
	function createEmptyGridArray(){
		//最初にGridArrayを初期化
		gridArray = [];
		//表示できるカラム数分ループする
		for(var i = 0;i < numOfCol;i++){
			pushGridArray(i, 0, 1, -opts.offsetY);
		}
	}

	//gridArrayに新しいgridを追加
	/*
		x:横軸のカラムインデックス
		y:gridの上辺部が位置する縦軸y値
		size:追加するgrid数
		height:gridの高さ
	*/
	function pushGridArray(x, y, size, height){
		//追加数分のgridを生成し、gridArray配列に追加する
		for(var i = 0;i < size; i++){
			var grid = [];
			//横軸のインデックス値を設定
			grid.x = x + i;
			//追加数を設定（意味有る？）
			grid.size = size;
			//縦軸の最下部のyを設定
			grid.endY = y + height + opts.offsetY * 2;
			//gridArray配列に追加
			gridArray.push(grid);
		}
	}

	//gridArrayから指定したx位置にあるgridを削除
	function removeGridArray(x, size){
		for(var i = 0;i < size; i++){
			var idx = getGridIndex(x + i);
			//gridArrayから１つだけを取り除く
			gridArray.splice(idx, 1);
		}
	}

	//gridのx値を基準にgridのインデックスを検索
	function getGridIndex(x){
		for(var i = 0;i < gridArray.length;i++){
			var obj = gridArray[i];
			if(obj.x == x){
				return i;
			}
		}
	}

	//gridArray内にある高さの最小限と最大値および最小値のあるx値を取得
	/*
		x:高さを求める際の横軸のカラム開始位置
		size:高さを求める際に計算対象のエレメント数
	*/
	function getHeightArray(x, size){
		var heightArray = [];
		var temps = [];

		//各gridの底辺Y値をtemps配列に設定
		for(var i = 0;i < size; i++){
			//横軸のインデックスを取得
			var idx = getGridIndex(x + i);
			//temps配列に最下部Yを追加
			temps.push(gridArray[idx].endY);
		}
		//最上部に位置するgrid底辺のY値を取得
		heightArray.min = Math.min.apply(Math, temps);
		//最下部に位置するgrid底辺のY値を取得
		heightArray.max = Math.max.apply(Math, temps);
		//最上部に位置するgridの列インデックス値を取得
		heightArray.x = temps.indexOf(heightArray.min);

		return heightArray;
	}

	//gridが配置されるx座標値、y座標値を取得
	function getGridPosition(){
		var pos = [];
		//gridArray内にある高さの最小限と最大値および最小値のあるx値を取得
		var tempHeight = getHeightArray(0, gridArray.length);
		//最上部のgridのx、yを戻り値に設定（tempHeight.maxは使ってない）
		pos.x = tempHeight.x;
		pos.y = tempHeight.min;
		return pos;
	}

	//gridを配置
	/*
		grid:配置対象の１つのgridエレメント
	*/
	function setPosition(grid){
		//gridにdataという名前が関連付けされていない場合は1を関連付ける
		if(!grid.data('size') || grid.data('size') < 0){
			grid.data('size', 1);
		}

		//gridの情報を定義
		var pos = getGridPosition();//gridArray内の最上部に位置するgridのx、yを取得
		//gridの幅を変数に代入
		var gridWidth = colWidth - (grid.outerWidth() - grid.width());

		//gridのスタイルを更新
		grid.css({
			//x軸はxインデックス×カラム幅に固定配置
			'left':pos.x * colWidth,
			//y軸は最上部に位置するgridの底辺に固定は位置
			'top':pos.y,
			//配置は固定
			'position':'absolute'
		});

		//gridArrayを新しいgridで更新
		removeGridArray(pos.x, grid.data('size'));
		pushGridArray(pos.x, pos.y, grid.data('size'), grid.outerHeight());
	}


})(jQuery);