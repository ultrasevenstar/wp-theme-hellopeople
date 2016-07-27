<?php
     //カスタムヘッダー
     add_theme_support( 'custom-header' );

     define('NO_HEADER_TEXT',true);
     define('HEADER_TEXTCOLOR','');
     define('HEADER_IMAGE','%s/images/top/main_image.png');
     define('HEADER_IMAGE_WIDTH',950);
     define('HEADER_IMAGE_HEIGHT',295);

     //カスタムメニュー
     register_nav_menus (
           array(
                   'place_global' => 'グローバル',
                   'place_utility' => 'ユーティリティ',

           )
     );

     //アイキャッチ画像を利用できるようにします。
     add_theme_support('post-thumbnails');

     //アイキャッチ画像サイズ指定
     set_post_thumbnail_size(1000, 400, true);

     //サイドバー用画像サイズ設定
     add_image_size('small_thumbnail', 400, 160, true);

     //アーカイブ用画像サイズ設定
     add_image_size('large_thumbnail', 1000, 400, true);

     /**
     * Register our sidebars and widgetized areas.
     *
     */
    function arphabet_widgets_init() {

        register_sidebar( array(
            'name' => 'widgets sidebar',
            'id' => 'widgets_1',
            'before_widget' => '<nav>',
            'after_widget' => '</nav>',
            'before_title' => '<div class="title-outer"><h2>',
            'after_title' => '</h2></div>',
        ) );
    }
    add_action( 'widgets_init', 'arphabet_widgets_init' );
?>
