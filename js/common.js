$(function(){
//    document.cookie = 'data' + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
//
//    var dataTest = {
//        fleet1: {stert:'',time:''},
//        fleet2: {stert:'',time:''},
//        fleet3: {stert:'',time:''}
//    };
//    var key = JSON.stringify(dataTest);
//    document.cookie = 'data= '+key; 
//    var cookie = document.cookie.split('=');
//    var test = JSON.parse(cookie[1]);
    
    var data = {
        fleet2: {stert:'',end:'',hours:'',minutes:'',number:'',flag:0},
        fleet3: {stert:'',end:'',hours:'',minutes:'',number:'',flag:0},
        fleet4: {stert:'',end:'',hours:'',minutes:'',number:'',flag:0}
    };
    
    var timer = {};
    
    $('#fleet2_submit,#fleet3_submit,#fleet4_submit').on('click',function(){
        var targetName = ($(this).attr('id')).replace( '_submit' , '' );
        var target = $('#'+targetName);
        
        if (data[targetName]['flag'] === 0){
            //日付データを作成して配列に突っ込む
            var endDate = (new Date() + ('')).split(' ');
            endDate[4] = endDate[4].split(':');
            data[targetName]['number'] = (target.find('.fleet_inputNo')).val()/1;
            data[targetName]['hours'] = (target.find('.fleet_inputHours')).val()/1;
            data[targetName]['minutes'] = (target.find('.fleet_inputMinutes')).val()/1;
            data[targetName]['stert'] = new Date();
            data[targetName]['end'] = new Date(
                    endDate[1] +endDate[2]+','+endDate[3]+' '+
                    (endDate[4][0]/1 + data[targetName]['hours'])+':'+
                    (endDate[4][1]/1 + data[targetName]['minutes'])+':'+
                    endDate[4][2]);

            //クッキーをセーブ
            
            //カウントダウン表示
            countDown(targetName);
            
            timer[targetName]=setInterval(function(){
                countDown(targetName);
            },1000);
            data[targetName]['flag'] = 1;
            
            //表示の切替
            target.removeClass().addClass('fleet-count');
        } else if (data[targetName]['flag'] === 1){
            
            //flag1,カウント中の停止処理
            $('#messageBox').removeClass().addClass('messageBox');
            target.find('input').val('');
            target.removeClass().addClass('fleet');
            
            //停止された段階で一時的に表示切替、3秒後に実際の停止処理
            data[targetName]['clear'] = setTimeout(function(){
                clearInterval(timer[targetName]);
                $('#messageBox').removeClass().addClass('messageBox-off');
                target.find('.fleet_outputSecond').text(0);
                data[targetName]['flag'] = 0;
            },3000);
            
            //undoを押された場合は停止処理をキャンセルする
            $('#messageBox_undo').on('click',function(){
                clearTimeout(data[targetName]['clear']);
                $('#messageBox').removeClass().addClass('messageBox-off');
                target.removeClass().addClass('fleet-count');
            });
            
        } else if (data[targetName]['flag'] === 2){
            //flag2,完了後の処理
            target.find('.fleet_outputSecond').text(0);
            target.find('input').val('');
            target.removeClass().addClass('fleet');
            data[targetName]['flag'] = 0;
        };
        
    });
    
    function countDown(targetName) {
        var sec = $('#'+ targetName).find('.fleet_outputSecond').text()/1;
        if (sec === 0){
            var left = data[targetName]['end'] - new Date();
            var a_day = 24 * 60 * 60 * 1000;
            var d = Math.floor(left / a_day);
            var h = (Math.floor((left % a_day) / (60 * 60 * 1000))) + d*24;
            var m = Math.floor((left % a_day) / (60 * 1000)) % 60;
            var s = Math.floor((left % a_day) / 1000) % 60 % 60;
            $('#'+ targetName).find('.fleet_outputHours').text(h);
            $('#'+ targetName).find('.fleet_outputMinutes').text(m);
            $('#'+ targetName).find('.fleet_outputSecond').text(s);
            
            if(s <= 0){
                clearInterval(timer[targetName]);
                $('#'+ targetName).find('.fleet_outputHours').text(0);
                $('#'+ targetName).find('.fleet_outputMinutes').text(0);
                $('#'+ targetName).find('.fleet_outputSecond').text(0);
                $('#'+targetName).removeClass().addClass('fleet-clear');
                data[targetName]['flag'] = 2;
            };
            
        } else {
            $('#'+ targetName).find('.fleet_outputSecond').text(sec - 1);
        };
    };
    
    
    
});