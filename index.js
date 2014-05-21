var fs = require('fs');
var path = require('path');
var util = require('util');
var system = require('system');

var args = Array.prototype.slice.call(system.args)

if (args.indexOf('-h') !== -1 || args.indexOf('help') !== -1) {
  console.log(
    'Use csv2sql like:\n \
      node csv2sql type=update input=root/a.csv charset=utf8 where=day_id,cat_name \n \
      node csv2sql type=update input=root/a.csv output=root/a.sql table=a where=day_id,cat_name \n \
    '
  );
  return;
}

args = args.filter(function (a) {
  return a.indexOf('=') > 0;
});



var argList = ['type', 'input', 'output', 'table', 'where'];
var typeList = ['insert', 'update'];

var params = {};

args.forEach(function (arg) {
  var arr = arg.split('=');
  var key = arr[0];
  params[arr[0]] = arr[1] || null;
});

var type = params.type;
if (!type || typeList.indexOf(type) === -1) {
  throw new Error('You must specify the correct `type` like `update` or `insert`!');
}

var input = params.input;
if (!input || path.extname(input).toLowerCase() !== '.csv') {
  throw new Error('You must specify the correct `input`!');
}
params.input = path.resolve(input);

var extname = path.extname(input);
if (!params.output) {
  params.output = path.resolve(path.dirname(input), path.basename(input, extname) + '.sql');
}

if (!params.table) {
  params.table = path.basename(input, extname);
}

if (type=== 'update' && !params.where) {
  throw new Error('You must specify the correct `where`!');
}
params.where = params.where.split(',');

params.charset = params.charset || 'utf8';
var str = fs.readFileSync(params.input, params.charset);
var arr = [];
var columns = [];
str.split(/[\r\n]/).forEach(function (line, idx) {
  line = line.split(/[,;]/);
  if (idx === 0) {
    line.forEach(function (col, ci) {
      col = (col || '').trim();
      columns.push(col);
    });
    return;
  }
  
  arr.push(type === 'update' ? renderUpdate(columns, line, params) : renderInsert(columns, line, params));
});

fs.writeFileSync(params.output, arr.join('\n'));


function renderUpdate(columns, line, params) {
  var update = [];
  var where = [];
  var sql = 'update ' + params.table + ' set ';
  columns.forEach(function (col, idx) {
    var valv = line[idx];
    if (params.where.indexOf(col) !== -1) {
      where.push(col + '=\'' + valv + '\'');
      return;
    }
    update.push(col + '=' + (valv.length !== 0 ? ('\''+valv+'\'') : 'null')); 
  });
  sql += update.join(',');
  sql += ' where ' + where.join(' and ') + ';';
  return sql;
}

function renderInsert(columns, line, params) {
  var update = [];
  var sql = 'insert into ' + params.table + '(' + columns.join(',') + ')';
  columns.forEach(function (col, idx) {
    var valv = line[idx];
    update.push(valv.length !== 0 ? ('\''+valv+'\'') : 'null'); 
  });
  sql += ' values(' + update.join(',') + ');';
  return sql;
}

