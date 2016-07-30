<?php get_header(); ?>
<?php wp_reset_query(); ?>
	<div class="main-outer">
		<main class="main">
			<div class="jsc-pagelink jsc-infinitescroll content">
<?php
	if( is_category() ) :
		$cat = get_the_category(); //現在の記事のカテゴリー情報を取得
		$cat = $cat[0];
?>
				<div class="ttl-border">
					<h2 class="ttl ttl-lv2"><?php echo $cat->name; ?></h2>
				</div>
<?php endif; ?>
				<div class="post-container jsc-ajax-posts jss-gridlayout jsc-gridlayout cf">
					<!-- POSTS AREA -->
				</div>
				<div class="loader jsc-infinitescroll-loader-wrap">
					<img class="jsc-infinitescroll-loader" src="<?php bloginfo('template_url'); ?>/image/loader.gif" alt="loading..." width="40" height="40">
				</div>
				<div class="completemessage">
					<p>すべての記事を表示しました。</p>
				</div>
				<div class="pagetop-wrap">
					<a href="#" class="pagetop jsc-pagelink-top">
						<img src="<?php bloginfo('template_url'); ?>/image/icon_top2.png" alt="ページ上部に戻る" width="60">
					</a>
				</div>
			</div>
		</main>
	</div>
</div>
<?php get_footer(); ?>
