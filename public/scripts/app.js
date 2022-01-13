// Client facing scripts here

//const { response } = require("express");



$(() => { //once document is loaded/ready...
  mergeContribution = function(storyID, contributionID) {
    $.post(`/contributions/markasmerged/${contributionID}`)
      .catch(error => console.log(error, error.message));

    // re-load page when a contribution is added to reflect it being part of the story
    loadStory();
  };
  const storyID = $('body').attr('data-story-id');

  const loadStory = function() {
    // $.get(`/stories/${storyID}`) //using AJAX to fetch data
    $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
      .then((response) => {
        //console.log('response------>', response)
        //$("#all-tweets").empty();
        //renderTweets(response);
        const pendingContributions = response.contributions.filter(contribution => !contribution.contribution_is_accepted);
        $("#author").text(`- ${response.author_name}`)
        $("#title").text(response.story_title)
        $("#genre").text(response.genre)
        $("#complete").text(response.is_complete === false ? '(IN PROGRESS)' : '(COMPLETE)')
        $("#story-text").text(response.story_text)
        $("#story-elements").text(renderAcceptedContributions(response.contributions));
        $("#all-contributions").text(renderContributionsPreview(pendingContributions));
        $("#full-contribution-view").text(renderFullContribution(pendingContributions));
        $(".full-contribution-container").addClass('hidden')
        console.log('userID------>', userID)
        if (response.story_author_id === userID) {
          console.log('response.story_author_id', response.story_author_id)
          $("#complete").addClass('hidden')
          $(".complete-toggle").removeClass('hidden')
          $(".ongoing-toggle").removeClass('hidden')
          $("#author").addClass('hidden')
          $("#genre").addClass('hidden')
          //default complete + inprogress buttons as hidden --> use  .hide/.show THEN SHOW
          //default merge button hidden, show
        }
      })
      .catch((error) => {
        console.log('Error while loading story', error);
      });
  };


  const createContributionPreviewElement = function(contribution) {
    const {
      contribution_id,
      contribution_title,
      contributor_name,
      contribution_flavour_text,
      chapter_photo,
      contribution_upvote_count
    } = contribution;

    const nameHyphen = `- ${contributor_name}`
    // console.log('nameHyphen----->', nameHyphen)
    const contributionTitle = `<h3 class="contribution-title">${contribution_title}</h3>`;
    const contributorName = `<p class="contributor-name">${nameHyphen}</p>`;
    const flavourText = `<div class="contribution-flavour">${contribution_flavour_text}</div>`;
    const upVoteCount = `<div class="upvote"> <i class="fas fa-chevron-up"></i><tag>${contribution_upvote_count}</tag> <i class="fas fa-chevron-down"></i>`

    const $contribution = $(`
     <div class="contribution-container" data-id="${contribution_id}">
     <div class="contribution-content">
     <div class="contribution-heading">
     ${contributionTitle} ${contributorName} </div> ${flavourText}</div> ${upVoteCount}</div></div>
     `)

    $($contribution).click(function() {
      const contributionID = $(this).attr('data-id')
      // console.log('contributionID---->',contributionID)
      // console.log('THIS------>',this)
      $('.full-contribution-container').addClass('hidden');
      $(`.full-contribution-container[data-id="${contributionID}"]`).removeClass('hidden');
      $('.contribution-container').addClass('hidden');
      $('.back-to-blocks').removeClass('hidden');
    })



    //   //when we click on the contribution tile
    // $(".contribution-container").click(function() {
    // const contributionID = $(this).attr('data-id')
    // console.log('contributionID---->',contributionID)
    // console.log('THIS------>',this)
    //   //reveal contribution content ... where contribution_id matches

    // });




    return $contribution;

  }

  const renderContributionsPreview = function(contributions) {
    for (let contribution of contributions) {
      const $newContribution = createContributionPreviewElement(contribution);
      $("#all-contributions").append($newContribution); //adds new contribution to the bottom of the contribution container
    }
  };

  const createFullContributionElement = function(contribution) {
    const {
      contribution_id,
      contribution_title,
      contributor_name,
      contribution_flavour_text,
      contribution_text,
      chapter_photo,
      contribution_upvote_count
    } = contribution;

    const nameHyphen = `- ${contributor_name}`
    // console.log('nameHyphen----->', nameHyphen)
    const contributionTitle = `<h3 class="contribution-title">${contribution_title}</h3>`;
    const contributorName = `<p class="contributor-name">${nameHyphen}</p>`;
    const contributionText = `<div class="contribution-text">${contribution_text}</div>`;
    const upVoteCount = `<div class="upvote" id="upvote-horizontal">
     <i class="fas fa-chevron-up">

     </i><tag>${contribution_upvote_count}</tag>
     <i class="fas fa-chevron-down"></i>
    </div>`
    const mergeButton = `<button class="btn btn-secondary merge-contribution" onclick="mergeContribution(${storyID},${contribution_id})">Accept & Merge</button>`;

    const $contributionFull = $(`
     <div class="full-contribution-container" data-id="${contribution_id}">
     <div class="full-contribution-content">
     <div class="contribution-heading">
     ${contributionTitle} ${contributorName} ${mergeButton} </div> ${contributionText}<div class ="full-contribution-footer">

     </i><tag>${upVoteCount}</tag>
  </div>
     `)
    return $contributionFull;
  }

  const renderFullContribution = function(contributions) {
    for (let contribution of contributions) {
      const $newFullContribution = createFullContributionElement(contribution);
      $("#full-contribution-view").append($newFullContribution); //adds new contribution to the bottom of the contribution container
    }
  };



























  //what was in document ready by itself with error

  loadStory();
  $('.back-to-blocks').addClass('hidden');

  $(".add-block-btn").click(function() {
    $(this).addClass('hidden');
    // $('.full-contribution-container').addClass('hidden');
    // $('.contribution-container').addClass('hidden');
    // $('.new-block').removeClass('hidden');
    // $('.FORM').renoveClass('hidden');
    hideFullContributions();
  });

  $(".back-to-blocks").click(function() {
    // $('.full-contribution-container').addClass('hidden');
    // $('.contribution-container').removeClass('hidden');
    // $('.add-block-btn').removeClass('hidden');
    // $('.new-block').addClass('hidden');
    // $('.back-to-blocks').addClass('hidden');
    displayFullContributions();
  });

  const displayFullContributions = function() {
    $('.full-contribution-container').addClass('hidden');
    $('.contribution-container').removeClass('hidden');
    $('.add-block-btn').removeClass('hidden');
    $('.new-block').addClass('hidden');
    $('.back-to-blocks').addClass('hidden');
  }


  const hideFullContributions = function() {
    $('.full-contribution-container').addClass('hidden');
    $('.contribution-container').addClass('hidden');
    $('.new-block').removeClass('hidden');
    $('.back-to-blocks').removeClass('hidden');
  }

  //   //when we click on the contribution tile
  // $(".contribution-container").click(function() {
  //   //reveal contribution content ... where contribution_id matches
  //   $('.full-contribution-container').removeClass('hidden');
  //   $('.contribution-container').addClass('hidden');
  // });

  //   //when we click on the contribution tile
  // $(".contribution-container").click(function() {
  // const contributionID = $(this).attr('data-id')
  // console.log('contributionID---->',contributionID)
  // console.log('THIS------>',this)
  //   //reveal contribution content ... where contribution_id matches
  //   $('.full-contribution-container').removeClass('hidden');
  //   if (contribution_id)
  //   $('.contribution-container').addClass('hidden');
  // });

  const createAcceptedContribution = (contribution) => {
    const {
      contribution_title,
      contributor_name,
      contribution_flavour_text,
      contribution_text
    } = contribution;

    const contributionTitle = `<h1 class="accepted-contribution">${contribution_title}</h1>`;
    const contributorName = `<p>${contributor_name}</p>`;
    const contributionText = `<p>${contribution_text}</p>`;
    const $contributionElement = $(`<div class="accepted-contribution">${contributionTitle}${contributorName}${contributionText}</div>`);

    return $contributionElement;
  };

  const renderAcceptedContributions = (contributions) => {
    let acceptedContributions = contributions.filter(contribution => {
      return contribution.contribution_is_accepted;
    });
    for (let contribution of acceptedContributions) {
      const $contributionElement = createAcceptedContribution(contribution);
      $("#accepted-contributions-container").append($contributionElement);
    }
  }
});

//--------------------- FUNCTIONS ----------------------------------------------------------//


