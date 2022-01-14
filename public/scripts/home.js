$(() => {



  const userID = $("h1").attr("data-id");
  $(".landing-div").slideUp(0);
  if (!userID) {
    $(".landing-div").slideDown(0);
  }


});
