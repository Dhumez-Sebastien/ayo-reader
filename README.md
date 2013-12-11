# AyoReader
Allows simultaneous playback file!

# Getting Started

You'll need to have ayoReader installed.
```
npm install ayo-reader
```

Param your simultanemous files reading
```
// This is 100 files simultanemous by default
ayoRead.Param({readLimit : 500});
```

> **NOTE:** The number of file reading simultanemous is 1000 max

And launch your reader

```
// Launch the reader as with node.fs
ayoRead.Read(mapPath, function(err, fileData, fileURL) {
    // What you want here
    // fileData => All contained file data
    // fileURL => The URL of file currently reading
});
```

That's all!

# Author
* Dhumez Sébastien
