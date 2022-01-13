$(document).ready(() => {

  let isUpvoteClicked = false;
  let isDownvoteClicked = false;

  $('.wrapper-story').on('click', '.fa-chevron-up', function(e) {
    const contributionID = $(this).closest('.full-contribution-container').attr('data-id');
    if (isUpvoteClicked) {
      return;
    }
    // change clicked on arrow to red
    $(this).css("color", "red");
    // change the opposite arrow to purple
    $(this).siblings('.fa-chevron-down').css("color", "#6117ff");
    $.post(`http://localhost:8080/contributions/${contributionID}/upvote`)
    .then(() => {
      isUpvoteClicked = true;
      isDownvoteClicked = false;
      // console.log($('.wrapper-story').find('tag'));
      console.log('done post upvote');
      console.log('iuc', isUpvoteClicked);
      console.log('idc', isDownvoteClicked);
    })


  });

  $('.wrapper-story').on('click', '.fa-chevron-down', function(e){
    const contributionID = $(this).closest('.full-contribution-container').attr('data-id');
    // do nothing if it has already been clicked on
    if (isDownvoteClicked) {
      return;
    }
    // change clicked on arrow to red
    $(this).css("color", "red");
    // change the opposite arrow to purple
    $(this).siblings('.fa-chevron-up').css("color", "#6117ff");
    $.post(`http://localhost:8080/contributions/${contributionID}/downvote`)
    .then(() => {
      isDownvoteClicked = true;
      isUpvoteClicked = false;
      console.log('done post downvote');
      console.log('iuc', isUpvoteClicked);
      console.log('idc', isDownvoteClicked);

      })
    });

});
