// Client facing scripts here

//-------------- NOTE: WHEN YOU NEED TO ACCESS DB VALUES FROM BROWSER ON CLICK ------------------------------------//
/*

1 - USING DATA ATTRIBUTE (PASSING ID FROM REQ.PARAMS > TEMPLATEVARS > EJS and then using .attr() to get the data on that element)
 $(".back-to-blocks").click(function() {
  const storyID = $('body').attr('data-story-id')
    $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
    .then((response) => {
      if (response.is_complete) {
        $('.add-block-btn').addClass('hidden');
      } else {
        $('.add-block-btn').removeClass('hidden');
      }
    })
    .catch((error) => {
        console.log('Error while loading story', error);
      });

    displayFullContributions();
  });

2 - USING .text() empty to get the value of the element you want, not recommended to use string to evaluate
    // if ($('#complete').text()==='(COMPLETE)')  {
      if ($('#complete').text().includes('COMPLETE')) {
        $('.add-block-btn').addClass('hidden');
      } else {
        $('.add-block-btn').removeClass('hidden');
      }

3 - USING onclick= in your html tag is like an inline onlick handler for the tag, see MERGE CONTRIBUTION BUTTON

*/
//----------------------------------------------------------------------------------------------------------------//


$(() => { //once document is loaded/ready...
  mergeContribution = function(storyID, contributionID) {
    $.post(`/contributions/mark-as-merged/${contributionID}`)
      .catch(error => console.log(error, error.message));

    // re-load page when a contribution is added to reflect it being part of the story
    loadStory();
    $(".back-to-blocks").addClass('hidden');
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
    const storyID = $('body').attr('data-story-id')
    $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
      .then((response) => {
        if (response.is_complete) {
          $('.add-block-btn').addClass('hidden');
        } else {
          $('.add-block-btn').removeClass('hidden');
        }
      })
      .catch((error) => {
        console.log('Error while loading story', error);
      });

    displayFullContributions();
  });

  const displayFullContributions = function() {
    $('.full-contribution-container').addClass('hidden');
    $('.contribution-container').removeClass('hidden');
    $('.new-block').addClass('hidden');
    $('.back-to-blocks').addClass('hidden');
  }


  const hideFullContributions = function() {
    $('.full-contribution-container').addClass('hidden');
    $('.contribution-container').addClass('hidden');
    $('.new-block').removeClass('hidden');
    $('.back-to-blocks').removeClass('hidden');
  }

});

//--------------------- FUNCTIONS ----------------------------------------------------------//

const loadStory = function() {
  // $.get(`/stories/${storyID}`) //using AJAX to fetch data
  const storyID = $('body').attr('data-story-id');
  $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
    .then((response) => {
      //console.log('response------>', response)
      //$("#all-tweets").empty();
      //renderTweets(response);
      const pendingContributions = response.contributions.filter(contribution => !contribution.contribution_is_accepted);
      const acceptedContributions = response.contributions.filter(contribution => contribution.contribution_is_accepted);
      $("#author").text(`- ${response.author_name}`)
      $("#title").text(response.story_title)
      $("#genre").text(response.genre)
      $("#complete").text(response.is_complete === false ? '(IN PROGRESS)' : '(COMPLETE)')
      $("#story-text").text(response.story_text)

      // !!!
      // clear accepted contributions container
      $("#accepted-contributions-container").text('');
      // (re-)populate accepted contributions container with only accepted contributions
      renderAcceptedContributions(acceptedContributions);

      // clear pending contribution flavour tiles container
      $("#all-contributions").text('');
      // (re-)populate pending contribution flavour tiles container
      $("#all-contributions").text(renderContributionsPreview(pendingContributions));

      // clear pending contribution full text tiles container
      $("#full-contribution-view").text('');
      // (re-)populate pending contribution full text tiles container
      $("#full-contribution-view").text(renderFullContribution(pendingContributions));

      // !!! ^^^
      $(".full-contribution-container").addClass('hidden')
      console.log('userID------>', userID)
      if (response.story_author_id === userID) {
        if (response.is_complete) {
          $(".complete-toggle").addClass('pressed-complete')
          $(".ongoing-toggle").removeClass('pressed-ongoing')
          $('.add-block-btn').addClass('hidden');
        } else {
          $(".complete-toggle").removeClass('pressed-complete')
          $(".ongoing-toggle").addClass('pressed-ongoing')
        }
        console.log('response.story_author_id', response.story_author_id)
        $("#complete").addClass('hidden')
        $(".complete-toggle").removeClass('hidden')
        $(".ongoing-toggle").removeClass('hidden')
        $("#author").addClass('hidden')
        $("#genre").addClass('hidden')

        // if story is complete, hide merge button
        $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
          .then((response) => {
            if (response.is_complete) {
              $('.merge-contribution').hide();
            } else {
              $('.merge-contribution').show();
            }
          })
          .catch((error) => {
            console.log('Error while loading story', error);
          });

        // --------- If author, when clicking the COMPLETE button, add class
        $(".complete-toggle").click(function() {
          const storyID = $('body').attr('data-story-id')
          //console.log('storyID------>', storyID)
          $.post(`http://localhost:8080/stories/${storyID}/complete`)
          $(".complete-toggle").addClass('pressed-complete')
          $(".ongoing-toggle").removeClass('pressed-ongoing')

          //Hide 'Add a block'
          $(".add-block-btn").addClass('hidden')
          //Hide 'BLOCK FORM'
          $(".new-block").addClass('hidden')




          //Hide ---> 'Back to blocks'
          $(".back-to-blocks").addClass('hidden')

          //Hide ---> contribution container preview tiles
          $(".contribution-container").removeClass('hidden')
          $(".full-contribution-container").addClass('hidden');


          // if story is complete, hide merge button
          $.get(`/stories/${storyID}/data`) //using AJAX to fetch data
            .then((response) => {
              if (response.is_complete) {
                $('.merge-contribution').hide();
              } else {
                $('.merge-contribution').show();
              }
            })
            .catch((error) => {
              console.log('Error while loading story', error);
            });



        });

        //---------- If author, when clicking the ONGOING button, add class
        $(".ongoing-toggle").click(function() {
          const storyID = $('body').attr('data-story-id')
          $.post(`http://localhost:8080/stories/${storyID}/ongoing`)
          $(".complete-toggle").removeClass('pressed-complete')
          $(".ongoing-toggle").addClass('pressed-ongoing')

          //Show ---> add block
          $(".add-block-btn").removeClass('hidden')

          // if story is marked as ongoing, hide 'back to blocks' button
          // since we then only want to see contribution previews
          $(".back-to-blocks").addClass('hidden');



          $(".new-block").addClass('hidden')
          //Hide ---> full preview of the spec
          // $(".contribution-container").removeClass('hidden')

          //Hide ---> 'Back to blocks'
          //$(".back-to-blocks").removeClass('hidden')

          //Show ---> contribution container IF full-contribution is hidden
          $(".contribution-container").removeClass('hidden')
          $(".full-contribution-container").addClass('hidden')


          $('.merge-contribution').show();

        });
      }
    })
    .catch((error) => {
      console.log('Error while loading story', error);
    });

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
    for (let contribution of contributions) {
      const $contributionElement = createAcceptedContribution(contribution);
      $("#accepted-contributions-container").append($contributionElement);
    }
  }

  // if div.all-contributions does not have hidden class, show back-to-blocks-button
  if (!$("#all-contributions").hasClass("hidden")) {
    $(".back-to-blocks").removeClass("hidden");
  }


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
  const contributionTitle = `<h3 class="contribution-title">${contribution_title}</h3>`;
  const contributorName = `<p class="contributor-name">${nameHyphen}</p>`;
  const flavourText = `<div class="contribution-flavour">${contribution_flavour_text}</div>`;
  const upVoteCount = `<div class="upvote"> <i class="fas fa-chevron-up"></i><tag class=tag${contribution_id}>${contribution_upvote_count}</tag> <i class="fas fa-chevron-down"></i>`

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

  return $contribution;

}

const renderContributionsPreview = function(contributions) {
  for (let contribution of contributions) {
    const $newContribution = createContributionPreviewElement(contribution);
    $("#all-contributions").append($newContribution); //adds new contribution to the bottom of the contribution container
  }
};

const createFullContributionElement = function(contribution) {
  const storyID = $('body').attr('data-story-id');
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
  const contributionTitle = `<h3 class="contribution-title">${contribution_title}</h3>`;
  const contributorName = `<p class="contributor-name">${nameHyphen}</p>`;
  const contributionText = `<div class="contribution-text">${contribution_text}</div>`;
  const upVoteCount = `<div class="upvote" id="upvote-horizontal">

   <i class="fas fa-chevron-up">

   </i><tag class=tag${contribution_id}>${contribution_upvote_count}</tag>
   <i class="fas fa-chevron-down"></i>
  </div>`
  const mergeButton = `<button class="btn btn-secondary merge-contribution" onclick="mergeContribution(${storyID},${contribution_id})">Merge <img src="../images/merge-icon.svg"></button>`;

  const $contributionFull = $(`
   <div class="full-contribution-container" data-id="${contribution_id}">
    <div class="full-contribution-content">
      <div class="contribution-heading">
        ${contributionTitle}
        ${contributorName}
      </div>
      ${contributionText}
      <div class="full-contribution-footer">
        <tag>${upVoteCount}</tag>
        <div>
          ${mergeButton}

        </div>
      </div>
    </div>
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
//--------------------- FUNCTIONS ----------------------------------------------------------//
