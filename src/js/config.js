/*
 *プロセスボタンの書式変更
 * Copyright (c) 2024 noz-23
 *  https://github.com/noz-23/
 *
 * Licensed under the MIT License
 *
 *  利用：
 *   JQuery:
 *     https://jquery.com/
 *     https://js.cybozu.com/jquery/3.7.1/jquery.min.js
 *
 *   jsrender:
 *     https://www.jsviews.com/
 *     https://js.cybozu.com/jsrender/1.0.13/jsrender.min.js
 *
 *   tinyColorPicker and colors :
 *     https://github.com/PitPik/tinyColorPicker
 *     https://cdnjs.cloudflare.com/ajax/libs/tinyColorPicker/1.1.1/jqColorPicker.min.js
 *
 *  参考：
 *   New Condition Format plug-in
 *    Copyright (c) 2016 Cybozu
 *
 *    Licensed under the MIT License
 *
 * History
 *  2024/04/10 0.1.0 とりあえずバージョン
 *
 */

jQuery.noConflict();

(async (jQuery_, PLUGIN_ID_) => {
  'use strict';

  // 設定パラメータ
  // 文字色
  const ParameterTextColor = 'paramTextColor';

  // 背景色
  const ParameterBackColor = 'paramBackColor';

  // 文字の大きさ
  const ParameterTextSize = 'paramTextSize';

  // 文字装飾
  const ParameterTextFont = 'paramTextFont';

  // 環境設定
  const Parameter = {
    // 表示文字
    Lang: {
      en: {
        plugin_titile: 'Change Process Button Color Plugin',
        plugin_description: 'Change Process Button and Set Text Color ,Size, Option',
        plugin_label: 'Please Setting Text Color ,Size, Option',

        text_color_titile: 'Text Color',
        back_color_titile: 'Back Color',
        text_size_titile: 'Text Size',
        text_font_titile: 'Font Option',

        status_label: 'Status',
        button_label: 'Button',

        status_require: 'Input',
        button_require: 'Requiire',

        text_size_nomal: 'Normal',
        text_size_x_small: 'Very Small',
        text_size_small: 'Small',
        text_size_large: 'Large',
        text_size_x_large: 'Very Large',

        text_font_normal: 'Normal',
        text_font_bold: 'Bold',
        text_font_underline: 'Underline',
        text_font_line_through: 'Strikethrough',
        text_font_link: 'Link',

        plugin_cancel: 'Cancel',
        plugin_ok: ' Save ',
      },
      ja: {
        plugin_titile: 'プロセス位置の表示 プラグイン',
        plugin_description: 'プロセス位置を表示し、文字色などを設定できます',
        plugin_label: '文字色等を設定して下さい',

        text_color_titile: '文字色',
        back_color_titile: '背景色',
        text_size_titile: '文字サイズ',
        text_font_titile: '文字オプション',

        status_label: '状　態',
        button_label: 'ボタン',

        status_require: '入力必須',
        button_require: '項目フィールド',

        text_size_nomal: '変更なし',
        text_size_x_small: '小さい',
        text_size_small: 'やや小さい',
        text_size_large: 'やや大きい',
        text_size_x_large: '大きい',

        text_font_normal: '変更なし',
        text_font_bold: '太字',
        text_font_underline: '下線',
        text_font_line_through: '打ち消し線',
        text_font_link: 'リンク',

        plugin_cancel: 'キャンセル',
        plugin_ok: '   保存  ',
      },
      DefaultSetting: 'ja',
      UseLang: {}
    },
    Html: {
      Form: '#plugin_setting_form',
      Title: '#plugin_titile',
      Description: '#plugin_description',
      Label: '#plugin_label',

      TableBody: '#table_body',

      Cancel: '#plugin_cancel',
      Ok: '#plugin_ok',
    },
    Elements: {
      TextColor: '#text_color',
      BackColor: '#back_color',
      TextSize: '#text_size',
      TextFont: '#text_font',
    },
  };


  // Color Picker
  // https://github.com/PitPik/tinyColorPicker
  // from Cybozu
  const defaultColorPickerConfig = {
    opacity: false,
    doRender: false,
    buildCallback: function ($elm) {
      $elm.addClass('kintone-ui');

      const colorInstance = this.color;
      const colorPicker = this;

      console.log('colorPicker:%o', colorPicker);

      $elm.prepend(
        '<div class="cp-panel">'
        + '<div><label>R</label> <input type="number" max="255" min="0" class="cp-r" /></div>'
        + '<div><label>G</label> <input type="number" max="255" min="0" class="cp-g" /></div>'
        + '<div><label>B</label> <input type="number" max="255" min="0" class="cp-b" /></div>'
        + '<hr>'
        + '<div><label>H</label> <input type="number" max="360" min="0" class="cp-h" /></div>'
        + '<div><label>S</label> <input type="number" max="100" min="0" class="cp-s" /></div>'
        + '<div><label>V</label> <input type="number" max="100" min="0" class="cp-v" /></div>'
        + '</div>').on('change', 'input', function (e) {
          const value = this.value,
            className = this.className,
            type = className.split('-')[1],
            color = {};

          color[type] = value;
          colorInstance.setColor(type === 'HEX' ? value : color,
            type === 'HEX' ? 'HEX' : /(?:r|g|b)/.test(type) ? 'rgb' : 'hsv');
          colorPicker.render();
        });

      const buttons = $elm.append(
        '<div class="cp-disp">'
        + '<button type="button" id="cp-cancel">Cancel</button>'
        + '<button type="button" id="cp-submit">OK</button>'
        + '</div>');

      buttons.on('click', '#cp-submit', (e) => {
        const colorCode = '#' + colorPicker.color.colors.HEX;

        console.log('colorPicker cp-submit:%o', colorPicker);

        $elm.css('border-bottom-color', colorCode);
        $elm.attr('value', colorCode);

        // ここで値の受け渡し
        const $el = colorPicker.$trigger.parent('div').find('input[type="text"]');
        $el.val(colorCode);

        // ここで値の受け渡しのテキスト変更
        if ($el.hasClass('text_color_end')) {
          $el.css('color', colorCode);
        }
        if ($el.hasClass('text_color_now')) {
          $el.css('color', colorCode);
        }
        if ($el.hasClass('text_color_yet')) {
          $el.css('color', colorCode);
        }
        //
        if ($el.hasClass('back_color_end')) {
          $el.css('background-color', colorCode);
        }
        if ($el.hasClass('back_color_now')) {
          $el.css('background-color', colorCode);
        }
        if ($el.hasClass('back_color_yet')) {
          $el.css('background-color', colorCode);
        }
        // 

        colorPicker.$trigger.css('border-bottom-color', colorCode);
        colorPicker.toggle(false);
      });

      buttons.on('click', '#cp-cancel', (e) => {
        colorPicker.toggle(false);
      });
    },
    renderCallback: function ($elm, toggled) {
      const colors = this.color.colors.RND;
      const colorCode = '#' + this.color.colors.HEX;

      const modes = {
        r: colors.rgb.r,
        g: colors.rgb.g,
        b: colors.rgb.b,
        h: colors.hsv.h,
        s: colors.hsv.s,
        v: colors.hsv.v,
        HEX: colorCode
      };

      jQuery('input', '.cp-panel').each(function () {
        this.value = modes[this.className.substr(3)];
      });

      this.$trigger = $elm;
    },
    positionCallback: function ($elm) {
      this.color.setColor($elm.attr('value'));
    }
  };
  //

  /*
  HTMLタグの削除
   引数　：htmlstr タグ(<>)を含んだ文字列
   戻り値：タグを含まない文字列
  */
  const escapeHtml = (htmlstr) => {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&quot;').replace(/'/g, '&#39;');
  };

  /*
  ユーザーの言語設定の読み込み
   引数　：なし
   戻り値：なし
  */
  const settingLang = () => {
    // 言語設定の取得
    Parameter.Lang.UseLang = kintone.getLoginUser().language;
    switch (Parameter.Lang.UseLang) {
      case 'en':
      case 'ja':
        break;
      default:
        Parameter.Lang.UseLang = Parameter.Lang.DefaultSetting;
        break;
    }
    // 言語表示の変更
    var html = jQuery(Parameter.Html.Form).html();
    var tmpl = jQuery.templates(html);

    var useLanguage = Parameter.Lang[Parameter.Lang.UseLang];
    // 置き換え
    jQuery(Parameter.Html.Form).html(tmpl.render({ lang: useLanguage })).show();
  };

  /*
  フィールド設定
   引数　：なし
   戻り値：なし
  */
  const settingHtml = async () => {
    const params = {
      app: kintone.app.getId()   // アプリ番号
    };
    var status = await kintone.api(kintone.api.url('/k/v1/app/status.json', true), 'GET', params);
    console.log('status:%o', status);

    if (status.enable == false) {
      // 無効の場合は何もせず終了
      return events_;
    }
    // ステータス名がキーになっているので、一覧化
    var listKey = Object.keys(status.states);
    //console.log('listKey:%o', listKey);

    var listStatus = [];
    for (var name of listKey) {
      listStatus.push({ ...status.states[name], buttons: [] });
    };

    for (var action of status.actions) {
      var status = listStatus.find((s) => s.name == action.from);
      if (typeof status == 'undefined') {
        continue;
      }
      status.buttons.push(action);
    }
    //console.log('listStatus:%o', listStatus);

    // index順にソート(並び替え)
    var listSortStatus = listStatus.sort((a, b) => { return (a.index < b.index) ? -1 : 1 });
    console.log('listSortStatus:%o', listSortStatus);

    var table = jQuery(Parameter.Html.TableBody);
    for (var status of listSortStatus) {
      var flg =false;
      for (var button of status.buttons) {
        var cloneTr = jQuery(Parameter.Html.TableBody + ' > tr').eq(0).clone(true);
        cloneTr.find('.status_title').eq(0).html(status.name);
        if(flg ==false){
          cloneTr.find('td').eq(0).prop('rowspan', status.buttons.length);
        }else{
          cloneTr.find('td').eq(0).hide();;
        }
        //var listStatus =cloneTr.find('.status_title');
        //console.log('listStatus:%o', listStatus);
        //var statusTr =listStatus.eq(0)
        //statusTr.innerHTML =status.name;
        //statusTr.innerTEXT =status.name;
        //console.log('statusTr:%o', statusTr);

        cloneTr.find('.button_title').eq(0).html(button.name);
        //var listButton =cloneTr.find('.button_title');
        //console.log('listButton:%o', listButton);
        //var buttonTr =listButton.eq(0);
        //buttonTr.innerHTML =button.name;
        //buttonTr.innerTEXT =button.name;
        //console.log('buttonTr:%o', buttonTr);

        console.log('cloneTr:%o', cloneTr);
        table.append(cloneTr);
        flg =true;
      }
    }

    // 現在データの呼び出し
    var nowConfig = kintone.plugin.app.getConfig(PLUGIN_ID_);
    console.log('nowConfig:%o', nowConfig);

    // 現在データの表示
  };

  /*
  データの保存
   引数　：なし
   戻り値：なし
  */
  const saveSetting = () => {
    // 各パラメータの保存
    var config = {};

    console.log('config:%o', config);

    // 設定の保存
    kintone.plugin.app.setConfig(config);
  };

  function ChangeTextColor() {
    const $el = jQuery(this);

    $el.css('color', jQuery(this).val());
    $el.parent('div').find('i').css('border-bottom-color', jQuery(this).val());

    return true;
  }

  function ChangeBackColor() {
    const $el = jQuery(this);

    $el.css('background-color', jQuery(this).val());
    $el.parent('div').find('i').css('border-bottom-color', jQuery(this).val());

    return true;
  }

  function ChangeText(evet_) {
    const $el = jQuery(this);
    $el.attr('maxLength', '50');
    setTimeout(() => {
      const val = $el.val();
      $el.attr('maxLength', '7');
      $el.val(val.replace(/\s/g, ''));
      $el.trigger('change');
    });
  }

  // 言語設定
  settingLang();
  await settingHtml();

  // 保存
  jQuery(Parameter.Html.Ok).click(() => { saveSetting(); });
  // キャンセル
  jQuery(Parameter.Html.Cancel).click(() => { history.back(); });

  // ｢color-paint-brush｣class にcolorPicker割り当て
  // colorPicker が JQuery v3 に対応してない(context利用してる)
  const $colorPicker = jQuery('.color-paint-brush').colorPicker(defaultColorPickerConfig);

  jQuery(document).keyup((event) => {
    const TAB_KEY_CODE = 9;
    const ENTER_KEY_CODE = 13;
    const ESC_KEY_CODE = 27;
    if (event.keyCode === TAB_KEY_CODE || event.keyCode === ENTER_KEY_CODE || event.keyCode === ESC_KEY_CODE) {
      $colorPicker.colorPicker.toggle(false);
    }
  });

})(jQuery, kintone.$PLUGIN_ID);
