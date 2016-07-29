		<div class="footer-outer">
			<footer class="footer">
				<!--
				<div>
					<ul class="list list-horizon">
						<li><a href="#">HOME</a></li>
						<li><a href="#">ABOUT ME</a></li>
						<li><a href="#">CONTACT</a></li>
					</ul>
				</div>
				-->
				<div class="footer-content">
					<div class="footer-content-left">
						<div class="footer-twitter">
							<a class="twitter-timeline" href="https://twitter.com/Web_GoGo" data-widget-id="507893140179542016">@Web_GoGoさんのツイート</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
						</div>
					</div>
					<div class="footer-content-right">
						<section>
							<div class="ttl-outer">
								<h3 class="ttl ttl-lv3">こんな人が書いてます！</h3>
							</div>
							<div class="footer-profile">
								<div class="footer-profile-image">
									<img src="<?php bloginfo('template_url'); ?>/image/profile.png" alt="Masaki Ohsumi Profile">
								</div>
								<div class="footer-profile-text">
									<p>
									熊本デザイン学校グラフィックデザイン科卒業後、熊本のソフトウェア開発会社に4年間勤めプログラミングを学びました。
									2013年に上京し、現在は渋谷にあるWeb制作会社でフロントエンドエンジニアとして日々勉強中です。
									<a href="http://html5exam.jp/" target="_blank">LPI-Japan</a>が主催するHTML5プロフェッショナル認定資格取得。
									</p>
								</div>
							</div>
						</section>
					</div>
				</div>
				<div class="footer-copyright">
					<small>© 2015 Masaki Ohsumi.</small>
				</div>
			</footer>
		</div>
	</section>
	<script src="<?php bloginfo('template_url'); ?>/js/gridlayout-min.js"></script>
	<script src="<?php bloginfo('template_url'); ?>/js/common.js"></script>
<?php
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
	wp_footer();
?>
</body>
</html>