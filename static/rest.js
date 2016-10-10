// let lastMsgTime;

function postMsg (text) {
  $.post('/messages', {content: text}, function (data) {
    appendMsgs([JSON.parse(data)]);
  });
}

//  function receives array to add messages to index.html
function appendMsgs (msgsArr) {
  if (msgsArr.length) {
    let last = msgsArr.length - 1;
    lastMsgTime = msgsArr[last].timestamp;
    for (let i = 0; i <= last; i++) {
      let msg = msgsArr[i];
      let timeStr = new Date(msg.timestamp).toLocaleTimeString();
      let $div = $('<div class="message">');
      $('#messages').append(`
        <div class="message">
          <div class="time">Time: ${timeStr}</div>
          <p>${msg.content}</p>
        </div>
      `);
      keepScrolled('#messages');
    }
  }
}

function getLatestMessages () {
  let url = '/messages';
  $.get(url, appendMsgs);
  keepScrolled('#messages')
}

// keep the scroll at the bottom of the element
function keepScrolled(elementId) {
  $(elementId).animate({ scrollTop: $(elementId)[0].scrollHeight}, 100);
}

$(function () {
  $('#messages').val();  //  clear before adding messages from memory
  //  retrieve the last ten messages
  getLatestMessages();

  //  add a new message
  $('button').click(function () {
    let text = $('input').val();
    text && postMsg(text);
  });

  // poll server for new messages
  // setInterval(function () {
  //   getLatestMessages();
  //   keepScrolled('#messages')
  // }, 5000);
});
