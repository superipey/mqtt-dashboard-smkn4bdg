var mqtt = require('mqtt');

var client = mqtt.connect(process.env.MQTT_HOST, {
  'username': process.env.MQTT_USER,
  'password': process.env.MQTT_PASS,
  'clientId': process.env.MQTT_CLIENT_ID,
})

client.on('connect', function () {
  console.log('connect');
  client.subscribe(MQTT_DEFAULT_TOPIC, function (err) {
    if (!err) {
      console.log('Subscribed to Topic: general');
      //   client.publish('presence', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  var data = message.toString().split("#");
  var kodeDevice = data[data.length-1];
  var latitude = data[2];
  var longitude = data[3];

  var data1 = data[4];
  var data2 = data[5];
  var data3 = data[6];
  var data4 = data[7];
  // var data5 = data[8];
  // var data6 = data[9];
  // var data7 = data[10];
  // var data8 = data[11];
  // var data9 = data[12];
  // var data10 = data[13];

  var dataDisimpan = [
    kodeDevice,
    data1,
    data2,
    data3,
    data4,
    '',
    '',
    '',
    '',
    '',
    '',
    latitude,
    longitude
  ]

  insert(dataDisimpan);
});


function insert(params) {
  // Fungsi Insert to DB
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });

  connection.connect();
  connection.query("INSERT INTO node(device_id, data_1, data_2, data_3, data_4, data_5, data_6, data_7, data_8, data_9, data_10, lat, lng) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", params, function (error, results, fields) {
    if (error) throw error;
  });
  connection.end();
  return true;
}
