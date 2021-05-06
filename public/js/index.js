import '@babel/polyfill';
import { login, logout } from './login'
import { displayMap } from './mapbox'
import { createNew, updateCurrentData, deleteCurrentData, filterText } from './submit'

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav__el--logout');
const inputForm = document.querySelector('.input-form');
const deleteData = document.querySelectorAll('.delete');

var moreText = document.querySelectorAll('[id=more]');
var btnText = document.getElementById("show");

// VALUES 
const loc = [-71.2280607, 42.4454253];

// Login
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault(); 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
// CRUD DATABASE
if (inputForm) {

    tinymce.init({ 
        selector:'.myTextArea',
        plugins: 'link image',
        menubar: false,
        toolbar: 'undo redo | bold italic h1 | link image',
        autosave_ask_before_unload: false,
        width: '90%',
        skin: 'bootstrap',       
        content_css: '../css/style.css',
        body_class: 'tinymceBody'
    });

    // ID is in the form of: type-action-id  
    // Example:
    // Create: solution
    // Update: solution-update-id
    inputForm.addEventListener('submit', async(e) => {
        e.preventDefault(); 
    
        const elemId = inputForm.id.split('-');     
        let data = {};
        let type; // post, update, person, solution, etc.
        let loadPage;

        if (elemId[0] === 'project') {
            const name = document.getElementById('name').value.trim();
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const shortDescription = document.getElementById('shortDescription').value.trim();
            let body = await tinyMCE.activeEditor.getContent();
            body = filterText(body, 'paragraph');

            const icon = document.getElementById('icon').value.trim();

            if (name !== '') data.name = name;
            if (startDate !== '') data.startDate = startDate; 
            if (endDate !== '') data.endDate = endDate;
            if (shortDescription !== '') data.shortDescription = shortDescription;
            if (body !== '') data.body = body;
            if (icon !== '') data.icon = icon;
            type = 'project';

            if (document.querySelector('.slug')) {
                loadPage = `project/${document.querySelector('.slug').id}`;
            } else {
                loadPage ='newsandprojects';
            }
            // let image = document.getElementById('image').value.trim();
            // if (image.includes(',')) {
            //     image = image.split(',');
            //     image = image.map(str => str.trim());
            // }
            // if (image !== '') data.image = image;
        }
        else if (elemId[0] === 'post') {
            const title = document.getElementById('title').value.trim();
            const author = document.getElementById('author').value.trim();
            const source = document.getElementById('source').value.trim();
            const dateCreated = document.getElementById('dateCreated').value;
            let body = await tinyMCE.activeEditor.getContent();
            body = filterText(body, 'paragraph');

            if (title !== '') data.title = title;
            if (author !== '') data.author = author; 
            if (source !== '') data.source = source;
            if (dateCreated !== '') data.dateCreated = dateCreated;
            if (body !== '') data.body = body;
            type = 'post';
            if (document.querySelector('.slug')) {
                loadPage = `post/${document.querySelector('.slug').id}`;
            } else {
                loadPage ='newsandprojects';
            }
        }
        else if (elemId[0] === 'update') {
            const title = document.getElementById('title').value.trim();
            const dateCreated = document.getElementById('dateCreated').value;
            let body = await tinyMCE.activeEditor.getContent();
            body = filterText(body, 'paragraph');
            if (title !== '') data.title = title;
            if (body !== '') data.body = body; 
            if (dateCreated !== '') data.dateCreated = dateCreated;
            type = 'update';
            loadPage ='newsandprojects#press';
        }

        else if (elemId[0] === 'solution') {
            const name = document.getElementById('name').value.trim();
            const shortDescription = document.getElementById('shortDescription').value.trim();
            const image = document.getElementById('image').value.trim();

            let longDescription = await tinyMCE.activeEditor.getContent();
            longDescription = filterText(longDescription, '');

            if (name !== '') data.name = name;
            if (shortDescription !== '') data.shortDescription = shortDescription; 
            if (longDescription !== '') data.longDescription = longDescription;
            if (image !== '') data.image = image;
            type = 'solution';
            if (document.querySelector('.objID')) {
                loadPage = `#popup-${document.querySelector('.objID').id}`;
            } else {
                loadPage ='';
            }
        }
        else if (elemId[0] === 'employee') {
            const name = document.getElementById('name').value.trim();
            const jobTitle = document.getElementById('jobTitle').value.trim();
            const image = document.getElementById('image').value.trim();
            let description = await tinyMCE.activeEditor.getContent();
            description = filterText(description, 'paragraph');

            if (name !== '') data.name = name;
            if (jobTitle !== '') data.jobTitle = jobTitle; 
            if (description !== '') data.description = description;
            if (image !== '') data.image = image;
            type = 'person';
            loadPage ='about';
        }

        if (elemId[2]) {
            updateCurrentData(type, data, loadPage, elemId[2]);
        } else {
            createNew(type, data, loadPage);
        }
    });
}

if (deleteData) { 
    for (let i = 0; i < deleteData.length; i++) {
        const elemId = deleteData[i].id;
        document.getElementById(elemId).addEventListener('click',function(event) {
            event.preventDefault(); // Cancel the native event
            event.stopPropagation();// Don't bubble/capture the event any further
        
            const elemIdArray = elemId.split('-');   
            const type = elemIdArray[0];
            const id = elemIdArray[2];

            deleteCurrentData(type, id);
        });
    }
}

// Display map on the contact page
if (mapBox) {
    displayMap(loc);
}

// Show more OR show less function
if (btnText) {
    btnText.addEventListener("click", function() {
        if (btnText.innerHTML === "Show more") {
            moreText.forEach(function (item, index) {
                item.style.display = "block";
            });
            btnText.innerHTML = "Show less";
        } else {
            moreText.forEach(function (item, index) {
                item.style.display = "none";
            });
            btnText.innerHTML = "Show more";
        }
    });
}
