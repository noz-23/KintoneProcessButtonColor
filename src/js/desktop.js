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
 *     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js
 *   
 *   jsrender:
 *     https://www.jsviews.com/
 *     https://cdnjs.cloudflare.com/ajax/libs/jsrender/0.9.91/jsrender.min.js
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

(async (PLUGIN_ID_) => {
  'use strict';

  // 設定パラメータ
  const ParameterCountRow = 'paramCountRow';     // 行数
  const ParameterListRow = 'paramListRow';      // 行のデータ(JSON->テキスト)

  const EVENTS_SHOW = [
    'app.record.create.show', // 作成表示
    'app.record.edit.show',   // 編集表示
    //'app.record.index.show',  // 一覧表示
    'app.record.create.edit', // 作成表示
    'app.record.edit.edit',   // 編集表示
    //'app.record.index.edit',  // 一覧表示
    //'app.record.create.submit', // 作成表示
    //'app.record.edit.submit',   // 編集表示
    //'app.record.index.submit',  // 一覧表示
    //'app.record.detail.show', // 作成表示
  ];

  const EVENTS_DETAIL = [
    //'app.record.create.show', // 作成表示
    //'app.record.edit.show',   // 編集表示
    //'app.record.index.show',  // 一覧表示
    //'app.record.create.edit', // 作成表示
    //'app.record.edit.edit',   // 編集表示
    //'app.record.index.edit',  // 一覧表示
    //'app.record.create.submit', // 作成表示
    //'app.record.edit.submit',   // 編集表示
    //'app.record.index.submit',  // 一覧表示
    'app.record.detail.show', // 作成表示
  ];

  kintone.events.on(EVENTS_SHOW, async (events_) => {
    console.log('events_:%o', events_);
    // 現在ステータス
    var nowStatus = events_.record['ステータス'].value;

    // Kintone プラグイン 設定パラメータ
    const config = kintone.plugin.app.getConfig(PLUGIN_ID_);
    console.log('config:%o', config);

    var listRow = JSON.parse(config[ParameterListRow]);
    console.log('listRow:%o', listRow);
    var requireFeild = requireFeild = listRow[0]; // 1行目は必須フィールド
    console.log('requireFeild:%o', requireFeild);

    // ステータス情報の取得
    if (requireFeild.Checked != true) {
      // 利用しない場合は抜ける
      return events_;
    }

    // ステータス情報の取得
    const params = {
      app: kintone.app.getId()   // アプリ番号
    };
    //var status = await kintone.api(kintone.api.url('/k/v1/app/status.json', true), 'GET', params);
    //console.log('status:%o', status);

    //var feilds = await kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', params);
    //console.log('feilds:%o', feilds);

    var layout = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', params);
    console.log('layout:%o', layout);

    //var form = await kintone.api(kintone.api.url('/k/v1/form.json', true), 'GET', params);
    //console.log('form:%o', form);

    var listHtmlRow = jQuery('.row-gaia');
    console.log('listHtmlRow:%o', listHtmlRow);

    var listFeild = await getListRequireFeild(nowStatus);
    console.log('listFeild:%o', listFeild);
    for (var field of listFeild) {
      var element = getFieldElement(field, layout, listHtmlRow);
      console.log('element:%o', element);

      element.style.color = requireFeild.TextColor;
      element.style.backgroundColor = requireFeild.BackColor;
      element.style.fontSize = requireFeild.TextSize;
      element.style.textDecoration = requireFeild.TextFont;

    }

  });

  kintone.events.on(EVENTS_DETAIL, async (events_) => {
    console.log('events_:%o', events_);

    // Kintone プラグイン 設定パラメータ
    const config = kintone.plugin.app.getConfig(PLUGIN_ID_);
    console.log('config:%o', config);

    var listRow = JSON.parse(config[ParameterListRow]);
    console.log('listRow:%o', listRow);
    var requireFeild = requireFeild = listRow[0]; // 1行目は必須フィールド
    console.log('requireFeild:%o', requireFeild);

    // 現在ステータス
    var nowStatus = events_.record['ステータス'].value;
    var listButtonColor = listRow.filter(f => f.Status == nowStatus);
    console.log('nowStatus:%o', nowStatus);

    if (typeof listButtonColor == 'undefined') {
      return;
    }
    console.log('listButtonColor:%o', listButtonColor);

    // 上部のボタン書式の変更
    var listButton = jQuery('.gaia-app-statusbar-action');
    for (var button of listButton) {

      var label = jQuery(button).find('.gaia-app-statusbar-action-label');
      if (typeof label == 'undefined') {
        continue;
      }
      var labetText = label.eq(0).text();
      var find = listButtonColor.find((f) => f.Button == labetText);
      if (typeof find == 'undefined') {
        continue;
      }
      if (find.Checked != true) {
        // 利用しない場合は抜ける
        continue;
      }

      //
      button.style.color = find.TextColor;
      button.style.backgroundColor = find.BackColor;
      //button.style.fontSize = find.TextSize;
      //button.style.textDecoration = find.TextFont;
      //
      label.eq(0).css('color', find.TextColor);
      label.eq(0).css('background-color', find.BackColor);
      label.eq(0).css('font-size', find.TextSize);
      label.eq(0).css('text-decoration', find.TextFont);

    }
    // ステータス情報の取得
    if (requireFeild.Checked != true) {
      // 利用しない場合は抜ける
      return events_;
    }

    var listFeild = await getListRequireFeild(nowStatus);
    for (var feildName of listFeild) {
      var feild = kintone.app.record.getFieldElement(feildName);
      console.log('feild:%o', feild);
      //
      if (feild == null) {
        continue;
      }
      feild.style.color = requireFeild.TextColor;
      feild.style.backgroundColor = requireFeild.BackColor;
      feild.style.fontSize = requireFeild.TextSize;
      feild.style.textDecoration = requireFeild.TextFont;
    }

    return events_;
  });

  const getListRequireFeild = async (nowStatus_) => {
    const params = {
      app: kintone.app.getId()   // アプリ番号
    };
    var status = await kintone.api(kintone.api.url('/k/v1/app/status.json', true), 'GET', params);
    console.log('status:%o', status);

    var listFeild = [];
    for (var action of status.actions) {
      if (action.from != nowStatus_) {
        continue;
      }
      //console.log('action:%o', action);

      var str = action.filterCond;
      if (str.length == 0) {
        continue;
      }

      //
      var list = [];
      var splitAnd = str.split(' and ');
      list.push(...splitAnd);
      var splitOr = str.split(' or ');
      list.push(...splitOr);
      //
      for (var word of list) {
        listFeild.push(word.substring(0, word.indexOf(' ')));
      }
      listFeild = Array.from(new Set(listFeild));
    }
    console.log('listFeild:%o', listFeild);
    return listFeild;
  };

  const getFieldElement = (name_, layout_, htmlRows_) => {
    var row = 0;
    var colunm = 0;
    var flg = false;
    for (; row < layout_.layout.length; row++) {
      for (; colunm < layout_.layout[row].fields.length; colunm++) {
        if (layout_.layout[row].fields[colunm].code == name_) {
          flg = true;
          break;
        }
      }
      if (flg == true) {
        break;
      }
    }

    console.log('row[%o]/column[%o] ', row, colunm);
    console.log('htmlRows_[row][%o]', htmlRows_[row]);

    return (flg == false) ? null : htmlRows_[row].children[colunm];
  };

})(kintone.$PLUGIN_ID);
