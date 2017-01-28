var timer=setInterval(updateTimes,1000);
var allIds=[];
$(function(){
// $(document).on('click','.delete', deleteTodo);
$(document).on('click','.check', toggleTodo);
getTodo();
$('#taskInput').on('submit',sendTodo);
$(document).on('click','.delete', function(){
  var id=$(this).closest('.todoitem').data('id');
  toggleQuestion(id);
});

 $(document).on('click','.task', function(){
  var hider=$(this).parent().find('.hider');
  if(hider.hasClass('up')){
    hider.slideDown();
    hider.toggleClass('up');
  }else{
    hider.slideUp();
    hider.toggleClass('up');
  }
 });

$(document).on('click','#dateButton',submitDate);

$('#yes').on('click', deleteTodo);
$('#no').on('click', toggleQuestion);

$('.overlay').on('click', toggleQuestion);
});

function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}



function updateTimes(){
  allIds.forEach(function(id){
 var timeObject=getTimeRemaining($('#datepick.'+id).val())
 if(!timeObject.days){timeObject.days=0;timeObject.hours=0;timeObject.minutes=0;timeObject.seconds=0};
$('span.time#'+id).text(timeObject.days+':'+timeObject.hours+':'+timeObject.minutes+':'+timeObject.seconds)



    $('span.time#'+id).text();
  });

}
function submitDate(event){
  event.preventDefault();
var dateObject={};
  var id=$(this).data('id');
  dateObject.date = $(this).parent().find('#datepick').val();
  console.log(dateObject);
  $.ajax({
    url: '/dateupdate/'+id,
    type: 'PUT',
    data:dateObject,
    success: getTodo
  });
}
function toggleQuestion(id){
  if(id!=null){
  $('#yes').data('id',id);
  }
  $('.question').toggleClass('visible');
  $('.overlay').toggleClass('visible');

}

function getTodo(){

  $.ajax({
    url: '/router',
    type: 'GET',
    success: showTodo
  });
}
function showTodo(list){
    $('#tasks').empty();
    var classer='';
    var date='';
  list.forEach(function(item){

    if(item.complete==1){
      classer='checked';
    }else{
      classer='unchecked';
    }
    if(item.date!=null){
      var dateString=item.date.toString().slice(0,10);
      console.log(dateString);
    }
    allIds.push(item.id);
    var $stuff=$(
                  '<div class="col-xs-12 todoitem '+classer+'" data-check="'+item.complete+'" data-id="'+item.id+'">'+
                    '<button class="check"><span class="glyphicon glyphicon-ok-circle"></span></button>'+
                    '<span class="task" ondblclick="dblclick()">'+item.task+'</span>'+
                    '<button class="delete"><span class="glyphicon glyphicon-ban-circle"></span></button>'+
                    '<form class="hider up date" name="date" >Due on:<input name="datepick" id="datepick" class="'+item.id+'" value="'+dateString+'"type="date"/>'+
                    '<button type="submit" class="btn btn-submit" id="dateButton" data-id="'+item.id+'">submit date</button><span id="'+item.id+'" class="time"></span></form>'+
                  '</div>'

                );

    $('#tasks').append($stuff);
  });
}
function dblclick(){
  console.log('double');
}
function sendTodo(event){
  event.preventDefault();

  var data=$(this).serialize();
  $.ajax({
    url: '/router',
    type: 'POST',
    data: data,
    success: getTodo
  });
  $(this).find('input').val('');
}

function deleteTodo(){
  var id=$(this).data('id');
  console.log(id);
  $('.question').toggleClass('visible');
  $('.overlay').toggleClass('visible');
  $.ajax({
    url: '/router/'+id,
    type: 'DELETE',
    success: getTodo
  });
}
function toggleTodo(){
  var id=$(this).closest('.todoitem').data('id');
  var check=$(this).closest('.todoitem').data('check');
  $(this).closest('.todoitem').toggleClass('checked');
  var send={};
console.log(check);
  if(check==0){
    $(this).closest('.todoitem').data('check',1);
    send.complete=1;
  }else{
    $(this).closest('.todoitem').data('check',0);
    send.complete=0;
  }
  $.ajax({
    url: '/router/'+id,
    type: 'PUT',
    data:send,
    success: getTodo
  });
}
