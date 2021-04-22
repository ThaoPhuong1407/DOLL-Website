const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const Post = require('../models/postModel');
const Project = require('../models/projectModel');
const Person = require('../models/personModel');
const Update = require('../models/updateDOLLModel');
const Solution = require('../models/solutionModel');


const renderPage = (page) => (req, res, next) => {
    res.status(200).render(page);
  };

exports.getContact = renderPage('contact');
exports.getConstruction = renderPage('construction');

exports.getHome = catchAsync(async (req, res, next) => {
  // 1) get the data
  const featuresUpdate = new APIFeatures(Update.find(), { sort: '-dateCreated' }).sort();
  let updates = await featuresUpdate.query; 

  if (updates.length >= 5) {
    updates = updates.slice(0,5);
  }

  const solutions = await Solution.find();

   // 2) Render template usng data from step 1
  res.status(200).render('home', {
    updates,
    solutions,
  });
});

exports.getAbout = catchAsync(async (req, res, next) => {
  // 1) get the data
  const people = await Person.find();
  // 2) Render template usng data from step 1
  res.status(200).render('about', {
    people: people,
  });
});


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

  // c) Updates from DOLL 
  const featuresUpdate = new APIFeatures(Update.find(), { sort: '-dateCreated' }).sort();
  let updates = await featuresUpdate.query; 
 
  // 2) Render template usng data from step 1
  res.status(200).render('newsandprojects', {
    title: 'All Press Releases',
    posts: press,
    projects: projects,
    updates: updates,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  // 1) get the data
  // a) Get data for this specific press release
  const post = await Post.findOne({ slug: req.params.slug });

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

  // 2) Render template usng data from step 1
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
