var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

var GITHUB_USER = "chaodonghu"
var GITHUB_TOKEN = "f0c38d19f1c32dc4bf6231e381b77b6e0eff7a1c"

// makes a request for JSON, getting back an array of contributors and passes
// this data to cb, an anonymous callback function that is given
function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);

  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };

  request.get(options, function(err, response) {
    if (err) {
      throw err
    } if (response.statusCode === 200) {;
      cb(response);
  }
  });
}


function cb (response) {
  // parse the body string into an javascript object
  var results = JSON.parse(response.body);
  // loop through the 'results' object and store each contributors filepath
  for (var contributor in results) {
    // store the avatar jpgs in created 'avatars' directory
    var filePath = './avatars/' + results[contributor]['login'] + '.jpg';
    // evoke callback function to store the avatar_url to a new filepath file
    downloadImageByURL(results[contributor]['avatar_url'], filePath);
  }
}

// fetches desired url and write the images url to a new file path
function downloadImageByURL (url ,filePath) {
  var content = request.get(url)
  content.pipe(fs.createWriteStream(filePath));
}

// supports command line arguements and makes them required arguements
if (repoOwner && repoName) {
  getRepoContributors(repoOwner, repoName, cb);
  console.log('jpg\'s have been stored in avatars folder!');
} else {
  console.log('ERROR: Please enter both a repoOwner and repoName');
}
