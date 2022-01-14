$(() => {





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

// $(() => {
//   // if (!userID) {
//   //   $(".create-story-btn").hide();
//   //   $('.add-block-btn').addClass('hidden');
//   // } else {
//   //   $(".create-story-btn").show();
//   //   $('.add-block-btn').removeClass('hidden');
//   // }



// //   $(window).bind('beforeunload',function(){
// //     const userID = $("h1").attr("data-id");
// //     $(".landing-div").slideUp(0);
// //     if (!userID) {
// //       $(".landing-div").slideDown(0);
// //     }
// // });

//   const userID = $("h1").attr("data-id");
//   $(".landing-div").slideUp(0);
//   if (!userID) {
//     $(".landing-div").slideDown(0);
//     // $(".create-story-btn").hide();
//     // $('.add-block-btn').addClass('hidden');
//   } else {
//     $(".landing-div").slideUp(0);
//   //   $(".create-story-btn").show();
//   //   $('.add-block-btn').removeClass('hidden');
//   // }

//   $(".get-started-btn").click(function() {
//     $(".landing-div").slideUp(2000);
//     setTimeout(()=>{
//       $(".landing-div").hide();
//     },2000 )
//   })

//   // $(".login-button").click(function() {
//   //   $(".create-story-btn").show();
//   //   $('.add-block-btn').removeClass('hidden');
//   // })







// //TEST
//   // $('.login-button').on('click', (e) => {
//   //   e.preventDefault();
//   //   $.post(`http://localhost:8080/users/login/2`)
//   //   .then(() => {
//   //     // location.reload();
//   //   })
//   // })
