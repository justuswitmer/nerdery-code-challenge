$(document).ready(onReady);

function onReady() {
  console.log('in onReady');
  getSnacks();
  snackVoting();
} // end onReady


getSnacks = () => {
  console.log('in getSnacks');
  $('#snacksOut').empty();
  $.ajax({
    type: 'GET',
    url: '/snacks',
    headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
  }).then(response => {
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
  }).catch(err => {
    console.log(err);
  }) // end ajax GET /snacks
} // end getSnacks


snackVoting = () => {
  console.log('in snackVoting');
  $('#snacksVoteOut').empty();
  $.ajax({
    type: 'GET',
    url: '/snacks',
    headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
  }).then(response => {
    console.log('response of:', response);
    $('#snacksHeadOut').append(`
    <tr id='availableSnacksHead'>
      <th>Available Items</th>
      <th class='nmbrVotes'>${response.length}</th>
    </tr>
    `)
    for (let i = 0; i < response.length; i++) {
      let snacks = response[i];
      $('#snacksVoteOut').append(`
        <tr class='availableSnacksList'>
          <td><img src='./plus.svg' width='10%'/></td>
          <td>${snacks.product}</td>
          <td>${snacks.votes}</td>
        </tr>`);
    }
  }).catch(err => {
    console.log(err);
  }) // end ajax GET /snacks
} // end snackVoting

function snackSelection() {
  console.log('in snackSelection');
  $('#selectedSnacks').empty();
  $.ajax({
    type: 'GET',
    url: '/snacks',
    headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
  }).then(response => {
    $('#selectedSnacks').append(`
    <h3>Selection</h3>
    <li>3</li>
    <ul>
      <li>Crunchy Granola Bars</li>
      <li>Energy Bars</li>
      <li>Dill Pickle-Flavored Cashews</li>
    </ul>
  `)
  }).catch(err => {
    console.log(err);
  }) // end ajax GET /snacks
}