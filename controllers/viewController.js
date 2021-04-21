const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const Post = require('../models/postModel');
const Project = require('../models/projectModel');

const renderPage = (page) => (req, res, next) => {
    res.status(200).render(page);
  };

exports.getHome = renderPage('home');
exports.getAbout = renderPage('about');
exports.getContact = renderPage('contact');

exports.getNewsProjects = catchAsync(async (req, res, next) => {
  // 1) get the data

  // a) Press Releases
  const post = await Post.find();
  const press = [];
 
  post.forEach(function(postObj, index, theArray) {
    const longText = postObj.body;
    const maxLength = 200; 
    let description = "";

    if (longText.length > description.length){
        description = longText.substr(0, maxLength); //trim the string to the maximum length
        description = description.substr(0, Math.min(description.length, description.lastIndexOf(" ")));   //re-trim if we are in the middle of a word and 
        description = `${description}...`;
    }

    press.push({
      "title": postObj.title,
      "slug": postObj.slug,
      "description": description,
    });
  }); 

  // b) Projects
  const projects = await Project.find();

  // 2) Build the template
  // 3) Render template usng data from step 1
  res.status(200).render('newsandprojects', {
    title: 'All Press Releases',
    posts: press,
    projects: projects,
  });
});


exports.getPost = catchAsync(async (req, res, next) => {
  // 1) get the data
  // a) Get data for this specific press release
  const post = await Post.findOne({ slug: req.params.slug });
  post.image.forEach((link, index, theArray) => {
    const sharedId = link.substring(
      link.lastIndexOf('d/') + 2,
      link.lastIndexOf('/view'));
    theArray[index]= sharedId;
  });

  // b) Get titles of the 5 most recent Press Releases
  const featuresPost = new APIFeatures(Post.find(), { sort: '-dateCreated' }).sort();
  let allPosts = await featuresPost.query; 
  if (allPosts.length >= 5) {
    allPosts = allPosts.slice(0,5);
  }

  // c) Get name of the 5 most recent Press Releases
  const featuresProject = new APIFeatures(Project.find(), { sort: '-startDate' }).sort();
  let allProjects = await featuresProject.query; 
  if (allProjects.length >= 5) {
    allProjects = allProjects.slice(0,5);
  }

  // 2) Build the template
  // 3) Render template usng data from step 1
  res.status(200).render('post', {
    title: post.title,
    author: post.author,
    source: post.source,
    dateCreated: post.dateCreated,
    body: post.body,
    image: post.image,
    allPosts: allPosts,
    allProjects: allProjects,
  });
});

exports.getConstruction = renderPage('construction');