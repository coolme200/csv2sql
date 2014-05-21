csv2sql
======

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