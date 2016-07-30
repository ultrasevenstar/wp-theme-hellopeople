<?php get_header(); ?>
	<div class="main-outer">
		<div class="page-single jsc-pagelink">
			<main id="contents" class="main">
				<section class="content">
<?php wp_reset_query(); ?>
<?php if(have_posts()) : while(have_posts()) : the_post(); ?>
					<div class="page-info ttl-border">
						<dl class="list list-notitle ttl ttl-lv4">
							<dt>Date</dt>
							<dd><time datetime="<?php the_time('Y-m-d') ?>"><?php the_time( get_option('date_format') ); ?></time></dd>
							<dt>Category</dt>
							<dd><?php the_category(); ?></dd>
<?php
$post_tags = get_the_tags();
if( $post_tags ) :
?>
							<dt>Tag</dt>
							<dd>
								<ul class="list list-horizon">
<?php foreach( $post_tags as $tag ) : ?>
									<li><?php echo $tag->name; ?></li>
<?php endforeach; ?>
								</ul>
							</dd>
<?php endif; ?>
							<dt>Author</dt>
							<dd><?php the_author(); ?></dd>
						</dl>
					</div>
					<div class="page-info">
						<h1 class="ttl ttl-lv1"><?php the_title(); ?></h1>
					</div>
					<div class="main-content">
<?php if(has_post_thumbnail()) : ?>
						<div class="main-eyecatch">
							<?php the_post_thumbnail('large_thumbnail',
								array(
									'alt' => the_title_attribute('echo=0'),
									'title' => the_title_attribute('echo=0')
								)
							);?>
						</div>
<?php endif; ?>
						<section class="content">
<?php the_content(); ?>
						</section>
					</div>
<?php endwhile; endif; ?>
				</section>
			</main>
			<div class="sub">
<?php
$currentPostId = get_the_ID();
$this_cat = get_the_category();
$this_cat = $this_cat[0];
$myposts = get_posts("category=".$this_cat->cat_ID."&orderby=desc&numberposts=3&exclude=".$currentPostId);
?>
				<section class="content">
					<div class="sub-header">
						<h2 class="ttl ttl-lv2">こちらの記事もチェック！</h2>
					</div>
					<div class="sub-content">
						<ul class="sub-list">
<?php foreach($myposts as $post) : ?>
							<li>
								<article>
									<a class="sub-listitem cf" href="<?php the_permalink(); ?>">
										<div class="sub-listitem-left">
<?php
if(has_post_thumbnail()) :
	the_post_thumbnail('large_thumbnail',
		array(
			'alt' => the_title_attribute('echo=0'),
			'title' => the_title_attribute('echo=0')
		)
	);
else : ?>
											<img src="<?php bloginfo('template_url') ?>/image/hellopeople_logo_default.png" alt="thumbnail is no image.">
<?php endif; ?>
										</div> <div class="sub-listitem-right content-min"> <?php
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
										<div>
											<h3 class="ttl ttl-lv3">
												<?php the_title(); ?>
											</h3>
											<p class="txt-small">
											<?php echo mb_substr(strip_tags($post-> post_content), 0, 100).'...' ?>
											</p>
										</div>
									</div>
								</a>
							</article>
						</li>
<?php endforeach; ?>
						</ul>
					</div>
				</section>
			</div>
			<div class="pagetop">
				<a href="#" class="jsc-pagelink-top">
					<img src="<?php bloginfo('template_url'); ?>/image/icon_pagetop.png" alt="ページ上部に戻る" width="44" height="44" srcset="<?php bloginfo('template_url'); ?>/image/icon_pagetop@2x.png">
				</a>
			</div>
		</div>
	</div>
</div>
<?php get_footer(); ?>