import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

var posts = {};
var drafts = {};

function getTime() {
  const now = new Date(); 
  const longTime = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZoneName: 'short' });
  console.log(longTime);
  return longTime;
}


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("view-posts.ejs", {data: posts, drafts: drafts});
});

app.get("/new-post", (req, res) => {
  res.render("new-post.ejs", {data: posts, drafts: drafts});
});

app.get("/drafts", (req, res) => {
  res.render("drafts.ejs", {data: posts, drafts: drafts});
});

app.post("/", (req, res) => {
  const action = req.body.action;

  //action for Post
  console.log(req.body);
  var title = req.body["title"];
  const authorName = req.body["authorName"];
  const dateModified = getTime();
  const bodyText = req.body["bodyText"];
  var tokenizedTitle = title.split(/\W+/).filter(Boolean); // Splits by non-alphanumeric characters and removes empty strings
  console.log(tokenizedTitle);
  if (tokenizedTitle.length === 1) {
    var idText = tokenizedTitle[0].toLowerCase();
  } 
  else {
    var idText = tokenizedTitle[0].toLowerCase() + "-" + tokenizedTitle[1].toLowerCase();
  }
  console.log("Id:", idText);

  if (action === "Save as Draft") {
  //action for Save as Draft
  drafts[idText] = {"id": idText, "title": title, "authorName": authorName, "date": dateModified, "bodyText": bodyText};
  res.render("drafts.ejs", {drafts: drafts, data: posts});

  } else if (action === "Post") {

    posts[idText] = {"id": idText, "title": title, "authorName": authorName, "date": dateModified, "bodyText": bodyText};
    console.log(posts);
    res.redirect("/");
} else {
    //invalid action!
    res.status(400).send('Unknown action');
}
});

app.post("/viewPost", (req, res) => {
  console.log("/viewPost");
  console.log(req.body);
  res.render("view-post.ejs", {blogTitle: req.body["title"],
    blogAuthor: req.body["authorName"],
    blogDate: req.body["date"],
    blogText: req.body["bodyText"], 
    blogID: req.body["id"],
    data: posts, 
    drafts: drafts
  });
});

app.post("/editPost", (req, res) => {
  console.log("/editPost");
  console.log(req.body);
  res.render("edit-post.ejs", {blogTitle: req.body["title"],
    blogAuthor: req.body["authorName"],
    blogDate: req.body["date"],
    blogText: req.body["bodyText"], 
    blogID: req.body["id"],
    data: posts, 
    drafts: drafts
  });
});

app.post("/editedPost", (req, res) => {
  console.log("/editedPost");
  console.log(req.body);
  const action = req.body.action;

  if (action === "Post") {
    posts[req.body["id"]] = {"id": req.body["id"], "title": req.body["title"], "authorName": req.body["authorName"], "date": getTime(), "bodyText": req.body["bodyText"]}
    res.render("view-post.ejs", {blogTitle: req.body["title"],
      blogAuthor: req.body["authorName"],
      blogDate: getTime(),
      blogText: req.body["bodyText"], 
      blogID: req.body["id"],
      data: posts,
      drafts: drafts
    });
  }
  else if (action === "Delete Post") {
    delete posts[req.body["id"]];
    res.redirect("/");
  }
  else if (action === "Save as Draft") {
    delete posts[req.body["id"]];
    drafts[req.body["id"]] = {"id": req.body["id"], "title": req.body["title"], "authorName": req.body["authorName"], "date": getTime(), "bodyText": req.body["bodyText"]};
    res.render("drafts.ejs", {drafts: drafts, data: posts});
  }
});

app.post("/editDraft", (req, res) => {
  res.render("edit-draft.ejs", {blogTitle: req.body["title"],
    blogAuthor: req.body["authorName"],
    blogDate: req.body["date"],
    blogText: req.body["bodyText"], 
    blogID: req.body["id"],
    data: posts,
    drafts: drafts
  });
});

app.post("/editedDraft", (req, res) => {
  console.log("/editedDraft");
  console.log(req.body);
  const action = req.body.action;

  if (action === "Post") {
    posts[req.body["id"]] = {"id": req.body["id"], "title": req.body["title"], "authorName": req.body["authorName"], "date": getTime(), "bodyText": req.body["bodyText"]};
    delete drafts[req.body["id"]];

    res.render("drafts.ejs", {blogTitle: req.body["title"],
      blogAuthor: req.body["authorName"],
      blogDate: getTime(),
      blogText: req.body["bodyText"], 
      blogID: req.body["id"],
      data: posts, 
      drafts: drafts
    });
  }
  else if (action === "Delete Draft") {
    delete drafts[req.body["id"]];
    res.redirect("/drafts");
  }
  else if (action === "Save as Draft") {
    drafts[req.body["id"]] = {"id": req.body["id"], "title": req.body["title"], "authorName": req.body["authorName"], "date": getTime(), "bodyText": req.body["bodyText"]};
    res.render("drafts.ejs", {drafts: drafts, data: posts});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});