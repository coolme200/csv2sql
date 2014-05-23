csv2sql
======

非常简易的一个小工具，将csv文件转换为insert|update SQL文件。

install
======
```
  $ npm install csv2sql -g
```

help
======

```
  $ csv2sql -h
```

demo
======

```
  // inputFile
  // bin/a.csv
  // a,b
  // 1,2

  $ csv2sql type=insert input=bin/a.csv

  // outputFile
  // bin/a.sql
  // insert into a(a,b) values('1','2');

```

## License
MIT