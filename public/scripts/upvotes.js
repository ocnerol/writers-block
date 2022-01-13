$(document).ready(() => {
  let isUpvoteClicked = false;
  let isDownvoteClicked = false;
  console.log(storyContributions);

  $(".wrapper-story").on("click", ".fa-chevron-up", function () {
    // do nothing if user not logged in
    if (!userID) {
      return;
    }

    const contributionID = $(this)
      .closest(".full-contribution-container")
      .attr("data-id");

    if (isUpvoteClicked) {
      return;
    }
    // change clicked on arrow to red
    $(this).css("color", "red");
    // change the opposite arrow to purple
    $(this).siblings(".fa-chevron-down").css("color", "#6117ff");
    $.post(`http://localhost:8080/contributions/${contributionID}/upvote`).then(
      () => {
        // Get current count value and increment
        let currentVoteCount = Number(
          $(this).siblings(`.tag${contributionID}`).text()
        );
        // If the other vote button was previously clicked, increment by 2
        let newVoteCount = isDownvoteClicked
          ? currentVoteCount + 2
          : currentVoteCount + 1;
        let newCountDisplay = newVoteCount.toString();
        // console.log('cvc', currentVoteCount, 'nvc', newVoteCount, 'ncd', newCountDisplay);
        $(`.tag${contributionID}`).text(newCountDisplay);

        // change "state" and prevent consecutive clicks
        isUpvoteClicked = true;
        isDownvoteClicked = false;
      }
    );
  });

  $(".wrapper-story").on("click", ".fa-chevron-down", function () {
    // do nothing if user not logged in
    if (!userID) {
      return;
    }

    const contributionID = $(this)
      .closest(".full-contribution-container")
      .attr("data-id");

    // do nothing if it has already been clicked on
    if (isDownvoteClicked) {
      return;
    }
    // change clicked on arrow to red
    $(this).css("color", "red");
    // change the opposite arrow to purple
    $(this).siblings(".fa-chevron-up").css("color", "#6117ff");
    $.post(
      `http://localhost:8080/contributions/${contributionID}/downvote`
    ).then(() => {
      // Get current count value and increment
      let currentVoteCount = Number(
        $(this).siblings(`.tag${contributionID}`).text()
      );
      // If the other vote button was previously clicked, increment by 2
      let newVoteCount = isUpvoteClicked
        ? currentVoteCount - 2
        : currentVoteCount - 1;
      let newCountDisplay = newVoteCount.toString();
      $(`.tag${contributionID}`).text(newCountDisplay);

      isDownvoteClicked = true;
      isUpvoteClicked = false;
    });
  });
});
