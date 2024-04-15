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

  const EVENTS = [
    'app.record.create.show', // 作成表示
    'app.record.edit.show',   // 編集表示
    'app.record.index.show',  // 一覧表示
    'app.record.create.edit', // 作成表示
    'app.record.edit.edit',   // 編集表示
    'app.record.index.edit',  // 一覧表示
    'app.record.create.submit', // 作成表示
    'app.record.edit.submit',   // 編集表示
    'app.record.index.submit',  // 一覧表示
    'app.record.detail.show', // 作成表示
  ];
  kintone.events.on(EVENTS, async (events_) => {
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
      //
      button.style.color = find.TextColor;
      button.style.backgroundColor = find.BackColor;
      button.style.fontSize = find.TextSize;
      button.style.textDecoration = find.TextFont;

    }

    // ステータス情報の取得
    const params = {
      app: kintone.app.getId()   // アプリ番号
    };
    var status = await kintone.api(kintone.api.url('/k/v1/app/status.json', true), 'GET', params);
    console.log('status:%o', status);

    var listFeild = [];
    for (var action of status.actions) {
      if (action.from != nowStatus) {
        continue;
      }
      //console.log('action:%o', action);

      var str = action.filterCond;
      if (str.length ==0) {
        continue;
      }
      //console.log('str:%o', str);

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

    for (var feildName of listFeild) {
      var feild = kintone.app.record.getFieldElement(feildName);
      console.log('feild:%o', feild);
      //
      if(feild ==null){
        continue;
      }
      feild.style.color = requireFeild.TextColor;
      feild.style.backgroundColor = requireFeild.BackColor;
      feild.style.fontSize = requireFeild.TextSize;
      feild.style.textDecoration = requireFeild.TextFont;
    }

    return events_;
  });
})(kintone.$PLUGIN_ID);
