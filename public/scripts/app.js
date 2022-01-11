// Client facing scripts here

//const { response } = require("express");



$(() => { //once document is loaded/ready...

  loadStory();












});

//------------------------------------------------ FUNCTIONS ----------------------------------------------------------//

const loadStory = function() {
  $.get('/stories/1') //using AJAX to fetch data
    .then((response) => {
      console.log('response------>', response)
      //$("#all-tweets").empty();
      //renderTweets(response);
      $("#author").text(`- ${response.author_name}`)
      $("#title").text(response.story_title)
      $("#genre").text(response.genre)
      $("#complete").text(response.is_complete === false ? '(IN PROGRESS)' : '(COMPLETE)')
      $("#story-text").text(response.story_text)
      $("#all-contributions").text(renderContributionsPreview(response.contributions))
    })
    .catch((error) => {
      console.log('Error while loading story', error);
    });
};


const createContributionPreviewElement = function (contribution) {
  const {
    contribution_id,
    contribution_title,
    contributor_name,
    contribution_flavour_text,
    chapter_photo,
    contribution_upvote_count
   } = contribution;

   const nameHyphen = `- ${contributor_name}`
   console.log('nameHyphen----->', nameHyphen)
   const contributionTitle = `<h3 class="contribution-title">${contribution_title}</h3>`;
   const contributorName =`<p class="contributor-name">${nameHyphen}</p>`;
   const flavourText = `<div class="contribution-flavour">${contribution_flavour_text}</div>`;
   const upVoteCount = `<div class="upvote"> <i class="fas fa-chevron-up"></i>
   <tag>${contribution_upvote_count}</tag> <i class="fas fa-chevron-down"></i>`

   const $contribution = $(`
   <div class="contribution-container">
   <div class="contribution-content">
   <div class="contribution-heading">
   ${contributionTitle} ${contributorName} </div> ${flavourText}</div> ${upVoteCount}</div></div>
   `)


   return $contribution;

}

const renderContributionsPreview = function(contributions) {
  for (let contribution of contributions) {
    const $newContribution = createContributionPreviewElement(contribution);
    $("#all-contributions").append($newContribution); //adds new contribution to the bottom of the contribution container
  }
};





