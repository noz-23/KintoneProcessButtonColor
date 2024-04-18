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

    var layout = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', params);
    console.log('layout:%o', layout);

    var listHtmlRow = jQuery('.row-gaia');
    console.log('listHtmlRow:%o', listHtmlRow);

    var listFeild = await getListRequireFeild(nowStatus);
    console.log('listFeild:%o', listFeild);
    for (var field of listFeild) {
      var element = getFieldElement(field, layout, listHtmlRow);
      console.log('element:%o', element);
      if( element ==null){
        continue;
      }

      element.style.color = requireFeild.TextColor;
      element.style.backgroundColor = requireFeild.BackColor;
      element.style.fontSize = requireFeild.TextSize;
      element.style.textDecoration = requireFeild.TextFont;

      var list =jQuery(element).find('div');
      for(var e of list){
        e.style.color = requireFeild.TextColor;
        e.style.backgroundColor = requireFeild.BackColor;
        e.style.fontSize = requireFeild.TextSize;
        e.style.textDecoration = requireFeild.TextFont;
      }
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

  /*
  プロセスボタン押下に必要なフィールド名リスト取得
   引数　：nowStatus_:今のステータス
   戻り値：フィールド名リスト取得
  */
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
    //console.log('listFeild:%o', listFeild);
    return listFeild;
  };

  /*
  編集表示のフィールド検索
   引数　：name_: フィールドコード, layout_:レイアウトデータ, htmlRows_ :htmlのROW(.row-gaia)リスト
   戻り値：htmlエレメント
  */
   const getFieldElement = (name_, layout_, htmlRows_) => {
    var row = 0;
    var colunm = 0;
    var groupRow = 0;
    var groupColunm = 0;

    var flgFind = false;
    var flgGroup = false;
    // レイアウトから行列の一取得
    for (; row < layout_.layout.length; row++) {
      if(layout_.layout[row].type=='ROW'){
        // フィールド
        for (; colunm < layout_.layout[row].fields.length; colunm++) {
          if (layout_.layout[row].fields[colunm].code == name_) {
            flgFind = true;
            break;
          }
        }  
      }else if( layout_.layout[row].type=='GROUP'){
        // グループ
        var group =layout_.layout[row].layout;
        console.log('group:%o ',group,);

        for (; groupRow < group.length; groupRow++) {
          for (; groupColunm < group[groupRow].fields.length; groupColunm++) {
            if (group[groupRow].fields[groupColunm].code == name_) {
              flgFind = true;
              flgGroup =true;
              console.log('groupRow[%o]/groupColunm[%o] ', groupRow, groupColunm);
              break;
            }
          }
          groupColunm =0;
          if (flgFind == true) {
            break;
          }    
        }  
      }
      if (flgFind == true) {
        break;
      }
    }

    console.log('row[%o]/column[%o] ', row, colunm);
    //console.log('htmlRows_[row][%o]', htmlRows_[row]);

    if( flgFind == false){
      // 見つからない場合
      return null;
    }else if( flgGroup ==false){
      // 普通のフィールド
      return htmlRows_[row].children[colunm];
    }else{
      // グループの中の場合
      console.log('htmlRows_:%o', htmlRows_[row]);

      var listTableRow = jQuery(htmlRows_[row]).find('.row-gaia');
      console.log('listTableRow:%o',listTableRow );
      return listTableRow[groupRow].children[groupColunm];
    }
  };

})(kintone.$PLUGIN_ID);
