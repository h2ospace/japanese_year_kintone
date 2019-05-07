"use strict";

(function($) {
    function get_jyear(year) {
        // 和暦の計算
        var j;
        if (year > 2018) {
            j = '令和' + (year-2018);
        } else if (year > 1988) {
            j = '平成' + (year-1988);
        } else if (year > 1925) {
            j = '昭和' + (year-1925);
        } else if (year > 1911) {
            j = '大正' + (year-1911);
        } else if (year > 1867) {
            j = '明治' + (year-1867);
        }

        return j;
    }

    // 日付を変更する
    var events = [
        'app.record.create.show',
        'app.record.edit.show',
    ]
    kintone.events.on(events, function(event) {
        var record = event.record;

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        // ゼロを足す
        function addZero(val) {
            return (val >= 10 ? val : '0' + val);
        }

        // 年を作る
        var html = '<div class="japan_year_select"><select name="year">';
        for (var y=year-100; y<=year+100; y++) {
            var j = get_jyear(y);
            html += '<option value="' + y + '"' + (y==year ? ' selected' : '') + '>' + y + '（' + j + '）' + '</option>' + '年';
        }
        html += '</select>年 ';

        // 月
        html += '<select name="month">';
        for (var m=1; m<=31; m++) {
            html += '<option value="' + addZero(m) + '"' + (m==month ? ' selected' : '') + '>' + m + '</option>';
        }
        html += '</select>月 '

        // 日
        html += '<select name="day">';
        for (var d=1; d<=31; d++) {
            html += '<option value="' + addZero(d) + '"' + (d==day ? ' selected' : '') + '>' + d + '</option>';
        }
        html += '</select>日 ';

        // コピー
        html += '<input type="text" id="japan_year_copy_base" style="display: none">';
        html += '<button type="button" id="btn-copy-jdate"><i class="fa fa-clipboard" aria-hidden="true"></i> コピー</button>';
        html += '</div>';

        jQuery('.gaia-argoui-app-edit-buttons').append(html);

        // 日付を反映
        $('select[name=year], select[name=month], select[name=day]').on('change', function() {
            $('#japan_year_copy_base').val(
                $('select[name=year]').val() + '-' +
                $('select[name=month]').val() + '-' +
                $('select[name=day]').val()
            );
        });
        $('#japan_year_copy_base').val(
            $('select[name=year]').val() + '-' +
            $('select[name=month]').val() + '-' +
            $('select[name=day]').val()
        );

        // 日付をコピー
        $('#btn-copy-jdate').on('click', function() {
            $('#japan_year_copy_base').show().select();
            document.execCommand('copy');
            $('#japan_year_copy_base').hide();
        });

        return event;
    });

    /**
     * 詳細ページで西暦を和暦に変換する
     */
        // 日付を変更する
    events = [
            'app.record.detail.show',
        ]
    kintone.events.on(events, function(event) {
        var record = event.record;

        for (var r in record) {
            // 日付・日時の場合は変換
            if (record[r]['type'] == 'DATE' || record[r]['type'] == 'DATETIME') {
                if (record[r]['value'] != '') {
                    // 和暦に変換
                    var y = record[r]['value'].substr(0, 4);
                    var j = get_jyear(y);

                    console.log(record);

                    $('span:contains(' + record[r]['value'] + ')').parent('div').append('<span style="font-size: 80%">（' + j + '）</span>');
                }
            }
        }
        kintone.app.record.set(record);

        return event;
    });
})(jQuery);
