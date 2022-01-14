$(() => {



  $(window).bind('beforeunload',function(){

    const userID = $("h1").attr("data-id");
    $(".landing-div").slideUp(0);
    if (!userID) {
      $(".landing-div").slideDown(0);
    }

});

  const userID = $("h1").attr("data-id");
  $(".landing-div").slideUp(0);
  if (!userID) {
    $(".landing-div").slideDown(0);
  }

  $(".get-started-btn").click(function() {
    $(".landing-div").slideUp(2000);
    setTimeout(()=>{
      $(".landing-div").hide();
    },2000 )

  });

});
