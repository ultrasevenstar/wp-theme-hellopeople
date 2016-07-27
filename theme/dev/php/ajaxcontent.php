<?php
//wordpress関数が使えるようにwp-load.phpを読み込む
require_once( dirname( dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) ) . '/wp-load.php' );

//リクエストデータ取り込み
$request = json_decode( file_get_contents('php://input'), true );

//nonceチェック
if( !wp_verify_nonce( $request['nonce'] ) ) {
	die('ERROR: nonce is not correct');
}

//表示数の定義
$post_per_page = get_option('post_per_page');

//$wp_query用のクエリ
$args = array(
	'posts_per_page' => $post_per_page,
	'offset' => $requests['looplength'],
	'orderby' => 'post_date',
	'order' => 'DESC',
	'post_type' => 'post',
	'post_status' => 'publish'
);

//カテゴリーアーカイブの場合
if( $requests['category'] ) {
	$args = $args + array(
		'cat' => $requests['category']
	);
}
//タグアーカイブの場合
if( $requests['tag'] ) {
	$args = $args + array(
		'tag_id' => $requests['tag']
	);
}
//検索の場合
if( $requests['search'] ) {
	$args = $args + array(
		's' => $requests['search']
	);
}

$wp_query = new WP_Query( $args );

//クエリに合致した投稿数をカウント
$post_count = count( $wp_query -> posts );

//残存投稿数が$post_per_page以下ならfalseを返して以降のAjax通信を止める
$hasNextData = $post_count < $posts_per_page;

//擬似ループにてloop部品を組み立てる
while( have_posts() ) {
	the_post();
	$permalink = get_the_permalink();
	$time = get_the_time('Y/m/d G:i');
	$title = get_the_title();
	$output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
	$cat = get_the_category();
	$catname = $cat[0] -> cat_name;
	$catid = $cat[0] -> cat_ID;
	$caturl = get_category_link( $catid );
	$img = $matches[1][0];
	$tags = get_the_tags();
	$retags = array_values((array)$tags);
	$tagname = $retags[0] -> name;
	$tagid = $retags[0] -> term_id;
	$tagurl = get_tag_link( $tagid );

	if( empty($img) ) {
		//画像の指定がない場合は何も表示しない
		$img = '';
	}
	$img_tag = '<img class="img" src="' . $img . '">';
	$loophtml = <<< EOF
		<div>{$title}</div>
EOF;

	$tmp = $tmp . $loophtml;
}

//レスポンスデータをjson形式に整形
$data = array(
	'html' => $tmp,
	'hasNextData' => $hasNextData
);

$jsonData = json_encode( $data );

header('Content-Type: application/json; X-Content-Type-Options: nosniff; charset=utf-8');

echo $jsonData;
die();

?>
