document.addEventListener('DOMContentLoaded', function() {
  var keyInput = document.getElementById('gemKey');
  var dot = document.getElementById('statusDot');
  var statusText = document.getElementById('statusText');

  // Load saved key
  chrome.storage.local.get(['lr_gemini_key'], function(result) {
    if (result.lr_gemini_key) {
      keyInput.value = result.lr_gemini_key;
      dot.style.background = '#22C55E';
      statusText.textContent = 'Connected';
    }
  });

  // Save on change
  keyInput.addEventListener('input', function() {
    var key = keyInput.value.trim();
    chrome.storage.local.set({ lr_gemini_key: key });
    if (key) {
      dot.style.background = '#22C55E';
      statusText.textContent = 'Connected';
    } else {
      dot.style.background = '#FBBF24';
      statusText.textContent = 'Not configured';
    }
  });
});
