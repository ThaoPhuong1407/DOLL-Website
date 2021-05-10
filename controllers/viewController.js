const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
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
  // solutions
  const solutions = await Solution.find();

  // updates from Doll
  const featuresUpdate = new APIFeatures(Update.find(), { sort: '-dateCreated' }).sort();
  let updates = await featuresUpdate.query; 

  if (updates.length >= 5) {
    updates = updates.slice(0,5);
  }
   // 2) Render template usng data from step 1
  res.status(200).render('home', {
    status: 'success',
    updates,
    solutions,
  });
});

exports.getAbout = catchAsync(async (req, res, next) => {
  // 1) get the data
  const people = await Person.find();

  // 2) Render template usng data from step 1
  res.status(200).render('about', {
    status: 'success',
    people: people,
  });
});


exports.getNewsProjects = catchAsync(async (req, res, next) => {
  // 1) get the data
  // a) Press Releases
  const featuresPost = new APIFeatures(Post.find(), { sort: '-dateCreated' }).sort();
  const post = await featuresPost.query; 
  const press = [];
 
  post.forEach(function(postObj, index, theArray) {
    const longText = postObj.body;
    const maxLength = 150; 
    let description = "";

    const paragraphs = longText.split("</p>")
    let firstParagraph = paragraphs[0];
    firstParagraph = firstParagraph.replace('<p class="paragraph">', '');
    firstParagraph = firstParagraph.replace(/<\/?[^>]+(>|$)/g, "");
  
    if (firstParagraph.length > description.length){
        description = firstParagraph.substr(0, maxLength); //trim the string to the maximum length
        if (description.lastIndexOf(" ") === -1) {
          description.substr(description.length);
        } else {
          description = description.substr(0, Math.min(description.length, description.lastIndexOf(" ")));   //re-trim if we are in the middle of a word and
        }
        description = `${description} ...`;
    }

    press.push({
      "title": postObj.title,
      "slug": postObj.slug,
      "description": description,
    });
  }); 

  // b) Projects
  const featuresProject = new APIFeatures(Project.find(), { sort: 'startDate' }).sort();
  let allProjects = await featuresProject.query; 

  // c) Updates from DOLL 
  const featuresUpdate = new APIFeatures(Update.find(), { sort: '-dateCreated' }).sort();
  let updates = await featuresUpdate.query; 
 
  // 2) Render template usng data from step 1
  res.status(200).render('newsandprojects', {
    status: 'success',
    title: 'All Press Releases',
    posts: press,
    projects: allProjects,
    updates: updates,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  // 1) get the data
  // a) Get data for this specific press release
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return next(new AppError('There is no post with this slug'), 404);
  }

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
    status: 'success',
    title: post.title,
    author: post.author,
    source: post.source,
    dateCreated: post.dateCreated,
    body: post.body,
    image: post.image,
    postId: post._id,

    allPosts: allPosts,
    allProjects: allProjects,
    type: 'post',
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  // 1) get the data
  // a) Get data for this specific press release
  const project = await Project.findOne({ slug: req.params.slug });
 
  if (!project) {
    return next(new AppError('There is no post with this slug'), 404);
  }

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
  let dateEnd = null;
  if (project.endDate) { 
    dateEnd = project.endDate;
  }

  // 2) Render template usng data from step 1
  res.status(200).render('post', {
    title: project.name,
    author: 'Dollabs',
    source: 'Dollabs',
    dateCreated: project.startDate,
    dateEnd,
    body: project.body,
    image: project.image,
    type: 'project',
    projectId: project._id,

    allPosts: allPosts,
    allProjects: allProjects,
  });
});

exports.getLoginForm = async (req, res, next) => {
  res.status(200).render('login', {
    status: 'success',
    title: 'Log into your account',
  });
};

exports.getInputForm = async (req, res, next) => {
  const params = req.params.type;
  const paramsArray = params.split('-');
  let model = paramsArray[0];
  model = model.charAt(0).toUpperCase() + model.slice(1);
  let oldData = null;

  if (paramsArray.length > 1) {
    let resData;
    if (model === 'Post') { resData = await Post.findById(paramsArray[2]) }
    else if (model === 'Project')  {  resData = await Project.findById(paramsArray[2]) }
    else if (model === 'Employee') {  resData = await Person.findById(paramsArray[2]) }
    else if (model === 'Update') {  resData = await Update.findById(paramsArray[2]) }
    else if (model === 'Solution') {  resData = await Solution.findById(paramsArray[2]) }
    if (resData) oldData = resData;
  }

  res.status(200).render('input', {
    status: 'success',
    title: 'Enter data',
    type: params,
    value: 'test',
    oldData,
  });
};

exports.getWorkshop = (req, res, next) => {
  res.status(200).render('workshop', {
    status: 'success'
  });
}