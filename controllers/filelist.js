var FileList = require('../models/filelist.js');

// /api/fileList POST
exports.postFileList = function(req, res) {
  // Create new list instance
  var fileList = new FileList();

  // Set the properties from the POST
  fileList.url = req.body.url;
  fileList.firstSynset = req.body.firstSynset;
  fileList.alphaIndex = req.body.alphaIndex;

  // Save
  fileList.save(function(err) {
    if (err) {
      res.send(err);
    }

    res.json({
      message: 'Added',
      data: fileList
    });
  });
};

// /fileList GET
exports.getNewFileList = function(req, res) {
  FileList
    .find()
    .where('status').exists(false)
    .limit(1)
    .exec(function(err, file) {
      if (err) {
        res.send(err);
      }
      res.json(file);
    });
};

// /fileList PUT
exports.updateFileList = function (req, res) {
  FileList.findById(req.body.id, function (err, fileList) {
    if (err) {res.send(err);}

    // Update the fileList
    fileList.status = req.body.status;
    fileList.user = req.body.user;

    fileList.save(function (err) {
      if (err) {res.send(err);}
    });
    // Respond
    res.json({message: 'updated'});

  });
};

// /all GET
exports.getAllFileLists = function(req, res) {
  FileList.find(function(err, fileList) {
    if (err) {
      res.send(err);
    }

    res.json(fileList);
  });
};

// /fileList DELETE
exports.deleteFileList = function(req, res) {
  FileList.findByIdAndRemove(req.body.id, function(err) {
    if (err) {
      res.send(err);
    }

    res.json({
      message: 'deleted ' + req.body.id,
    });
  });
};

exports.deleteAllFileLists = function(req, res) {
  FileList.remove(function (err) {
    if (err) {res.send(err);}
    res.json({'message': 'all deleted :/'});
  });
};
