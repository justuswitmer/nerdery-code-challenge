$(document).ready(onReady);

function onReady() {
  console.log('in onReady');
  getSnacks();
} // end onReady


function getSnacks() {
  console.log('in getSnacks');
  $('#snacksOut').empty();
  $.ajax({
    type: 'GET',
    url: '/snacks',
    headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
  }).then(function (response) {
    console.log('response of:', response);
    for (let i = 0; i < response.length; i++) {
      let snacks = response[i];
      $('#snacksOut').append(`
      <div class='currentSnacks'>
        <img 
          src=${snacks.image} 
          width="60%"
          class='snackDisplayImage'
        />
        <li class='snackVote'>${snacks.votes}</li>
        <li class='voteImage'></li>
        <li class='snackDisplayBrand'>${snacks.brand}</li>
        <li class='snackDisplayProduct'>${snacks.product}</li>

      </div>`);
    }
  }).catch(function (err) {
    console.log(err);
  }) // end ajax GET /snacks
} // end getSnacks