$(document).ready(onReady);

let count = 0;
let voteNmbr = [];
let duplicateCheck = [];

function onReady() {
  console.log('in onReady');
  $(document).on('click', '#addVote', addVote);
  getSnacks();
  snackVoting();
  selectionHeader();
} // end onReady

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
      </div>`);
    }
  }).catch(err => {
    console.log(err);
  }) // end ajax GET /snacks
} // end getSnacks

snackVoting = () => {
  $('#snacksVoteOut').empty();
  $('#snacksHeadOut').empty();
  $.ajax({
    type: 'GET',
    url: '/snacks',
    headers: { "Authorization": 'Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827' }
  }).then(response => {
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
          <td>
            <button 
              id='addVote'  
              data-id='${snacks.id}'
              data-product="${snacks.product}"
              data-votes='${snacks.votes}'>
            <img src='./plus.svg' width='10%'/>
            </button>
          </td>
          <td id='snackProduct'>${snacks.product}</td>
          <td>${snacks.votes}</td>
        </tr>`);
    }
  }).catch(err => {
    console.log(err);
  }) // end ajax GET /snacks
} // end snackVoting

function selectionHeader() {
  $('#selectedSnacksHead').empty();
  $('#selectedSnacksHead').append(`
  <tr>
    <th>Selection</th>
    <th>${voteNmbr.length}</th>
  </tr>
  `);
}

function addVote() {
  let snackId = $(this).data("id");
  let product = $(this).data("product");
  let vote = $(this).data("votes") + 1;
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
      $('#selectedSnacksBody').empty();
      voteNmbr.map(snack =>
        $('#selectedSnacksBody').append(`
        <tr>
          <td>${snack.product}</td>
          <td>${snack.vote}</td>
        </tr>
      `)
      )
      getSnacks();
      snackVoting();
      selectionHeader();
    }).catch(err => {
      console.log('error in POST', err);
      alert('there has been an error; please try again later');
    });
  }
}


function test() {

}

// const arrayOfIds = students.map((value) => {
//   return value.id;
//   if (new Set(arrayOfIds).size < arrayOfIds.length) {
//     return true; // Duplicate Exists 
//   } else {
//     return false; // Duplicate doesnot  exists
//   }
// }

