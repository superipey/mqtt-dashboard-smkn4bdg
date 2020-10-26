var table;
$(function () {
  table = $(".table-log").DataTable({
    deferRender: true,
    serverSide: true,
    processing: true,
    orderMulti: true,
    ajax: {
      url: data_url,
      type: 'GET'
    },
    columns: [
      {data: "device_id"},
      {data: "data_1"},
      {data: "data_2"},
      {data: "data_3"},
      {data: "data_4"},
      {data: "lat"},
      {data: "lng"},
      {data: "createdAt"},
    ],
    columnDefs: [{
      targets: 7, render: function (data) {
        return moment(data).format('D MMMM YYYY HH:mm:ss');
      }
    }]
  });

  $(".btn-action-on").click((e) => {
    var el = e.currentTarget;
    $(el).prop('disabled', true);
    $(el).parent().find('.btn-action-off').prop('disabled', false);
  });

  $(".btn-action-off").click((e) => {
    var el = e.currentTarget;
    $(el).prop('disabled', true);
    $(el).parent().find('.btn-action-on').prop('disabled', false);
  });
});

client = new Paho.MQTT.Client("rmq1.pptik.id", Number(15675), "ferry");
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({
  onSuccess: onConnect,
  userName: user,
  password: pass,
  cleanSession: false,
  hosts: [ws_server]
});

function onConnect() {
  console.log("Connected to MQTT Server...");
  client.subscribe("general");
  $(".status").html("Connected");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log(message);
  if (message.destinationName == "LED") {
    var pesan = message.payloadString;
    pesan = JSON.parse(pesan);
    console.log(pesan);

    var newChatItem = $(chatItem);
    newChatItem.find('.username').html(pesan.name);
    newChatItem.find('.message').html(pesan.message);
  }
  listen();
}
