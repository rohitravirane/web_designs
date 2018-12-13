// Loop an array.
function loopArray(arr, callback) {
  var x = 0;
  function innerCallback(arr, callback) {
    callback(arr[x], x, function() {
      x++;
      if (x < arr.length) {
        innerCallback(arr, callback);
      }
    });
  }
  innerCallback(arr, callback);
};

var timeouts = [];
function startTicker() {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  var tickerSpeed = 20;
  // Loop over all tickers.
  var $tickers = $('.ticker');
  $tickers.each(function() {
    $(this).attr('data-text', $(this).text());
  });
  loopArray($tickers, function(el, tickerI, tickerCallback) {
    var $el = $(el);
    var letters = $el.text().split('');
    $el.text('').addClass('js-show');
    letters.forEach(function() {
      $el.append('<span class="ticker__letter"></span>');
    });

    // Loop individual letters.
    loopArray(letters, function(l, letterI, callback) {
      var $letter = $el.find('.ticker__letter').eq(letterI);
      var letterPos = alphabet.indexOf(l);
      // No timeout on A or non-alphabetical characters.
      if (letterPos < 1) {
        $letter.text(l);
        if (letterI + 1 === letters.length) {
          tickerCallback();
          if (tickerI + 1 !== $tickers.length) {
            $el.after('<span class="separator">&bull;</span>');
          }
          else {
            removeTimeouts();
          }
        }
        callback();
      }
      else {
        var iterate = 0;
        var alphabetSlice = alphabet.split('').slice(0, letterPos + 1);
        alphabetSlice.forEach(function(a, i) {

          var t = setTimeout(function() {
            $letter.text(alphabet.charAt(iterate));
            if (iterate === letterPos) {
              if (letterI + 1 === letters.length) {
                tickerCallback();
                if (tickerI + 1 !== $tickers.length) {
                  $el.after('<span class="separator">&bull;</span>');
                }
                else {
                  removeTimeouts();
                }
              }
              var t2 = setTimeout(function() {
                callback();
              }, tickerSpeed);
              timeouts.push(t2);
            }
            iterate++;
          }, tickerSpeed * i);
          timeouts.push(t);
        });
      }
    }); // looparray letters
  }); // looparray tickers
}
startTicker();

// Reset ticker.
$('.ticker').on('click', function() {
  removeTimeouts();
  $('.separator').remove();
  $('.ticker').each(function() {
    var text = $(this).attr('data-text');
    $(this)
      .removeClass('js-show')
      .html(text);
  });
  startTicker();
});

function removeTimeouts() {
  timeouts.forEach(function(t, i) {
    clearTimeout(t);
    delete timeouts[i];
  });
}