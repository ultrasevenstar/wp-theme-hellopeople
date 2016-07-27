<?php get_header(); ?>
<?php wp_reset_query(); ?>
	<div class="main-outer">
		<main class="main">
			<div class="jsc-pagelink content">
<?php
	if( is_category() ) :
		$cat = get_the_category(); //現在の記事のカテゴリー情報を取得
		$cat = $cat[0];
?>
				<div class="ttl-border">
					<h2 class="ttl ttl-lv2"><?php echo $cat->name; ?></h2>
				</div>
<?php endif; ?>
				<div class="post-container jss-gridlayout jsc-gridlayout cf">
<?php
if( have_posts() ) : while( have_posts() ) : the_post();
?>
					<article class="post">
	<?php if (has_post_thumbnail()) : ?>
						<div class="post-image">
							<?php the_post_thumbnail('medium',
                        		array(
                        			'alt' => the_title_attribute('echo=0'),
                        			'title' => the_title_attribute('echo=0')
                        		)
                        	);?>
						</div>
	<?php
		else :
	?>
						<div class="post-noimage"></div>
	<?php endif; ?>
						<div class="post-content">
							<div class="post-content-inner">
								<div class="post-content-title">
									<a href="<?php the_permalink(); ?>">
										<h2 class="ttl ttl-lv3"><?php the_title(); ?></h2>
									</a>
								</div>
								<div class="post-content-body">
									<p class="txt-small">
										<?php echo mb_substr(strip_tags($post-> post_content), 0, 100).'...' ?>
									</p>
								</div>
<?php
$post_tags = get_the_tags();
if( $post_tags ) :
?>
								<div>
									<ul class="taglist">
<?php foreach( $post_tags as $tag ) : ?>
										<li><?php echo $tag->name; ?></li>
<?php endforeach; ?>
									</ul>
								</div>
<?php endif; ?>
								<div class="post-content-menu">
									<a href="<?php the_permalink(); ?>" class="txt-readmore">もっと見る</a>
								</div>
							</div>
						</div>
					</article>
<?php endwhile; ?>
<?php endif; ?>
				</div>
				<div class="pagetop">
					<a href="#" class="jsc-pagelink-top">
						<img src="<?php bloginfo('template_url'); ?>/image/icon_top2.png" alt="ページ上部に戻る" width="60">
					</a>
				</div>
			</div>
		</main>
	</div>
</div>
<?php get_footer(); ?>
