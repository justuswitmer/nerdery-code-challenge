$(document).ready(onReady);

// counts the remaining votes. 
let count = 3;
// array for storing the voted on snacks
let voteNmbr = [];
// array that is used to ensure duplicate snacks cannot be selected
let duplicateCheck = [];

// functions and buttons that are needed on load
function onReady() {
  console.log('in onReady');
  $(document).on('click', '#addVote', addVote);
  getSnacks();
  snackVotingDisplay();
  selectionHeader();
  trackCount();
} // end onReady

// initial rendering of current snacks. Displays the number of votes they have had
getSnacks = () => {
  $('#snacksOut').empty();
  $.ajax({
    type: 'GET',
    url: '/snacks',
    headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
  }).then(response => {
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
        </div>
      `);
    }
  }).catch(err => {
    console.log(err);
  }) // end ajax GET /snacks
} // end getSnacks

// Displays all the snacks that can be voted on. 
// The selection is identical to the current snack display.
// It was unclear as to whether a new snack array needed to be made.
snackVotingDisplay = () => {
  $('#snacksVoteOut').empty();
  $('#snacksHeadOut').empty();
  $.ajax({
    type: 'GET',
    url: '/snacks',
    headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
  }).then(response => {
    $('#snacksHeadOut').append(`
    <tr id='availableSnacksHead'>  
    <th></th>
    <th id='snackHeadTitle'><h3 id='snackHeadTitleH3'>Available Items</h3></th>
    <th><li id='nmbrVotes'><p id='nmbrVotesP'>${response.length}</p></li></th>
    </tr>
    `)
    for (let i = 0; i < response.length; i++) {
      let snacks = response[i];
      $('#snacksVoteOut').append(`
        <tr class='availableSnacksList'>
          <td>
              <button 
                id='addVote'  
                data-id='${snacks.id}'
                data-product="${snacks.product}"
                data-votes='${snacks.votes}'>
              <img src='./plus.svg' width='50%'/>
              </button>
          </td>
          <td id='snackProduct'>${snacks.product}</td>
          <td>${snacks.votes}</td>
        </tr>`);
    }
  }).catch(err => {
    console.log(err);
  }) // end ajax GET /snacks
} // end snackVotingDisplay

// Displays the count of votes left
function trackCount() {
  $('#trackCount').empty();
  $('#trackCount').append(`
    <h4>${count} Votes Remaining</h4>
  `);
}

// Displays the header row for the selected snacks
function selectionHeader() {
  $('#selectedSnacksHeadOut').empty();
  $('#selectedSnacksHeadOut').append(`
  <tr id='selectedSnacksHead'>
    <th><h3 id='selectedSnacksHeadH3'>Selection</h3></th>
    <th><li id='totalVotes'><p id='totalVotesP'>${voteNmbr.length}</p></li></th>
  </tr>
  `);
}

// Checks if a selected snack is a duplicate and sends an alert if it is,
// POSTS the snack vote to update the snack count,
// renders the voted on snacks,
// and calls other functions to show updated info.
function addVote() {
  let snackId = $(this).data("id");
  let product = $(this).data("product");
  let vote = $(this).data("votes") + 1;
  count--;
  let snack = {
    product: product,
    vote: vote
  };
  console.log('here is my array of voted on products', voteNmbr);
  voteNmbr.push(snack);
  duplicateCheck.push(product);
  console.log('looking at duplicateCheck', duplicateCheck);
  duplicateCheck.map(value => {
    if (new Set(duplicateCheck).size < duplicateCheck.length) {
      console.log('duplicates exsist in voteNbmr');
      alert('you must pick a different snack each time')
      voteNmbr.pop(snack);
      duplicateCheck.pop(product);
    }
    else {
      console.log('duplicates do not exsist in voteNbmr');
    }
  })
  if (voteNmbr.length > 3) {
    alert('you have reached the limit of the number of votes you may cast');
  }
  else {
    $.ajax({
      type: 'POST',
      url: `/snacks/vote/${snackId}`,
      headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
    }).then(response => {
      console.log('this is my reponse:', response);
      $('#selectedSnacksBodyOut').empty();
      voteNmbr.map(snack =>
        $('#selectedSnacksBodyOut').append(`
        <tr id='selectedSnacksBodyTr'>
          <td><p class='tdItem'>${snack.product}</p></td>
          <td><p class='tdItem'>${snack.vote}</p></td>
        </tr>
      `)
      )
      getSnacks();
      snackVotingDisplay();
      selectionHeader();
      trackCount();
    }).catch(err => {
      console.log('error in POST', err);
      alert('there has been an error; please try again later');
    });
  }
}

