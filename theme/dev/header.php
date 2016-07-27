<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes"/>
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:type" content="blog"/>
	<meta property="og:description" content="<?php bloginfo('description'); ?>"/>
	<meta property="og:url" content="<?php the_permalink(); ?>"/>
<?php if( is_single() ) : ?>
	<meta property="og:title" content="<?php bloginfo('name'); ?> <?php wp_title(); ?>"/>
	<?php
	if( has_post_thumbnail() ) :
		$thumbnail_id = get_post_thumbnail_id();
		$image_url = wp_get_attachment_image_src( $thumbnail_id, 'large_thumbnail' );
	?>
	<meta property="og:image" content="<?php echo $image_url[0]; ?>"/>
	<?php else : ?>
	<meta property="og:image" content="<?php bloginfo('template_url'); ?>/image/hellopeople_logo_thumbnail.png"/>
	<?php endif; ?>
<?php else : ?>
	<meta property="og:title" content="<?php bloginfo('name'); ?>"/>
	<meta property="og:image" content="<?php bloginfo('template_url'); ?>/image/hellopeople_logo_thumbnail.png"/>
<?php endif; ?>
	<title><?php bloginfo('name'); ?> <?php bloginfo('description'); ?> <?php if ( is_single() ) { ?> &raquo; <?php } ?> <?php wp_title(); ?></title>
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>"></link>
<?php
	wp_deregister_script( 'jquery' );
	wp_enqueue_script( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js' );

	/*
	Ajax対応
	*/
	//リクエストに使うデータの準備
	$nonce = wp_create_nonce();

	// $is_single = is_single() ? 'true' : 'false';
	// $categoryId = is_category() ? get_query_var('cat') : '';
	// $tag = is_tag() ? get_query_var('tag_id') : '';
	// $search = is_search() ? get_query_var('s') : '';

	$is_single = 'false';
	$categoryId = '';
	$tag = '';
	$search = '';

	//スクリプトを登録する
	wp_register_script( 'ajax', get_template_directory_uri() . '/js/ajaxnative.js' );
	wp_localize_script(
		'ajax',
		'AjaxData',
		array(
			'flag' => true,
			'registered' => false,
			'nonce' => $nonce,
			'category' => $categoryId,
			'tag' => $tag,
			'search' => $search,
			'is_single' => $is_single
		)
	);
	wp_enqueue_script('ajax');
	wp_head();
?>
</head>
<body <?php body_class(); ?>>
	<section class="container">
		<div class="container-inner">
			<div class="header-outer">
				<header id="header" class="header content">
					<div class="header-logo">
						<a href="/">
							<div class="header-title">
								<h1 class="ttl ttl-lv1">
									<span>
										<?php bloginfo('name'); ?>
									</span>
									<img src="<?php bloginfo('template_url'); ?>/image/hellopeople_logo.png" alt="HELLO PEOPLE">
								</h1>
								<p><?php bloginfo('description'); ?></p>
							</div>
						</a>
					</div>
<?php if ( is_active_sidebar('widgets_1') ) : ?>
					<div class="header-nav" role="complementary">
						<?php dynamic_sidebar( 'widgets_1' ) ?>
					</div>
<?php endif; ?>
				</header>
			</div>